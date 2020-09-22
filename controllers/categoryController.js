const Category = require('../models/categoryModel');

exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      name: req.body.name,
    });
    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: `${err}: An error occured while creating the category`,
    });
  }
};

exports.deleteCategory = async (req, res, next) => {
  await Category.findByIdAndDelete({ _id: req.params.category_id }, function (err, data) {
    if (err) {
      res.status(400).json({
        status: 'fail',
        error: 'An error occured',
      });
      console.log(err);
    }
    res.status(204).json({
      status: 'success',
      message: 'Category deleted successfully',
      data,
    });
  });
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return next(
        res.status(404).json({
          status: 'fail',
          error: 'No category found',
        })
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'Categories retrieved',
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};

exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById({ _id: req.params.category_id });
    if (!category) {
      res.status(404).json({
        status: 'fail',
        error: 'Category does not exist',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Category retrieved',
      data: {
        category,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};
