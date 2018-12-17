//获取xml文件
var xmlData;
function getXmlData(data) {
  var parser = require("../lib/dom-parser.js")
  // var dom = require("../lib/dom.js");
  var xmlParser = new parser.DOMParser()
  xmlData = xmlParser.parseFromString(data)
  // var xmlSerializer = new dom.XMLSerializer();
  // return xmlSerializer.serializeToString(doc, false, null);
  return xmlData;
}

//获取某个dom节点对应的值
var findNodeByTagArr = new Array();
findNodeByTagArr = function (doc, node){
  return doc.getElementsByTagName(node)
}

module.exports = {
  getXmlData: getXmlData,
  findNodeByTagArr: findNodeByTagArr,
}