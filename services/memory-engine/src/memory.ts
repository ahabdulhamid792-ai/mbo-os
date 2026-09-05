import { saveMemory } from "./storage";

import { searchMemory } from "./retrieval";

import { MemoryItem } from "./types";

export class MemoryEngine {

    remember(memory: MemoryItem){

        saveMemory(memory);

    }

    recall(query:string){

        return searchMemory(query);

    }

}