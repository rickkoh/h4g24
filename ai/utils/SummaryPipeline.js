import TextToTextClass from "./TextToText.js";

class SummaryPipeline {

    static async trend(question, text) {
        const starting_prompt = `Explain the following content within 250 word:`
        console.log(starting_prompt);
        const input = starting_prompt + "\n" + text;
        return await TextToTextClass.sendText(input);
    }
}

export default SummaryPipeline;