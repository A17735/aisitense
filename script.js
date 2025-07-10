document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');

    const addMessage = (message, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = message;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    sendBtn.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatInput.value = '';
            getAiResponse(message);
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    const getAiResponse = async (userInput) => {
        const apiKey = 'AIzaSyCoyMBblo5TzC9Qq6zli2ieqjQE9-whqBk';
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

        try {
            const response = await fetch(`${url}?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": userInput
                                }
                            ]
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiMessage = data.candidates[0].content.parts[0].text;
            addMessage(aiMessage, 'ai');
        } catch (error) {
            console.error("Error fetching AI response:", error);
            addMessage("Sorry, I'm having trouble connecting to the AI. Please check the console for errors.", 'ai');
        }
    };

    // Card animation
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateX = (y / rect.height - 0.5) * -20;
            const rotateY = (x / rect.width - 0.5) * 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.switch input');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('light-mode');
    });
});
