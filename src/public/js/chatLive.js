// Conectar al servidor de Socket.IO
const socket = io();

// Escuchar el evento "receiveMessage" y mostrar los mensajes en el chat
socket.on("receiveMessage", (message) => {
  const chat = document.getElementById("chat");
  const p = document.createElement("p");
  p.innerHTML = `<strong>${message.sender}:</strong> ${message.content}`;
  chat.appendChild(p);
});

// Manejar el envío del formulario para enviar un nuevo mensaje
const chatForm = document.getElementById("chatForm");
chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const user = document.getElementById("user").value;
  const message = document.getElementById("message").value;

  // Enviar el mensaje al servidor a través de Socket.IO
  socket.emit("sendMessage", { sender: user, content: message });

  // Limpiar los campos de usuario y mensaje después de enviarlos
  document.getElementById("user").value = "";
  document.getElementById("message").value = "";
});
