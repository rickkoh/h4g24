import express from "express";
import supabase from "../utils/supabase.js";
import ClassificationPipeline from "../utils/ClassificationPipeline.js";
import KeywordPipeline from "../utils/KeywordPipeline.js";
const router = express.Router();

const ANALYSIS_TYPE = ["SENTIMENTAL", "SUMMARY", "KEYWORD"];

/* PATCH individual analysis  */
router.put('/responses/id/:id', async function(req, res, next) {
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
    }

    const entry = data[0];
    const { answer, question_id } = entry
    const question = question_id[0];
    const { analysis_type } = question;
    let response;

    switch ( analysis_type ) {
        case null:
        case "NONE":
            res.status(200).send("There is nothing to analyse");
            return;
        case ANALYSIS_TYPE[0]:
            const classifier = await ClassificationPipeline.getInstance();
            response = await classifier(answer);
            break;
        case ANALYSIS_TYPE[1]:
            // Summary cannot be performed on individual response
            break;
        case ANALYSIS_TYPE[2]:
            // Keyword won't be performed on individual response
            break;
    }
    res.status(200).send("Response updated");
});


/* PATCH all responses under a question */
router.put('/questions/id/:id', async function(req, res) {
    const { id } = req.params;
    const { qData, qError } = await supabase.from("questions").select().eq("id", id);
    if (qError || qData.length === 0) {
        res.status(400).send("Oops! Something happened");
        return;
    }
    const question = data[0];
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

    let response;
    switch ( analysis_type ) {
        case null:
        case "NONE":
            res.status(200).send("There is nothing to analyse");
            return;
        case ANALYSIS_TYPE[0]:
            const classifier = await ClassificationPipeline.getInstance();
            response = await classifier(answer);
            break;
        case ANALYSIS_TYPE[1]:

            break;
        case ANALYSIS_TYPE[2]:

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
        const { analysis_type } = question;

        const { rData, rError } = await supabase.from("responses").select().eq("question_id", question.id);
        if (rError) {
            res.status(400).send("Oops! Something happened");
            return
        }

        if (rDate.length === 0) {
            continue;
        }

        for (const response of rData) {
            let response;
            switch (analysis_type) {
                case null:
                case "NONE":
                    continue
                case ANALYSIS_TYPE[0]:
                    const classifier = await ClassificationPipeline.getInstance();
                    response = await classifier(answer);
                    break;
                case ANALYSIS_TYPE[1]:
                    break;
                case ANALYSIS_TYPE[2]:
                    break;
            }
        }
    }

    res.status(200).send("Survey question responses updated")
})


router.post("/chatgpt", async function(req, res) {
    const { body } = req;
    const { data } = body;
    res.status(200).send(await KeywordPipeline.identify([data]));
})

export default router;