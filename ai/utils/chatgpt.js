import { ChatGPTAPI } from "chatgpt";

class ChatGPTClass {
    static api = null;
    static getInstance() {
        this.api = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: {
                model: "gpt-3.5-turbo"
            }
        })
        return this.api;
    }

    static async sendText(text) {
        let response = ""
        const chatGPT = this.getInstance();
        response = await chatGPT.sendMessage(text);
        return response.text;
    }
}
export default ChatGPTClass;