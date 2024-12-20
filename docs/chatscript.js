// Loads dotenv configuration
require('dotenv').config();

// Selectors for chatbot elements
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");

let userMessage;

<<<<<<< HEAD
<<<<<<< HEAD
=======
// Your OpenAI API Key
const API_KEY = process.env.OPENAI_API_KEY;

>>>>>>> 4a7dc91 (v2.3.0.1.1)
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
=======
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
>>>>>>> fa985d0 (Remove sensitive information)
};

// Function to fetch response from the backend server
const generateResponse = (incomingChatLi) => {
<<<<<<< HEAD
    const messageElement = incomingChatLi.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: userMessage,
        }),
    };

    // Add a loading indicator while waiting for the API response
    messageElement.textContent = "Thinking...";

    fetch('/api/chat', requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            const responseMessage = data.data.choices[0].message.content.trim();
            messageElement.textContent = responseMessage;
        })
        .catch((error) => {
            messageElement.textContent = "Error occurred. Please try again.";
            console.error('Error:', error);
        });
=======
  const messageElement = incomingChatLi.querySelector("p");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: userMessage,
    }),
  };

  // Add a loading indicator while waiting for the API response
  messageElement.textContent = "Thinking...";

  fetch('/api/chat', requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      const responseMessage = data.choices[0].message.content.trim();
      messageElement.textContent = responseMessage;
    })
    .catch((error) => {
      messageElement.textContent = "Error occurred. Please try again.";
      console.error('Error:', error);
    });
>>>>>>> fa985d0 (Remove sensitive information)
};

// Function to handle sending user messages
const handleChat = () => {
<<<<<<< HEAD
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatInput.value = "";

    const incomingChatLi = createChatLi(" ", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
=======
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatInput.value = "";

  const incomingChatLi = createChatLi(" ", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  generateResponse(incomingChatLi);
>>>>>>> fa985d0 (Remove sensitive information)
};

// Add event listeners for chatbot interactions
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keyup", (e) => {
<<<<<<< HEAD
    if (e.key === "Enter") {
        handleChat();
    }
=======
  if (e.key === "Enter") {
    handleChat();
  }
>>>>>>> fa985d0 (Remove sensitive information)
});

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

// Close chatbot on button click
chatbotCloseBtn.addEventListener("click", () => {
<<<<<<< HEAD
    document.body.classList.remove("show-chatbot");
=======
  document.body.classList.remove("show-chatbot");
>>>>>>> fa985d0 (Remove sensitive information)
});