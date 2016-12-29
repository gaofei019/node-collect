'use strict';
const jsdom=require('jsdom').jsdom;

var str='<html>\
  <body>\
    <div class="box" title="aaa"></div>\
    <div class="box" title="bbb"></div>\
    <div class="box" title="ccc"></div>\
  </body>\
</html>';

var document=jsdom(str);

var arr=document.querySelectorAll('.box');
var aTitle=[];

for(var i=0;i<arr.length;i++){
    aTitle.push(arr[i].title);
}

console.log(aTitle);

