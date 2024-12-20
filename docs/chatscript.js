const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbot = document.querySelector(".chatbot");
const sendBtn = document.getElementById("send-btn");
const chatbox = document.querySelector(".chatbox");

chatbotToggler.addEventListener("click", () => {
  chatbot.classList.toggle("show");
});

sendBtn.addEventListener("click", () => {
  const input = document.querySelector(".chat-input input");
  const message = input.value.trim();
  if (message) {
    const outgoingChat = document.createElement("li");
    outgoingChat.className = "chat outgoing";
    outgoingChat.innerHTML = `<p>${message}</p>`;
    chatbox.appendChild(outgoingChat);
    input.value = "";
  }
});
