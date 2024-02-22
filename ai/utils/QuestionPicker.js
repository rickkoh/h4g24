import TextToTextClass from "./TextToText.js";

class QuestionPicker {

    static async pick(theme, questions) {
        const starting_prompt = `Given the questions in the following template "{id}:{question}, Pick all questions related to ${theme} and output only the id separated by ","`
        let input = starting_prompt + "\n"
        for (const question of questions) {
            input += `${question.id}:${question.text}\n`;
        }

        return await TextToTextClass.sendText(input);
    }

}

export default QuestionPicker;