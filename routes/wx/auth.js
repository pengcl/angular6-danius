var express = require('express');
var router = express.Router();
var CONFIG = require('../../config/wx.config');
var wx = require('../../utils/wx');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function (req, res, next) {

  if (!req.query.code) {//没有code参数
    const url = wx.OAuth.getCode(CONFIG.webHost + '/api/wx/auth?callbackUrl=' + req.query.callbackUrl);
    res.location(url);
    res.statusCode = 301;
    res.end('');
  }

  if (req.query.code) {
    wx.OAuth.getAccessToken(req.query.code).then(data => {
      if (!data.access_token) {
        res.location(wx.OAuth.getCode(req.headers.referer));
        res.statusCode = 301;
        res.end('');
      }

      var openid = data.openid;
      wx.getAccessToken().then(function (data) { //获取基础access_token
        var access_token = data;
        wx.getUserInfo(access_token.access_token, openid).then(function (data) {//获取微信用户信息

          if (req.query.callbackUrl.indexOf('?') !== -1) {
            res.location(req.query.callbackUrl + '&uid=' + data.openid);
          } else {
            res.location(req.query.callbackUrl + '?uid=' + data.openid);
          }
          res.statusCode = 301;
          res.end('');
        });
      });
    });
  }


  /*if (req.query.code) {
    wx.OAuth.getAccessToken(req.query.code).then(data => {
      /!*if (!data.access_token) {
        res.location(wx.OAuth.getCode(req.headers.referer));
        res.statusCode = 301;
        res.end('');
      }

      var openid = data.openid;
      wx.getAccessToken().then(function (data) { //获取基础access_token
        var access_token = data;
        wx.getUserInfo(access_token.access_token, openid).then(function (data) {//获取微信用户信息
          res.send(data)
        });
      });*!/
    });
  }*/
});

module.exports = router;
