import ChatGPTClass from "./chatgpt.js";

class KeywordPipeline {

    static async identify(text) {
    const starting_prompt = `Given the following answers for a question, give me a set of 1-2 word keywords with a strength rating from 0.00 to 1.00 in the format '{keyword}-{strength}' with the delimiter ',':\n`;
    const input = starting_prompt + text;
    const response = await ChatGPTClass.sendText(input);
    const keywords = response.split(",")
    const validKeywords = [];
    for (const keyword of keywords) {
        const pair = keyword.split("-");
        if (pair.length !== 2) continue;
        const value = parseFloat(pair[1]);
        if (isNaN(value)) continue;
        validKeywords.push({name: pair[0], strength: pair[1]})
    }
    return validKeywords
}
}

export default KeywordPipeline;