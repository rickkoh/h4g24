import express from "express";
import supabase from "../utils/supabase.js";
import SentimentPipeline from "../utils/SentimentPipeline.js";
import KeywordPipeline from "../utils/KeywordPipeline.js";
import LlamaClass from "../utils/TextToText.js";
import SummaryPipeline from "../utils/SummaryPipeline.js";
const router = express.Router();

const ANALYSIS_TYPE = ["SENTIMENTAL", "SUMMARY", "KEYWORD"];

/* PATCH individual analysis  */
router.put('/responses/id/:id', async function(req, res) {
    const { id } = req.params;

    const { data, error } = await supabase.from("responses").select(`
        answer,
        analysis_output,
        question_id (
            analysis_type
        )
    `).eq("id", id);

    if (error) {
        console.error(error);
        res.status(400).send("Oops! Something happened");
        return;
    }

    if (data.length === 0) {
        res.status(200).send("There is nothing to analyse")
        return;
    }

    const entry = data[0];
    const { answer, question_id } = entry
    const question = question_id[0];
    const { analysis_type } = question;
    let analysis_output = "";

    switch ( analysis_type ) {
        case null:
        case "NONE":
        case ANALYSIS_TYPE[1]:
        case ANALYSIS_TYPE[2]:
            res.status(200).send("There is nothing to analyse");
            return;
        case ANALYSIS_TYPE[0]:
            analysis_output = await SentimentPipeline.output(answer);
            const { error } = await supabase.from("responses").update({analysis_output}).eq("id", id);
            if (error) {
                res.status(400).send("Oops! Something happened");
                return;
            }
            break;
    }
    res.status(200).send(analysis_output);
});


/* PATCH all responses under a question */
router.put('/questions/id/:id', async function(req, res) {
    const { id } = req.params;
    const { qData, qError } = await supabase.from("questions").select().eq("id", id);
    if (qError || qData.length === 0) {
        res.status(400).send("Oops! Something happened");
        return;
    }
    const question = qData[0];
    const { analysis_type } = question;
    if (analysis_type) {
        res.status(200).send("There is nothing to analyse");
        return;
    }
    const { rData, rError } = await supabase.from("responses").select().eq("question_id", id);
    if (rError) {
        res.status(400).send("Oops! Something happened");
        return
    }
    if (rData.length === 0) {
        res.status(200).send("There is nothing to analyse");
        return;
    }

    let analysis_output = "";
    let input = "";
    switch ( analysis_type ) {
        case null:
        case "NONE":
            res.status(200).send("There is nothing to analyse");
            return;
        case ANALYSIS_TYPE[0]:
            for (const r of rData) {
                analysis_output = await SentimentPipeline.output(r.answer);
                const {error: rError} = await supabase.from("responses").update({analysis_output}).eq("id", r.id);
                if (rError) {
                    res.status(400).send("Oops! Something happened");
                    return;
                }
            }
            break;
        case ANALYSIS_TYPE[1]:
            for (const r of rData) input += r.answer + "\n";
            analysis_output = await SummaryPipeline.trend(question.text, input);
            const { error: qError } =  await supabase.from("questions").update({analysis_output}).eq("id", id);
            if (qError) {
                res.status(400).send("Oops! Something happened");
                return;
            }
            break;
        case ANALYSIS_TYPE[2]:
            for (const response of rData) input += response.answer + "\n";
            analysis_output = await KeywordPipeline.identify(input);
            const {error: kwError} = await supabase.from("question_keywords").insert(analysis_output);
            if (kwError) {
                res.status(400).send("Oops! Something happened");
                return;
            }
            break;
    }

    res.status(200).send("Question responses updated");
})

/* PATCH all responses under the questions under a survey */
router.put('/forms/id/:id', async function(req, res) {
    const { id } = req.params;

    const { qData, qError } = await supabase.from("questions").select().eq("form_id", id);

    if (qError) {
        res.status(400).send("Oops! Something happened");
        return;
    }

    if (qData.length === 0) {
        res.status(200).send("There is nothing to analyse");
        return;
    }

    for (const question of qData) {
        const { analysis_type, qId } = question;

        if (analysis_type) {
            res.status(200).send("There is nothing to analyse");
            return;
        }
        const {rData, rError} = await supabase.from("responses").select().eq("question_id", qId);

        if (rError) {
            res.status(400).send("Oops! Something happened");
            return
        }
        if (rData.length === 0) {
            res.status(200).send("There is nothing to analyse");
            return;
        }

        let analysis_output = "";
        let input = "";
        switch (analysis_type) {
            case null:
            case "NONE":
                res.status(200).send("There is nothing to analyse");
                return;
            case ANALYSIS_TYPE[0]:
                for (const r of rData) {
                    analysis_output = await SentimentPipeline.output(r.answer);
                    const {error: rError} = await supabase.from("responses").update({analysis_output}).eq("id", r.id);
                    if (rError) {
                        res.status(400).send("Oops! Something happened");
                        return;
                    }
                }
                break;
            case ANALYSIS_TYPE[1]:
                for (const r of rData) input += r.answer + "\n";
                analysis_output = await SummaryPipeline.trend(question.text, input);
                const {error: qError} = await supabase.from("questions").update({analysis_output}).eq("id", id);
                if (qError) {
                    res.status(400).send("Oops! Something happened");
                    return;
                }
                break;
            case ANALYSIS_TYPE[2]:
                for (const response of rData) input += response.answer + "\n";
                analysis_output = await KeywordPipeline.identify(input);
                const {error: kwError} = await supabase.from("question_keywords").insert(analysis_output);
                if (kwError) {
                    res.status(400).send("Oops! Something happened");
                    return;
                }
                break;
        }
    }
    res.status(200).send("Survey question responses updated")
})


router.post("/chatgpt", async function(req, res) {
    const { body } = req;
    const { data } = body;
    res.status(200).send(await KeywordPipeline.identify([data]));
})

router.post("/llama", async function(req, res) {
    const { body } = req;
    const { data } = body;
    res.status(200).send(await LlamaClass.sendText(data));
})


router.put("/clear", async function(req, res) {
    const analysis_output = null;
    await supabase.from("responses").update({analysis_output});
    await supabase.from("questions").update({analysis_output});
    await supabase.from("question_keywords").delete();
    res.status(200).send("Analysis cleared");
})

export default router;