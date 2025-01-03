// Chatbot initialization
document.addEventListener("DOMContentLoaded", () => {
    // Initialize chat history from localStorage
    const loadChatHistory = () => {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        history.forEach(msg => {
            const chatLi = createChatLi(msg.message, msg.type);
            chatbox.appendChild(chatLi);
        });
        chatbox.scrollTo(0, chatbox.scrollHeight);
    };

    // Save message to localStorage
    const saveMessage = (message, type) => {
        const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
        history.push({
            message: sanitizeMessage(message),
            type: type,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('chatHistory', JSON.stringify(history));
    };

    // Sanitize message content
    const sanitizeMessage = (message) => {
        const div = document.createElement('div');
        div.textContent = message;
        return div.innerHTML;
    };

    // Simple markdown parser
    const parseMarkdown = (text) => {
        // Bold (**text**)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italic (*text*)
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Links ([text](url))
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
        // Code (`code`)
        text = text.replace(/`(.*?)`/g, '<code>$1</code>');
        // Line breaks (two spaces at end of line)
        text = text.replace(/  \n/g, '<br>');
        return text;
    };

    // Load initial chat history
    loadChatHistory();
});

// DOM Elements
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");
const chatbotPopup = document.getElementById('chatbot');
const chatInput = document.querySelector("#chat-input-textarea");
const sendChatBtn = document.querySelector("#send-btn");

let userMessage;
let lastMessageTime = 0;
const MESSAGE_RATE_LIMIT = 1000; // 1 second between messages

if (!chatbox || !chatbotToggler || !chatbotCloseBtn || !chatbotPopup || !chatInput || !sendChatBtn) {
    console.error("One or more chatbot elements not found in the DOM.");
    throw new Error("Chatbot initialization failed - missing required elements");
}

// Clear chat history
const clearChatHistory = () => {
    chatbox.innerHTML = '';
    localStorage.removeItem('chatHistory');
    const clearedLi = createChatLi("Chat history cleared.", "system");
    chatbox.appendChild(clearedLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
};

// Function to create chat list items
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    
    // Set ARIA attributes based on message type
    chatLi.setAttribute('role', 'listitem');
    chatLi.setAttribute('aria-live', className === 'incoming' ? 'polite' : 'off');
    
    let chatContent = className === "outgoing"
        ? `<p role="text" aria-label="You said: ${sanitizeMessage(message)}"></p>`
        : `<span class="material-symbols-outlined" aria-hidden="true">smart_toy</span>
           <p role="text" aria-label="Chatbot response: ${sanitizeMessage(message)}"></p>`;
    
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    
    // Add timestamp for screen readers
    const timestamp = document.createElement('span');
    timestamp.className = 'sr-only';
    timestamp.textContent = ` at ${new Date().toLocaleTimeString()}`;
    chatLi.querySelector("p").appendChild(timestamp);
    
    return chatLi;
};

const handleChat = async () => {
    try {
        userMessage = chatInput.value.trim();
        if (!userMessage) {
            chatInput.focus();
            return;
        }

        // Disable input and button during processing
        chatInput.disabled = true;
        sendChatBtn.disabled = true;

        // Add user message
        const outgoingChatLi = createChatLi(userMessage, "outgoing");
        chatbox.appendChild(outgoingChatLi);
        saveMessage(userMessage, "outgoing");

        // Add typing indicator
        const typingLi = createChatLi("Typing...", "typing");
        chatbox.appendChild(typingLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        // Get bot response
        const response = await getBotResponse(userMessage);
        
        // Remove typing indicator and add response
        chatbox.removeChild(typingLi);
        const incomingChatLi = createChatLi(response, "incoming");
        chatbox.appendChild(incomingChatLi);
        saveMessage(response, "incoming");

        // Clear input and re-enable controls
        chatInput.value = "";
        chatInput.disabled = false;
        sendChatBtn.disabled = false;
        chatInput.focus();
        chatbox.scrollTo(0, chatbox.scrollHeight);
    } catch (error) {
        console.error("Chat error:", error);
        const errorLi = createChatLi("Sorry, something went wrong. Please try again.", "error");
        chatbox.appendChild(errorLi);
        
        // Re-enable controls on error
        chatInput.disabled = false;
        sendChatBtn.disabled = false;
        chatInput.focus();
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

// Initialize event listeners
const initEventListeners = () => {
    // Send message on button click
    sendChatBtn.addEventListener("click", handleChat);

    // Send message on Enter key (without shift)
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleChat();
        }
    });

    // Auto-resize textarea
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + "px";
    });

    // Prevent form submission
    document.querySelector('.chat-input').addEventListener('submit', (e) => {
        e.preventDefault();
    });
};

// Initialize chatbot after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Ensure the chatbot is hidden on initial load
    chatbotPopup.classList.remove('active');
    
    // Initialize all chatbot functionality
    initChatbot();
    initEventListeners();
});

const getBotResponse = async (message) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Basic response patterns
    const responses = [
        { pattern: /hello|hi|hey/i, response: "Hello! How can I assist you today?" },
        { pattern: /help|support/i, response: "I'm here to help! What do you need assistance with?" },
        { pattern: /thank|thanks/i, response: "You're welcome! Let me know if you need anything else." }
    ];

    // Find matching pattern
    const match = responses.find(r => r.pattern.test(message));
    return match ? match.response : "I'm sorry, I didn't understand that. Could you please rephrase?";
};

// Initialize chatbot interactions
const initChatbot = () => {
    // Add event listeners
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

    // Add welcome message when opened
    chatbotToggler.addEventListener('click', () => {
        if (chatbotPopup.classList.contains('active')) {
            const welcomeChatLi = createChatLi("Welcome to our chatbot! Type a message to get started.", "incoming");
            chatbox.appendChild(welcomeChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        }
    });
};

// Initialize chatbot after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Ensure the chatbot is hidden on initial load
    chatbotPopup.classList.remove('active');
    
    // Initialize all chatbot functionality
    initChatbot();
});
