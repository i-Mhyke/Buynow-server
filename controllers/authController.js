const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res.status(403).json({
        status: 'fail',
        error: 'User with email already exists',
      });
    }
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      role: 'buyer',
    });
    const token = signToken(user._id, user.role);
    res.status(201).json({
      status: 'success',
      token,
      message: 'Signin successful',
      data: {
        user,
      },
    });
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      const error = errors[0];
      res.status(500).json({
        status: 'fail',
        error: error,
      });
    } else {
      res.status(400).json({
        status: 'fail',
        error: err,
      });
    }
  }
  next();
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      status: 'fail',
      error: 'Please provide your email and password',
    });
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: 'fail',
      error: 'Login credentials does not match any user',
    });
    next();
  }
  const token = signToken(user._id, user.role);
  res.cookie('jwt', token, { expires: new Date(Date.now() + 9999) });
  res.status(200).json({
    status: 'success',
    token,
    message: 'Login successful',
    user: {
      Id: user._id,
      Email: user.email,
      First_Name: user.firstName,
      Last_Name: user.lastName,
      Role: user.role,
    },
  });
  next();
};
exports.signOut = (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).json({
    status: 'success',
    message: 'User signout successful',
  });
};
exports.protectRoutes = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      token = req.headers.authorization.split(' ')[1];
    } else if (!token) {
      return next(
        res.status(401).json({
          status: 'fail',
          error: 'You are not logged in, please login to access this route',
        })
      );
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if (!currentUser || currentUser.active === false) {
      return next(
        res.status(401).json({
          status: 'fail',
          error: 'User with token does not exist',
        })
      );
    }
    req.user = currentUser;
    console.log(req.user);
  } catch (err) {
    res.status(401).json({
      status: 'fail',
      error: 'You are not authenticated',
    });
    next(err);
  }
  next();
};
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        res.status(403).json({
          status: 'fail',
          error: 'You do not have permission to perform this action',
        })
      );
    }
    next();
  };
};
exports.restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      res.status(403).json({
        status: 'fail',
        error: 'You are not authorized to perform this action',
      })
    );
  }
  next();
};
