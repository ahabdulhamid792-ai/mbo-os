import { MemoryItem } from "./types";

const database: MemoryItem[] = [];

export function saveMemory(memory: MemoryItem) {
  database.push(memory);
}

export function getAllMemories() {
  return database;
}