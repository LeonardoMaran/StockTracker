const express = require('express');
const router = express.Router();

// model
const Stock = require('../../models/Stock');

// routes 
router.get('/', (req, res) => {
    //res.send('get Todos');
    Stock.find()
        .sort({date: -1})
        .then(stocks => res.json(stocks));
});

// create a new stock 
router.post('/', (req, res) => {
    const newStock = new Stock({
        code: req.body.code,
        description: req.body.description
    });
    newStock.save().then((stock) => res.json(stock));
});

// delete todo by id 
router.delete('/:id', (req, res) => {
    console.log("here");
    console.log(req);
    Stock.findById(req.params.id)
        .then(stock => stock.remove().then(() => res.json({ 
            deletedStock: req.params.id, 
            success: true })))
         .catch(err => res.status(404).json({ success: false }));
});
module.exports = router;