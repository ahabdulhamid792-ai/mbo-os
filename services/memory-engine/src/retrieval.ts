import { getAllMemories } from "./storage";

export function searchMemory(query: string) {
  const memories = getAllMemories();

  const normalizedQuery =
    query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return memories.filter((memory) => {
    const searchableText = [
      memory.business,
      memory.category,
      memory.title,
      memory.content,
      ...memory.tags,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      normalizedQuery
    );
  });
}
