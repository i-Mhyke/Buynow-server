const Product = require('../models/productsModel');

exports.createProducts = async (req, res, next) => {
  try {
    const product = await Prooduct.create({
      name: req.body.name,
      price: req.body.price,
      quantityAvailable: req.body.available,
      category: req.params.category_id,
      merchant: req.user.id,
    });
  } catch (err) {}
};
