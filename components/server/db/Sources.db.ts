import { PersistentObject } from "../../core/PersistentObject.ts";

export type TSource = {
  id: string;
  url: string;
  selector: string;
  title?: string;
  description?: string;
};

const Sources = new PersistentObject<TSource>("sources");

export default Sources;
