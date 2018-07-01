let express = require('express');
let router = express.Router();
let path = require('path');
let request = require('request-promise-native');
let csv = require('csv-parse');
let fs = require('fs');
const key = process.env.STOCK_KEY;

let readStockList = function (req, res, next) {
  let stockList = [];
  let reader = fs.createReadStream('/Users/section11/Documents/itmd469/project2/public/stockList.csv')
    .pipe(csv({delimiter: ','}))
    .on('data', function (data) {
      data.forEach(function (stock) {
        stockList.push(stock);
      });
    })
    .on('end', function () {
      req.stockList = stockList;
      next();
    });
}

let getStocksBatchQuotes = function(req, res, next) {
  let options = {
    uri: `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${req.stockList.join(',')}&apikey=${key}`,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  };
  console.log(options);
  return new Promise(function (resolve, reject) {
    request(options).then(function (data) {
      req.data = JSON.parse(data);
      next();
    })
    .catch(function (err) {
      req.data = 'Server error';
    });
  });
}


router.use(readStockList);
router.use(getStocksBatchQuotes);

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.data);
  res.render('index', { title: 'Stock Market Data', data: req.data });
});

module.exports = router;
