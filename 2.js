'use strict';
const getUrl=require('./libs/getUrl');
const gbk=require('gbk');
const jsdom=require('jsdom').jsdom;
const fs=require('fs');

getPages('肉松饼',2).then(
    function(data){
        console.log(`一共${data.length}个数据`);
        fs.writeFile('./data/tm.json',JSON.stringify(data),function(err){
            if(err){
                console.log('写入有错',err);
            }else{
                console.log('写好了');
            }
        });
    },function(err){
        console.log(err);
    }
);

function getPages(keyword, page_count){
    return new Promise(function(resolve, reject){
        var i=1;
        var result=[];

        _qu();
        function _qu(){
            getFromListHTML(keyword,i).then(function(data){
                result=result.concat(data);
                i++;
                if(i<=page_count){
                    _qu();
                }else{  
                    resolve(result);
                }
            }, reject);
        };
    });
};

function getFromListHTML(keyword, page){
    var url=`https://list.tmall.com/search_product.htm?spm=a220m.1000858.0.0.Hsxa5b&s=${(page-1)*60}&q=${encodeURIComponent(keyword)}&sort=s&style=g&from=mallfp..pc_1_suggest&suggest=0_1&type=pc#J_Filter`;

    
    return new Promise(function(resolve, reject){
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
            var str=gbk.toString('utf-8', data);
            var aData=[];

            var aProduct=document.querySelectorAll('.product');

            for(var item of aProduct){
                try{
                    aData.push({
                        name: item.querySelector('.productTitle a').innerHTML,
                        price: item.querySelector('.productPrice em').title,
                        sale: normalizeCount(item.querySelector('.productStatus em').innerHTML)
                    });
                }catch(e){};
            }


            resolve(aData);
        }, reject);
    });
};

