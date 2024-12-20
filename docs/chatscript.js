// Selectors for chatbot elements
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".chatbot-close-btn");

let userMessage;

// Your OpenAI API Key
const API_KEY = "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";

// Function to create chat list items
const createChatLi = (message, className) => {
  // Create a chat <li> element with the passed message and className
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

// Function to fetch response from OpenAI API
const generateResponse = (incomingChatLi) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLi.querySelector("p");

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // Add a loading indicator while waiting for the API response
  messageElement.textContent = "Thinking...";
  
  fetch(API_URL, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const responseMessage = data.choices[0].message.content.trim();
      messageElement.textContent = responseMessage;
    })
    .catch((error) => {
      messageElement.textContent = "Error occurred. Please try again.";
    });
};

// Function to handle sending user messages
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get and trim the user's input
  if (!userMessage) return; // Exit if the input is empty

  // Append user's message to the chatbox
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));

  // Clear the input field
  chatInput.value = "";

  // Append an incoming placeholder message and fetch a response
  const incomingChatLi = createChatLi(" ", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);
  generateResponse(incomingChatLi);
};

// Add event listeners for chatbot interactions
sendChatBtn.addEventListener("click", handleChat);

chatInput.addEventListener("keyup", (e) => {
  // Send message on Enter key press
  if (e.key === "Enter") {
    handleChat();
  }
});

// Toggle chatbot visibility
chatbotToggler.addEventListener("click", () => {
  document.body.classList.toggle("show-chatbot");
});

// Close chatbot on button click
chatbotCloseBtn.addEventListener("click", () => {
  document.body.classList.remove("show-chatbot");
});
