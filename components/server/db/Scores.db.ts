import { PersistentObject } from "../../core/PersistentObject.ts";

export type TScore = {
  id: string;
  keywords: string[];
  weight: number;
  type: "relevance" | "impact";
};
const Scores = new PersistentObject<TScore>("scores");

export default Scores;
