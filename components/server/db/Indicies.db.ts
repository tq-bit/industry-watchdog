import { PersistentObject } from "../../core/PersistentObject.ts";

export type TIndex = {
    id: string;
    relevanceIndex: number;
    impactIndex: number;
    industryIndex: number;
    createdAt: Date;
}

const Indicies = new PersistentObject<TIndex>("indicies");

export default Indicies;