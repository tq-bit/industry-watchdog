import { FreshContext, Handlers } from "$fresh/server.ts";
import Articles from "../../components/server/db/Articles.db.ts";

export const handler: Handlers = {
  async GET(_req: Request, _ctx: FreshContext): Promise<Response> {
    await Articles.create({id: `${(Math.random() * 5000).toFixed(0)}`, title: 'Hello World', content: 'Hello World' });
    const res = Articles.read();
    await Articles.delete({id: "156"});
    await Articles.update({id: "3244"}, {id: "3244", title: 'Hello Other World', content: 'Hello Other World' });
    return new Response(JSON.stringify(res));
  }

}

