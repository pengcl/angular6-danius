var request = require('request');
var fs = require('fs');
var Q = require('q');
var md5 = require('md5');
var config = require('../config/wx.config');
var util = require('../utils/util');

exports.sign = function (param) {//生成支付签名
  var str = Object.keys(param).filter(function (key) {
    return param[key] !== undefined && param[key] !== '' && param[key] !== null;
  }).sort().map(function (key) {
    return key + '=' + param[key];
  }).join("&") + "&key=" + config.appKey;

  return md5(str).toUpperCase();
};

exports.getAccessToken = function () { //获取基础access_token;
  var deferred = Q.defer();
  var now = Date.parse(new Date().toString());
  fs.readFile('../data/accessToken.json', 'utf-8', function (err, data) {
    var data = JSON.parse(data);
    if (!err && data.expires_time && data.expires_time >= now) {//如果accessToken.json文件存在，并且没有过期
      deferred.resolve(data);
    } else {//如果accessToken.json不存在，或者已过期
      request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config.appID + '&secret=' + config.appSecret, function (error, response, body) {
        console.log(body);
        if (!error && response.statusCode == 200) {//请求成功
          body = JSON.parse(body);
          if (body.access_token) {
            body.expires_time = now + 7000000;//添加过期时间
            fs.writeFile('../data/accessToken.json', JSON.stringify(body), {
              flag: 'w',
              encoding: 'utf-8',
              mode: '0666'
            }, function (err) {
              if (!err) {
                console.log("文件写入成功");
              } else {
                console.log(err)
              }
              deferred.resolve(body);
            });
          } else {
            deferred.reject(new Error(body));
          }
        } else {
          deferred.reject(new Error(error));
        }
      });
    }
  });
  return deferred.promise;
};

exports.getTicket = function () { //获取ticket
  var deferred = Q.defer();
  var now = Date.parse(new Date().toString());
  fs.readFile('../data/ticket.json', 'utf-8', function (err, data) {
    var data = JSON.parse(data);
    if (!err && data.expires_time && data.expires_time >= now) {//如果ticket.json文件存在，并且没有过期
      deferred.resolve(data);
    } else {//如果ticket.json不存在，或者已过期
      this.getAccessToken().then(function (data) {
        request('http://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=' + data.access_token, function (error, response, body) {
          if (!error && response.statusCode == 200) {//请求成功
            body = JSON.parse(body);
            if (body.ticket) {
              body.expires_time = now + 300000;//添加过期时间
              fs.writeFile('../data/ticket.json', JSON.stringify(body), {
                flag: 'w',
                encoding: 'utf-8',
                mode: '0666'
              }, function (err) {
                if (!err) {
                  console.log("文件写入成功");
                } else {
                  console.log(err)
                }
                deferred.resolve(body);
              });
            } else {
              console.log(body);
              deferred.reject(new Error(body));
            }
          } else {
            deferred.reject(new Error(error));
          }
        });
      });
    }
  });
  return deferred.promise;
};

exports.createUnifiedOrder = function (opts, fn) {

  opts.nonce_str = util.createNonceStr();
  opts.appid = config.appID;
  opts.mch_id = config.mch_id;
  opts.trade_type = "JSAPI";
  opts.sign = this.sign(opts);

  request({
    url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
    method: 'POST',
    body: util.buildXML(opts)
  }, function (err, response, body) {
    util.parseXML(body, fn);
  });
};

exports.getBrandWCPayRequestParams = function (order, fn) {
  this.createUnifiedOrder(order, (err, data) => {
    var params = {
      appId: config.appID,
      timeStamp: Math.floor(Date.now() / 1000) + "",
      nonceStr: data.nonce_str,
      package: "prepay_id=" + data.prepay_id,
      signType: "MD5"
    };
    params.paySign = this.sign(params);
    fn(err, params);
  });
};

exports.OAuth = {
  getCode: function (redirect_uri) {
    const url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + config.appID + "&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
    return url
  },
  getAccessToken: function (code) {
    var deferred = Q.defer();
    request('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + config.appID + '&secret=' + config.appSecret + '&code=' + code + '&grant_type=authorization_code', function (error, response, body) {
      if (!error && response.statusCode == 200) {//请求成功
        body = JSON.parse(body);
        deferred.resolve(body);
      } else {
        deferred.reject(new Error(error));
      }
    });
    return deferred.promise;
  }
};

exports.getUserInfo = function (access_token, openid) {
  var deferred = Q.defer();
  request('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + access_token + '&openid=' + openid + '&lang=zh_CN', function (error, response, body) {
    if (!error && response.statusCode == 200) {//请求成功
      body = JSON.parse(body);
      deferred.resolve(body);
    } else {
      deferred.reject(new Error(error));
    }
  });
  return deferred.promise;
};
