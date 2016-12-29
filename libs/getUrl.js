'use strict';
const http=require('http');
const https=require('https');
const urlLib=require('url');

module.exports=getUrl;

function getUrl(url){
    return new Promise(function(resolve,reject){
        _get(url);
        function _get(url){
            console.log('正在请求', url);
            var oUrl=urlLib.parse(url);
            var mod=oUrl.protocol=='https:'?https:http;
            const options={
                hostname:oUrl.hostname,
                path:oUrl.path
            };

            mod.request(options,function(res){
                if(res.statusCode!=200){
                    if(res.statusCode==302){//再请求一次
                        _get(res.headers.location);
                    }else{
                        reject();
                    }
                }else{
                    var arr=[];
                    res.on('data',(data)=>{
                        arr.push(data);
                    });
                    res.on('end',()=>{
                        resolve(Buffer.concat(arr));
                    });
                    res.on('error',reject); //通信错误
                }
            }).end();
        }
    });
};