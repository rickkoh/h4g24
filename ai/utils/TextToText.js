import {pipeline, env} from "@xenova/transformers";
import 'dotenv/config'

class TextToTextClass {
    static task = "text2text-generation";
    static model = "Xenova/LaMini-Flan-T5-783M"
    static instance = null;

    static async sendText(text) {
        const instance = await this.getInstance();
        return await instance(text, { add_special_tokens: true, max_new_tokens: 60, repetition_penalty: 1.2});
    }
    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {progress_callback});
        }
        return this.instance;
    }

}

export default TextToTextClass;