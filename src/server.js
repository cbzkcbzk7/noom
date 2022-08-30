import http from "http";
import SocketIO from "socket.io";
import express from "express";



const app = express();

app.set('view engine', "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));


const handleListen = () => console.log('Listening on http://localhost:3000');

// http 서버와 webSocket 서버를 같은 서버에서 둘 다 돌릴 수 있는 코드 -> express를 사용해 http서버를 만듦
const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer); // http 서버 위에 socketio 서버를 올려줌

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event) => {
        console.log(`Socket Event:${event}`);
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName); // chat room 만들기 = socket room   
        done();
        socket.to(roomName).emit("welcome",socket.nickname); // 메세지 보내기
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach((room) =>
            socket.to(room).emit("bye", socket.nickname)
        );
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

// 둘 다 돌리기 원하지않으면 이 코드만 작성 -> http서버 위에 webSocket서버를 만듦
/*const wss = new WebSocket.Server({ server });

function handleConnection(socket) {
    console.log(socket);
}
wss.on("connection", handleConnection);*/

// websocket 코드
/*const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon"; 
    console.log("Connected to Browser ✔");
    socket.on("close", () => console.log("Disconnected from Browser ❌"));
    socket.on("message", (msg) => {
        const message = JSON.parse(msg.toString('utf8')); // parse : String을 다시 javascript Object로 변환
        switch (message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`)); 
            case "nickname":
                socket["nickname"] = (message.payload).toString('utf-8');
        }
             
    });
});*/

httpServer.listen(3000, handleListen);

