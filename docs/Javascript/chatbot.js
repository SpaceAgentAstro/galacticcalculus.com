const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input #send-btn");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");
const chatbotPopup = document.getElementById('chatbot');

let userMessage;

// Function to create chat list items
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
        className === "outgoing"
            ? `<p></p>`
            : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";

    const incomingChatLi = createChatLi(" ", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Add event listeners for chatbot interactions
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleChat();
    }
});

// Toggle chatbot visibility
chatbotToggler.addEventListener('click', () => {
    chatbotPopup.classList.toggle('active');
    chatbotToggler.innerHTML = chatbotPopup.classList.contains('active') ? 'X' : '<span class="material-symbols-outlined">mode_comment</span>';
});

// Close chatbot on button click
chatbotCloseBtn.addEventListener("click", () => {
    chatbotPopup.classList.remove('active');
    chatbotToggler.innerHTML = '<span class="material-symbols-outlined">mode_comment</span>';
});

// Ensure the chatbot is hidden on load
document.addEventListener('DOMContentLoaded', function() {
    chatbotPopup.classList.remove('active');
});
