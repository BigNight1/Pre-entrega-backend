const socket = io();

socket.on("receiveMessage", (message) => {
  const chat = document.getElementById("chat");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
  chat.appendChild(p);
});

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("message");

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = messageInput.value;

  // Obtén el nombre de usuario desde el data-attribute del formulario
  const user = chatForm.getAttribute("data-username");

  // Emite el mensaje al servidor
  socket.emit("sendMessage", { sender: user, content: message });

  messageInput.value = "";
});
