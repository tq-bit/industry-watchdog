import { PersistentObject } from "../../core/PersistentObject.ts";

export type TAiResponse = {
    index: string
    relevanceIndex: number;
    impactIndex: number;
    industryIndex: number;
    explanation: string;
    createdAt: Date;
}

const AiResponses = new PersistentObject<TAiResponse>("airesponses");

export default AiResponses;
