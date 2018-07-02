var request = require('request');
var md5 = require('md5');
var config = require('../config/config');
var util = require('../utils/util');

exports.paySign = function (param) {//生成支付签名
  var str = Object.keys(param).filter(function (key) {
    return param[key] !== undefined && param[key] !== '' && param[key] !== null;
  }).sort().map(function (key) {
    return key + '=' + param[key];
  }).join("&") + "&key=" + config.appKey;

  return md5(str).toUpperCase();
};

exports.createUnifiedOrder = function (opts, fn) {

  opts.nonce_str = util.createNonceStr();
  opts.appid = config.appID;
  opts.mch_id = config.mch_id;
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

  order.trade_type = "JSAPI";
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
