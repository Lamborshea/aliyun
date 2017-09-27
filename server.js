const http = require("http");
const fs = require("fs");
const url = require("url");
const util = require("util");
const path = require("path");
const router = require('./router.js');

function start() {
    function onRequest(request, response) {
        console.log("Request received.");
        console.log("request.url: " + request.url);// /index.html

        const pathname = url.parse(request.url).pathname;
        router.route(pathname);

        console.log("Request for " + pathname + " received.");
        // response.writeHead(200, {"Content-Type": "text/plain"});
        // response.setHeader("Content-Type","text/html;charset='utf-8'");
        console.log("pathname.substr(1): " + pathname.substr(1));
        console.time("计时！");
        fs.readFile("./" + pathname.substr(1), 'utf-8',function (err, data) {
            if (err) {
                console.log(err);
                console.log(err.stack);
                // HTTP 状态码: 404 : NOT FOUND
                // Content Type: text/plain
                
                response.writeHead(404, {'Content-Type': 'text/html', 'charset': 'utf-8'});
            } else {
                // HTTP 状态码: 200 : OK
                // Content Type: text/plain
                response.writeHead(200, {"Content-Type": "text/html"});
                // response.writeHead(200, {'Content-Type': 'text/html'});

                // 响应文件内容
                response.write(data);
                // response.write(data,'binary');
                // response.write(data.toString());
                console.log("成功读取文件");
            }
                //  发送响应数据
                response.end();
                // response.end(util.inspect(url.parse(request.url, true)));
                // response.end(data);
                console.timeEnd("计时！");
        });
    }

    http.createServer(onRequest).listen(8080);
    console.log("Server has started. Server is listening on 8080.");
}

module.exports.start = start