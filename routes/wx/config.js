var express = require('express');
var sha1 = require('sha1');
var router = express.Router();
var config = require('../../config/config');
let {WxSvc} = require('../../utils/service/wx.js');
var utils = require('../../utils/utils');

var mongoose = require('mongoose');
var Users = require('../../utils/db/modules/users');//导入模型数据模块


/* GET home page. */
router.get('/', function (req, res, next) {

  WxSvc.getTicket().then(function (data) {
    var wxConfig = WxSvc.sign(data.ticket, req.query.url);
    res.send(wxConfig);
  });
});

module.exports = router;
