import ChatGPTClass from "./chatgpt.js";

class SummaryActivityPipeline {

    // Output just Text
    static async trend(activity, text) {
        const starting_prompt = `Given the following question and answer for an activity called ${activity}, summarise the feedback within 100 word:`
        const input = starting_prompt + "\n" + text;
        return await ChatGPTClass.sendText(input);
    }
}

export default SummaryActivityPipeline;