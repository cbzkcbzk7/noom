import http from "http";
import WebSocket from "ws";
import express from "express";


const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');

// http 서버와 webSocket 서버를 같은 서버에서 둘 다 돌릴 수 있는 코드 -> express를 사용해 http서버를 만듦
const server = http.createServer(app);

// 둘 다 돌리기 원하지않으면 이 코드만 작성 -> http서버 위에 webSocket서버를 만듦
const wss = new WebSocket.Server({ server });

function handleConnection(socket) {
    console.log(socket);
}
wss.on("connection", handleConnection);

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    console.log("Connected to Browser ✔");
    socket.on("close", () => console.log("Disconnected from Browser ❌"));
    socket.on("message", (message) => {
        sockets.forEach(aSocket => aSocket.send(message.toString('utf8')));      
    });
});

server.listen(3000, handleListen);

