'use strict';
const getUrl=require('./libs/getUrl');
const gbk=require('gbk');
const jsdom=require('jsdom').jsdom;

//
getFromListHTML('衣服');
function getFromListHTML(keyword){
    var url=`https://list.tmall.com/search_product.htm?q=${encodeURIComponent(keyword)}&type=p&vmarket=&spm=875.7931836%2FA.a2227oh.d100&xl=iph_1&from=mallfp..pc_1_suggest`;

    getUrl(url).then(function(data){
        function normalizeCount(str){
            if(str.endsWith('万笔')){
                return parseInt(parseFloat(str)*10000);
            }else if(str.endsWith('亿笔')){
                return parseInt(parseFloat(str)*100000000);
            }else{
                return parseInt(str);
            }
        }
    
        var str=gbk.toString('utf-8',data);
        var aData=[];

        var document=jsdom(str);
        var aProduct=document.querySelectorAll('.product');

        for(var item of aProduct){
            try{
                aData.push({
                    name:item.querySelector('.productTitle a').innerHTML,
                    price: item.querySelector('.productPrice em').title,
                    sale: normalizeCount(item.querySelector('.productStatus em').innerHTML)
                });
            }catch(e){}
	}
	 console.log(aData);	
        },function(err){
            console.log('错了',err);
        });
};