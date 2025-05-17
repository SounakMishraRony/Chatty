import axios from 'axios';
import { useState } from 'react';

interface Message {
    text: string;
    sender: "user" | "bot";
}

const useChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = async (message: string) => {
        const newMessages: Message[] = [
            ...messages,
            { text: message, sender: "user" },
        ];
        setMessages(newMessages);

        try {
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'user', content: message }
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer {openapi_secret_key}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const botMessage: Message = {
                text: response.data.choices[0].message.content,
                sender: "bot",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return { messages, sendMessage };
};

export default useChatBot;