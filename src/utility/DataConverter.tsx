export function getColumnsFromJson(data: any) {
  if (data === undefined) return [];
  const columns = [];
  for (const key in data[0]) {
    columns.push({
      title: key,
      dataIndex: key,
      key: key,
    });
  }
  return columns;
}

export function groupResponsesByQuestion(data: { [key: string]: string }[]): {
  [key: string]: string[];
} {
  const groupedResponses: { [key: string]: string[] } = {};

  data.forEach((response) => {
    Object.keys(response).forEach((key) => {
      if (!groupedResponses[key]) {
        groupedResponses[key] = [];
      }
      groupedResponses[key].push(response[key]);
    });
  });

  return groupedResponses;
}
