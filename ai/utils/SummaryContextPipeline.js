import ChatGPTClass from "./chatgpt.js";

class SummaryContextPipeline {

    // Output just Text
    static async trend(formName, text) {
        const starting_prompt = `Given the following question and answer for a form called ${formName}, the numbers provided are not percentages but rather decimal significance values from 0 to 1. summarise the feedback within 250 word:`
        const input = starting_prompt + "\n" + text;
        return await ChatGPTClass.sendText(input);
    }
}

export default SummaryContextPipeline;