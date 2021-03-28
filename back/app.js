const http = require("http");
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);
  res.write("<h1>Hello node1</h1>");
  res.end("Hello node");
});
server.listen(3065, () => {
  console.log("서버 실행중");
});
