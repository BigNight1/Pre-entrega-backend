const socket = io();
socket.on("receiveMessage", message => {
  const chat = document.getElementById("chat");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
  chat.appendChild(p);
});
const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", event => {
  event.preventDefault();
  const user = document.getElementById("user").value;
  const message = document.getElementById("message").value;
  socket.emit("sendMessage", {
    sender: user,
    content: message
  });
  document.getElementById("user").value = "";
  document.getElementById("message").value = "";
});