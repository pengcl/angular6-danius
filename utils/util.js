var xml2js = require('xml2js');

exports.buildXML = function(json){
  var builder = new xml2js.Builder();
  return builder.buildObject(json);
};

exports.parseXML = function(xml, fn){
  var parser = new xml2js.Parser({ trim:true, explicitArray:false, explicitRoot:false });
  parser.parseString(xml, fn||function(err, result){});
};

exports.createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15);
};
