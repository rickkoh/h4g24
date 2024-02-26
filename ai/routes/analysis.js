import express from "express";
import supabase from "../utils/supabase.js";
import SentimentPipeline from "../utils/SentimentPipeline.js";
import KeywordPipeline from "../utils/KeywordPipeline.js";
import LlamaClass from "../utils/TextToText.js";
import SummaryPipeline from "../utils/SummaryPipeline.js";
import SummaryContextPipeline from "../utils/SummaryContextPipeline.js";
import SummaryActivityPipeline from "../utils/SummaryActivityPipeline.js";
const router = express.Router();

const ANALYSIS_TYPE = ["SENTIMENTAL", "SUMMARY", "KEYWORD"];
const QUESTION_TYPE = ["MULTIPLE_CHOICE", "CHECKBOX", "LINEAR_SCALE", "TEXT_ANSWER"];

/* PATCH individual analysis  */
router.post('/responses/id/:id', async function(req, res) {
    const { id } = req.params;
    const analysis_output = {
        sentiments: {},
        summary: "",
        keywords: [],
    };
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
    const { analysis_type } = question_id;

    switch ( analysis_type ) {
        case null:
        case "NONE":
        case ANALYSIS_TYPE[1]:
        case ANALYSIS_TYPE[2]:
            res.status(200).send("There is nothing to analyse");
            return;
        case ANALYSIS_TYPE[0]:
            analysis_output.sentiments = await SentimentPipeline.output(answer);
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
router.post('/questions/id/:id', async function(req, res) {
    const { id } = req.params;
    const analysis_output = {
        sentiments: {},
        summary: "",
        keywords: [],
    };
    const { data: qData, error: qError } = await supabase.from("questions").select().eq("id", id);
    if (!qData || (qError || (qData.length === 0))) {
        res.status(400).send("Unable to retrieve Question with given id");
        return;
    }
    const question = qData[0];
    const { analysis_type, question_type } = question;
    if (!analysis_type && question_type !== QUESTION_TYPE[3]) {
        res.status(200).send("There is nothing to analyse");
        return;
    }
    const { data: rData, error: rError } = await supabase.from("responses").select().eq("question_id", id);
    if (rError) {
        console.error(rError);
        res.status(400).send("Error retrieving responses for question");
        return
    }
    if (rData.length === 0) {
        res.status(200).send("There is nothing to analyse");
        return;
    }

    let input = "";
    switch ( analysis_type ) {
        case null:
        case "NONE":
            if (question_type === QUESTION_TYPE[3]) {
                for (const r of rData) input += r.answer + "\n";
                analysis_output.summary = await SummaryPipeline.trend(question.text, input);
                const { error: qError } =  await supabase.from("questions").update({analysis_output}).eq("id", id);
                if (qError) {
                    res.status(400).send("Error updating responses");
                    return;
                }
                break;
            } else {
                res.status(200).send("There is nothing to analyse");
                return;
            }
        case ANALYSIS_TYPE[0]:
            for (const r of rData) {
                analysis_output.sentiments = await SentimentPipeline.output(r.answer);
                const {error: rError} = await supabase.from("responses").update({analysis_output}).eq("id", r.id);
                if (rError) {
                    res.status(400).send("Error updating responses");
                    return;
                }
            }
            break;
        case ANALYSIS_TYPE[1]:
            for (const r of rData) input += r.answer + "\n";
            analysis_output.summary = await SummaryPipeline.trend(question.text, input);
            const { error: qError } =  await supabase.from("questions").update({analysis_output}).eq("id", id);
            if (qError) {
                res.status(400).send("Error updating responses");
                return;
            }
            break;
        case ANALYSIS_TYPE[2]:
            for (const response of rData) input += response.answer + "\n";
            analysis_output.keywords = await KeywordPipeline.identify(input);
            const {error: kwError} = await supabase.from("questions").update({analysis_output}).eq("id", id)
            if (kwError) {
                res.status(400).send("Error updating question");
                return;
            }
            break;
    }

    res.status(200).send("Question responses updated");
})

/* PATCH all responses under the questions under a survey */
router.post('/forms/id/:id', async function(req, res) {
    const { id } = req.params;

    const { data: qData, error: qError } = await supabase.from("questions").select().eq("form_id", id);

    if (qError) {
        res.status(400).send("Error fetching the questions");
        return;
    }

    if (qData && qData.length === 0) {
        res.status(200).send("There is nothing to analyse");
        return;
    }

    let summaryContextInput = ""

    let responseQuantity = 0;

    for (const question of qData) {
        const { analysis_type, id: qId, text, question_type } = question;

        if (!analysis_type && question_type !== QUESTION_TYPE[3]) {
            // Averaging the output for non-AI questions
            // switch (question_type) {
            //     Text_Answer is ignored if no AI is used to analyse
            //     case QUESTION_TYPE[3]:
            //         continue;
            //     case QUESTION_TYPE[1]:
            //     case QUESTION_TYPE[0]:
            //         const {data: oData, error: oError} = await supabase.from("responses").select().eq("question_id", qId);
            //
            //
            // }
            continue;
        }
        const {data: rData, error: rError} = await supabase.from("responses").select().eq("question_id", qId);

        if (rError) {
            res.status(400).send("Error fetching responses");
            return
        }
        if (rData.length === 0) {
            continue;
        }
        responseQuantity = rData.length;

        const analysis_output = {
            sentiments: {},
            summary: "",
            keywords: [],
        };

        let input = "";
        switch (analysis_type) {
            case null:
            case "NONE":
                for (const r of rData) input += r.answer + "\n";
                input = await SummaryPipeline.trend(question.text, input);
                analysis_output.summary = input;
                const {error: qaError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                if (qaError) {
                    res.status(400).send("Error updating question");
                    return;
                }
                break;
            case ANALYSIS_TYPE[0]:
                let accumulatedAnswer = ""
                for (const r of rData) {
                    accumulatedAnswer += r.answer + "\n";
                    const sentiments = await SentimentPipeline.output(r.answer);
                    analysis_output.sentiments = sentiments;
                    const {error: ruError} = await supabase.from("responses").update({analysis_output}).eq("id", r.id);
                    if (ruError) {
                        res.status(400).send("Error updating response");
                        return;
                    }
                }
                const sentiments = await SentimentPipeline.output(accumulatedAnswer);
                input = JSON.stringify(sentiments);
                analysis_output.sentiments = sentiments;
                const {error: ruError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                if (ruError) {
                    res.status(400).send("Error updating response");
                    return;
                }
                break;
            case ANALYSIS_TYPE[1]:
                for (const r of rData) input += r.answer + "\n";
                const summary = await SummaryPipeline.trend(question.text, input);
                input = summary;
                analysis_output.summary = summary;
                const {error: qError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                if (qError) {
                    res.status(400).send("Error updating question");
                    return;
                }
                break;
            case ANALYSIS_TYPE[2]:
                for (const response of rData) input += response.answer + "\n";
                const keywords = await KeywordPipeline.identify(input);
                analysis_output.keywords = keywords;
                input = JSON.stringify(keywords);
                const {error: kwError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                if (kwError) {
                    res.status(400).send("Oops! Something happenened");
                    return;
                }
                break;
            default:
                continue;
        }
        summaryContextInput += "question: " + text + "\n" + "answer: " + input + "\n";
    }

    const {data: fData, error: fError} = await supabase.from("forms").select().eq("id", id);

    if (fError) {
        res.status(400).send("Error fetching forms");
        return
    }

    const form_analysis_output = {
        sentiments: {},
        summary: "",
        keywords: [],
    };
    form_analysis_output.summary = await SummaryContextPipeline.trend(fData[0].title, summaryContextInput);

    const {data: fuData, error: fuError} = await supabase.from("forms").update({analysis_output: form_analysis_output}).eq("id", id);
    if (fuError) {
        res.status(400).send("Error updating forms");
        return;
    }

    res.status(200).send("Form, questions and responses updated")

})

router.post("/activities/id/:id", async function(req, res) {
    const { id } = req.params;
    const activity_analysis_output = {
        sentiments: {},
        summary: "",
        keywords: [],
    };
    const activity_analysis_input = {
        sentiments: "",
        summary: "",
        keywords: "",

    }
    const { data: afData, error: afError } = await supabase.from("forms").select().eq("activity_id", id);
    for (const form of afData) {
        const { id: fId } = form;
        let readOnly = false;
        if (form.analysis_output != null) {
            readOnly = true;
        }

        const { data: qData, error: qError } = await supabase.from("questions").select().eq("form_id", fId);
        if (qError) {
            res.status(400).send("Error fetching the questions");
            return;
        }

        if (qData && qData.length === 0) {
            res.status(200).send("There is nothing to analyse");
            return;
        }

        let summaryContextInput = ""

        let responseQuantity = 0;

        for (const question of qData) {
            const { analysis_type, id: qId, text, analysis_output: stored_question_analysis, question_type } = question;

            if (!analysis_type && question_type !== QUESTION_TYPE[3]) {
                continue;
            }
            const {data: rData, error: rError} = await supabase.from("responses").select().eq("question_id", qId);

            if (rError) {
                res.status(400).send("Error fetching responses");
                return
            }
            if (rData.length === 0) {
                continue;
            }
            responseQuantity = rData.length;

            const analysis_output = {
                sentiments: {},
                summary: "",
                keywords: [],
            };

            let input = "";
            switch (analysis_type) {
                case null:
                case "NONE":
                    if (readOnly) {
                        break;
                    }
                    for (const r of rData) input += r.answer + "\n";
                    input = await SummaryPipeline.trend(question.text, input);
                    analysis_output.summary = input;
                    const {error: qaError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                    if (qaError) {
                        res.status(400).send("Error updating question");
                        return;
                    }
                    break;

                case ANALYSIS_TYPE[0]:
                    let accumulatedAnswer = ""
                    for (const r of rData) {
                        if (readOnly) {
                            activity_analysis_input.sentiments += r.answer + "\n";
                            continue;
                        }
                        accumulatedAnswer += r.answer + "\n";
                        const sentiments = await SentimentPipeline.output(r.answer);
                        analysis_output.sentiments = sentiments;
                        const {error: ruError} = await supabase.from("responses").update({analysis_output}).eq("id", r.id);
                        if (ruError) {
                            res.status(400).send("Error updating response");
                            return;
                        }
                    }
                    if (readOnly) {
                        break;
                    }
                    const sentiments = await SentimentPipeline.output(accumulatedAnswer);
                    input = JSON.stringify(sentiments);
                    analysis_output.sentiments = sentiments;
                    const {error: ruError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                    if (ruError) {
                        res.status(400).send("Error updating questions");
                        return;
                    }
                    break;
                case ANALYSIS_TYPE[1]:
                    if (readOnly) {
                        break;
                    }
                    for (const r of rData) input += r.answer + "\n";
                    const summary = await SummaryPipeline.trend(question.text, input);
                    input = summary;
                    analysis_output.summary = summary;
                    const {error: qError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                    if (qError) {
                        res.status(400).send("Error updating question");
                        return;
                    }
                    break;
                case ANALYSIS_TYPE[2]:
                    for (const response of rData) input += response.answer + "\n";
                    activity_analysis_input.keywords += input;
                    const keywords = await KeywordPipeline.identify(input);
                    analysis_output.keywords = keywords;
                    input = JSON.stringify(keywords);
                    const {error: kwError} = await supabase.from("questions").update({analysis_output}).eq("id", qId);
                    if (kwError) {
                        res.status(400).send("Oops! Something happenened");
                        return;
                    }
                    break;
                default:
                    continue;
            }
            if (!readOnly) summaryContextInput += "question: " + text + "\n" + "answer: " + input + "\n";
        }


        if (readOnly) {
            activity_analysis_input.summary += form.analysis_output.summary + "\n";
            continue;
        }
        const {data: fData, error: fError} = await supabase.from("forms").select().eq("id", fId);

        if (fError) {
            res.status(400).send("Error fetching forms");
            return
        }
        const form_analysis_output = {
            sentiments: {},
            summary: "",
            keywords: [],
        };
        form_analysis_output.summary = await SummaryContextPipeline.trend(fData[0].title, summaryContextInput);
        activity_analysis_input.summary += form_analysis_output.summary + "\n";

        const {data: fuData, error: fuError} = await supabase.from("forms").update({analysis_output: form_analysis_output}).eq("id", fId);
        if (fuError) {
            res.status(400).send("Error updating forms");
            return;
        }
    }

    const {data: activity, error: aError} = await supabase.from("activities").select().eq("id", id);
    if (aError) {
        res.status(400).send("Error fetching forms");
        return
    }
    activity_analysis_output.sentiments = await SentimentPipeline.output(activity_analysis_input.sentiments);
    activity_analysis_output.keywords = await KeywordPipeline.identify(activity_analysis_input.keywords);
    activity_analysis_output.summary = await SummaryActivityPipeline.trend(activity.title, activity_analysis_input.summary);
    await supabase.from("activities").update({analysis_output: activity_analysis_output }).eq("id", id);
    res.status(200).send("Activity updated")
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
    await supabase.from("responses").update({analysis_output}).neq('analysis_output', null);
    await supabase.from("questions").update({analysis_output}).neq('analysis_output', null);
    await supabase.from("forms").update({analysis_output}).neq('analysis_output', null);
    await supabase.from("activities").update({analysis_output}).neq('analysis_output', null);
    res.status(200).send("Analysis cleared");
})

export default router;