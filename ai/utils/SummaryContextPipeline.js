import ChatGPTClass from "./chatgpt.js";

class SummaryContextPipeline {

    // Output just Text
    static async trend(formName, text) {
        const starting_prompt = `Given the following question and answer for a form called ${formName}, summarise the feedback within 100 word:`
        const input = starting_prompt + "\n" + text;
        return await ChatGPTClass.sendText(input);
    }
}

export default SummaryContextPipeline;