import TextToTextClass from "./TextToText.js";

class SummaryPipeline {

    // Output just Text
    static async trend(question, text) {
        const starting_prompt = `Explain the following content within 250 word for the question ${question}:`
        const input = starting_prompt + "\n" + text;
        return await TextToTextClass.sendText(input);
    }
}

export default SummaryPipeline;