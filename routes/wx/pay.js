var express = require('express');
var request = require('request');
var router = express.Router();
var config = require('../../config/wx.config');

var util = require('../../utils/util');
var wx = require('../../utils/wx');

router.get('/ip', function (req, res, next) {
  const ip = util.getClientIp(req);
  res.send(ip);
});

router.route('/pay').post(function (req, res, next) {
  const body = req.body;
  body.spbill_create_ip = util.getClientIp(req);
  body.notify_url = config.notify_url;

  console.log(body);

  wx.getBrandWCPayRequestParams(body, function (error, params) {
    if (error) {
      res.send(new Error(error));
    } else {
      res.send(params);
    }
  });
});

module.exports = router;
