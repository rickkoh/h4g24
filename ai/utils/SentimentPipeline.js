import { pipeline, env } from "@xenova/transformers";

class SentimentPipeline {
    static task = "sentiment-analysis";
    static model = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }

        return this.instance;
    }

    static async output(text) {
        const instance = await this.getInstance();
        return instance(text);
    }
}

export default SentimentPipeline;