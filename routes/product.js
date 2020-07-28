const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

/* GET ALL PRODUCTS. */
router.get('/', function (req, res) {
  const page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // SET THE CURRENT PAGE NUMBER
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; // SET THE LIMIT OF ITEMS PER PAGE
  let startValue;
  let endValue;

  startValue = page > 0 ? page * limit - limit : 0; // 0,10,20,30
  endValue = page > 0 ? page * limit : 10;
  database
    .table('products as p')
    .join([{ table: 'categories as c', on: 'c.id = p.cat_id' }])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.quantity',
      'p.description',
      'p.image',
      'p.id',
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ message: 'No Products founds' });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// GET SINGLE PRODUCT
router.get('/:id', function (req, res) {
  const productId = req.params.id;

  if (productId) {
    database
      .table('products as p')
      .join([{ table: 'categories as c', on: 'c.id = p.cat_id' }])
      .withFields([
        'c.title as category',
        'p.title as name',
        'p.price',
        'p.quantity',
        'p.description',
        'p.image',
        'p.images',
        'p.id',
      ])
      .filter({ 'p.id': productId })
      .get()
      .then((prod) => {
        if (prod) {
          res.status(200).json({
            product: prod,
          });
        } else {
          res.json({ message: 'No Product found' });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ message: 'No ID' });
  }
});

// GET ALL PRODUCTS FROM ONE PARTICULAR CATEGORY
router.get('/category/:catName', function (req, res) {
  // FETCH THE CATEGORY NAME FROM THE URL
  const catName = req.params.catName;
  const page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // SET THE CURRENT PAGE NUMBER
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; // SET THE LIMIT OF ITEMS PER PAGE
  let startValue;
  let endValue;

  startValue = page > 0 ? page * limit - limit : 0; // 0,10,20,30
  endValue = page > 0 ? page * limit : 10;
  database
    .table('products as p')
    .join([
      {
        table: 'categories as c',
        on: `c.id = p.cat_id WHERE c.title LIKE '%${catName}%'`,
      },
    ])
    .withFields([
      'c.title as category',
      'p.title as name',
      'p.price',
      'p.description',
      'p.quantity',
      'p.image',
      'p.id',
    ])
    .slice(startValue, endValue)
    .sort({ id: 0.1 })
    .getAll()
    .then((prods) => {
      if (prods.length > 0) {
        res.status(200).json({
          count: prods.length,
          products: prods,
        });
      } else {
        res.json({ message: `No Products founds from ${catName} category.` });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
