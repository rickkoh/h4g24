import TextToTextClass from "./TextToText.js";

class KeywordPipeline {
    static starting_prompt = "Identify all keywords and give a strength value in decimals from 0 to 1 for each keyword in the following format " +
        "'[keyword]: [strength],' such as 'Heavy Labour: 0.76,'. A keyword can only be 1 to 2 words long. Separate each keyword with a comma."

    static async identify(texts) {
        let input = this.starting_prompt + "\n"
        for (const text of texts) {
            input += text;
            input += "\n"
        }
        const response = await TextToTextClass.sendText(input);
        const keywords = response.split(",")
        const validKeywords = [];
        for (const keyword of keywords) {
            const pair = keyword.split(":");
            if (pair.length !== 2) continue;
            const value = parseFloat(pair[1]);
            if (isNaN(value)) continue;
            validKeywords.push({name: pair[0], strength: pair[1]})
        }

        return validKeywords
    }
}

export default KeywordPipeline;