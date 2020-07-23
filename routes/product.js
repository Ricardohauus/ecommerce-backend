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

module.exports = router;
