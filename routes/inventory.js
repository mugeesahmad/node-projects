const express = require('express');
const router = express.Router();

// Utilities
const uniqueID = require('../utilities/randomID');
const isNumeric = require('../utilities/isNumeric');
const capitalise = require('../utilities/capitalise');

// Models

const Medicine = require('../models/Medicine');

// Routes config

router.get('/', (req, res) => {
  Medicine.find().then((data) => {
    res.json(data);
  });
});

router.post('/', (req, res) => {
  if (
    !req.body.name ||
    !req.body.price ||
    !req.body.formula ||
    !req.body.stock
  ) {
    res.status(400).json({
      status: 400,
      msg: 'error! please fill all the fields.',
    });
  } else if (!isNumeric(req.body.stock) || !isNumeric(req.body.price)) {
    res.status(400).json({
      status: 400,
      msg: 'price and stock must be numeric values!',
    });
  } else {
    const medicine = new Medicine({
      name: capitalise(req.body.name),
      formula: capitalise(req.body.formula),
      stock: parseInt(req.body.stock),
      price: parseInt(req.body.price),
      productID: uniqueID(),
    });
    medicine.save().then(() => {
      res.status(200).json({
        status: 200,
        msg: 'entry successfully added!',
      });
    });
  }
});

router.patch('/id/:id', (req, res) => {
  const newData = req.body;
  const { name, formula, stock, price } = req.body;

  console.log(newData);

  let filled = false;
  for (const k in newData) {
    console.log(k + ':' + typeof k);

    if (
      newData[k] == 'name' ||
      newData[k] == 'price' ||
      newData[k] == 'stock' ||
      newData[k] == 'formula'
    ) {
      filled = true;
      console.log('true');
    }
  }

  if (!filled) {
    return res.status(400).json({
      status: 400,
      msg: `please fill at least one field! Accepted keys are 'name', 'formula', 'price',and 'stock'`,
    });
  }

  Medicine.find({ productID: req.params.id }).then(
    (data) => {
      if (!data[0]) {
        return res.status(404).json({
          status: 404,
          msg: 'No product found with the given product ID!',
        });
      } else {
        const uData = {};
        // uData.name = newData.name != '' ? capitalise(newData.name) : data.name;
        // uData.formula =
        //   newData.formula != '' ? capitalise(newData.formula) : data.formula;
        // uData.price = newData.price != '' ? newData.price : data.price;
        // uData.stock = newData.stock != '' ? newData.stock : data.stock;
        data = data[0];
        uData.name = name != '' && name != undefined ? name : data.name;
        uData.formula =
          formula != '' && formula != undefined ? formula : data.formula;
        uData.price = price != '' && price != undefined ? price : data.price;
        uData.stock = stock != '' && stock != undefined ? stock : data.stock;
        console.log(uData);
        uData.name = capitalise(uData.name);
        uData.formula = capitalise(uData.formula);
        Medicine.updateOne({ productID: req.params.id }, uData).then(
          (nProduct) => {
            if (nProduct.acknowledged) {
              res.status(200).json({
                status: 200,
                msg: 'Product has been successfully updated!',
              });
            } else {
              res.status(500).json({
                status: 500,
                msg: 'Internal server error!',
              });
            }
          }
        );
      }
    },
    (err) => {
      console.log(err);
    }
  );
});

router.delete('/id/:id', (req, res) => {
  const receivedID = req.params.id;
  Medicine.find({ productID: receivedID }).then((response) => {
    console.clear();
    if (response != []) {
      Medicine.deleteOne({ productID: receivedID })
        .then((r) => {
          res.json({
            status: 200,
            msg: 'Product successfully deleted!',
          });
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({
            status: 500,
            msg: `Failed to delete the product. Please try again!`,
          });
        });
    } else {
      res.status(404).json({
        status: 404,
        msg: 'ERROR: No product with the sent productID found!',
      });
    }
  });
});

module.exports = router;