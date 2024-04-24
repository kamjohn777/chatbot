requestAnimationFrame('dotenv').config();
const chatInput = document.querySelector('.chat-input textarea');
const sendChatBtn = document.querySelector('.chat-input span');
const chatbox = document.querySelector('.chatbox');

let userMessage;
const API_KEY = process.env.OPENAI_API_KEY;

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p>${message}</p>` : `<span class="material-icons">
    smart_toy
    </span><p>${message}</p>`;
    chatLi.innerHTML = chatContent;
    return chatLi; 
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions" ;
    const messageElement =incomingChatLi.querySelector('p');

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: userMessage
            }
        ]
    })
}
fetch(API_URL, requestOptions)
    .then(response => response.json())
    .then(data => {
        // console.log(data.choices[0].message.content);
        // chatbox.appendChild(createChatLi(data.choices[0].message.content, "incoming"));
        messageElement.textContent = data.choices[0].message.content;
    })
    .catch(error => console.log('error', error));
    // chatInput.value = "";
    messageElement.textContent = "Oops! something went wrong. Can you please try again?";
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    // console.log(userMessage);
    if(!userMessage) return;

    // Appends user's message to chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi );
        generateResponse(incomingChatLi);
    }, 600)
}

sendChatBtn.addEventListener('click', handleChat)
