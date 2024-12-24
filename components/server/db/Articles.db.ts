import { PersistentObject } from "../../core/PersistentObject.ts";

const Articles = new PersistentObject<{
    id: string;
    title: string,
    content: string
}>("articles");

export default Articles;