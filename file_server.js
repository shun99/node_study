'use strict';
var fs = require('fs'),
    url = require('url'),
    path = require('path'),
    http = require('http');
// 从命令行参数获取root目录，默认是当前目录:
var root = path.resolve(process.argv[2] || '.');
console.log('Static root dir:'+root);

//统一处理错误
function error(request, response){
    console.log('404 ' + request.url);
    // 发送404响应
    response.writeHead(400);
    response.end('404 not found');
}

// 创建服务器:
var server = http.createServer(function(request, response){
    //获得URL的path，类似 '/css/bootstrap.css':
    var pathname = url.parse(request.url).pathname;
    console.log('pathname'+pathname);
    //获得对应的本地文件路径，类似 '/srv/www/css/bootstrap.css':
    var filepath = path.join(root, pathname);
    console.log('filepath'+filepath);
    // 获取文件状态:
    fs.stat(filepath, function(err, stats){
        if(err){
            error(request, response);
        }
        //文件存在:
        if(stats.isFile()){
            console.log('200'+request.url);
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);        
        }else{
            var files = ['index.html','default.html'];
            for(var i=0; i<files.length; i++){
                var defaultFile = path.join(root, files[i]);
                if(fs.existsSync(defaultFile)){
                    console.log('200 ' + request.url);
                    // 发送200响应
                    response.writeHead(200);
                    // 将文件流导向response
                    fs.createReadStream(defaultFile).pipe(response);
                    return;
                }
            }
            error(request, response);
        }    
    });
});

server.listen(8080);
console.log('server is running at http://127.0.0.1:8080/');