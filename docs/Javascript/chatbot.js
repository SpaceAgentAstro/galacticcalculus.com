document.addEventListener("DOMContentLoaded", () => {
    const chatInput = document.querySelector("#chat-input-textarea");
    const sendChatBtn = document.querySelector("#send-btn");

    if (chatInput && sendChatBtn) {
        // Function to handle chat
        const handleChat = () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            // Simulate a response from the chatbot
            console.log("User  message:", userMessage);
            console.log("Chatbot response: Hello, how can I assist you?");
            chatInput.value = ""; // Clear the input
        };

        // Add event listeners
        sendChatBtn.addEventListener("click", handleChat);
        chatInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                handleChat();
            }
        });
    } else {
        console.error("Chatbot elements not found in the DOM.");
    }
});

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

    const outgoingChatLi = createChatLi(userMessage, "outgoing");
    chatbox.appendChild(outgoingChatLi);

    // Simulate a response from the chatbot
    const incomingChatLi = createChatLi("Hello, how can I assist you?", "incoming");
    chatbox.appendChild(incomingChatLi);

    chatInput.value = "";
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

// Add a welcome message when the chatbot is opened
chatbotToggler.addEventListener('click', () => {
    if (chatbotPopup.classList.contains('active')) {
        const welcomeChatLi = createChatLi("Welcome to our chatbot! Type a message to get started.", "incoming");
        chatbox.appendChild(welcomeChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
});
