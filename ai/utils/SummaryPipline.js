import ChatGPTClass from "./chatgpt.js";

class SummaryPipeline {
    starting_prompt = "Summarise all the following text and provide the trend that answer 'what do most people say?' within 20 to 30 words"

    static async trend(question, texts) {
        let input = this.starting_prompt + "\n"
        for (const text of texts) {
            input += text;
            input += "\n"
        }

        return await ChatGPTClass.sendText(input);
    }
}

export default SummaryPipeline;