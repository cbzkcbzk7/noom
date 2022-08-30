const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value,roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}
function handleNicknameSubmit(event) {
    event.preventDefalut();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}
    function showRoom() {
        welcome.hidden = true;
        room.hidden = false;
        const h3 = room.querySelector("h3");
        h3.innerHTML = `Room ${roomName}`;
        const msgForm = room.querySelector("#msg");
        const nameForm = room.querySelector("#name");
        msgForm.addEventListener("submit", handleMessageSubmit);
        nameForm.addEventListener("submit", handleNicknameSubmit);
    }
function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    // emit : argument 를 보낼 수 있음 websocket의 send 역할, 어떤 이름이든 상관없이 특정 이름을 event할 수 있음(ex: room)
     // websocket은 object를 보낼 수 없어서 string변환 후 다시 object변환을 했지만 socketio는 그럴 필요 없음
    socket.emit("enter_room", input.value, showRoom);// 끝날 때 실행되는 function을 넣고싶으면 꼭 마지막에 넣어야함
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user) => {
    addMessage(`${user} joined!`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left ㅠㅠ`);
});

socket.on("new_message", addMessage);