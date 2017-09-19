const http = require("http");

const start => () {
    function onRequest(request, response) {
      console.log("Request received.");
      response.writeHead(200, {"Content-Type": "text/plain"});
      response.write("Hello World");
      response.end();
    }

    http.createServer(onRequest).listen(1080);
    console.log("Server has started.");
}

module.exports.start = start