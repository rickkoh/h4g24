import { QuestionInsert, ResponseInsert } from "@/types/types";

export function getColumnsFromJson(data: any) {
  if (data === undefined) return [];
  const columns = [];
  for (const key in data[0]) {
    columns.push({
      title: key,

      key: key,
    });
  }
  return columns;
}

export function groupResponsesByQuestion(data: { [key: string]: string }[], questions: QuestionInsert[], user_id: string): ResponseInsert[] {
  const groupedResponses: ResponseInsert[] = [];
  data.forEach((response) => {
    Object.keys(response).forEach((key) => {
      let timestamp = response["Timestamp"];
      if (key !== "Timestamp") {
        const question = questions.find((question) => question.text === key);
        if (question) {
          groupedResponses.push({
            id: crypto.randomUUID(),
            question_id: question.id,
            answer: response[key],
            created_at: timestamp,
            updated_at: timestamp,
            created_by: user_id,
          });
        }
      }
    });
  });
  return groupedResponses;
}
