import TextToTextClass from "./TextToText.js";

class SummaryPipeline {

    static async trend(question, texts) {
        const starting_prompt = `Summarise all the following text and provide the trend that answers the question '${question}' within 20 to 30 words`
        let input = starting_prompt + "\n"
        for (const text of texts) {
            input += text;
            input += "\n"
        }

        return await TextToTextClass.sendText(input);
    }
}

export default SummaryPipeline;