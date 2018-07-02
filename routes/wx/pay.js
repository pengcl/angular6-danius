var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('../../config/config');

var util = require('../../utils/util');
var wx = require('../../utils/wx');

router.route('/pay').post(function (req, res, next) {
  const body = req.body;
  //body.notify_url = config.notify_url;
  //body.spbill_create_ip = '113.111.49.18';
  //body.trade_type = 'JSAPI';
  //body.sign = wx.paySign(body);

  wx.getBrandWCPayRequestParams(body, function (error, params) {
    if (error) {
      res.send(new Error(error));
    } else {
      res.send(params);
    }
  });
});

module.exports = router;
