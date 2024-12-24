import { FreshContext, Handlers } from "$fresh/server.ts";

import AppInputGroup from "../components/client/AppInputGroup.tsx";
import { AppButton } from "../components/client/AppButton.tsx";
import AppPopverForm from "../islands/AppPopoverForm.tsx";
import SourcesDb from "../components/server/db/Sources.db.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    return await ctx.render({
      sources: SourcesDb.read(),
    });
  },

  async POST(req: Request, ctx: FreshContext): Promise<Response> {
    const form = await req.formData();
    const value = form.get("value") as "create" | "delete";

    if (value === "create") {
      const url = form.get("url") as string;
      const selector = form.get("selector") as string;
      const title = form.get("title") as string;
      const description = form.get("description") as string;

      await SourcesDb.create({
        id: crypto.randomUUID(),
        url,
        selector,
        title,
        description,
      });
    }

    if (value === "delete") {
      const id = form.get("id") as string;
      await SourcesDb.delete({ id });
    }

    return await ctx.render({
      sources: SourcesDb.read(),
    });
  },
};

export default function Sources(
  { data }: {
    data: {
      sources: {
        id: string;
        url: string;
        selector: string;
        maxCount: number;
        title?: string;
        description?: string;
      }[];
    };
  },
) {
  return (
      <div class="container mx-auto">
        {/* PopoverButton for new sources */}

        {/* Table for existing sources */}
        <div class="bg-gray-800 px-4 py-2 flex items-center justify-between rounded-t border-gray-800">
          <h1 class="text-2xl font-semibold">Sources</h1>
          <AppPopverForm formTitle="Add a news source" formSubtitle="Sources are websites that include relevant information for the observation case">
            <>
              <AppInputGroup
                label="Title"
                attrs={{ name: "title", type: "text", required: true }}
              />
              <AppInputGroup
                label="Description"
                attrs={{ name: "description", type: "text", required: true }}
              />
              <AppInputGroup
                label="URL"
                attrs={{ name: "url", type: "url", required: true }}
              />
              <AppInputGroup
                label="HTML Selector"
                attrs={{ name: "selector", type: "text", required: true }}
              />
            </>
          </AppPopverForm>
        </div>
        <table class="w-full">
          <thead class="bg-gray-800 border border-gray-800">
            <tr class="font-semibold text-left">
              <th class="px-4 py-2">Title</th>
              <th class="px-4 py-2">Description</th>
              <th class="px-4 py-2">URL</th>
              <th class="px-4 py-2">HTML Selector</th>
              <th class="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.sources.length === 0
              ? (
                <tr>
                  <td class="border border-gray-800 px-4 py-2" colspan={6}>
                    <div class="text-center">No sources added yet.</div>
                  </td>
                </tr>
              )
              : (
                data.sources.map((source) => (
                  <tr>
                    <td class="border border-gray-800 px-4 py-2">{source.title}</td>
                    <td class="border border-gray-800 px-4 py-2">{source.description}</td>
                    <td class="border border-gray-800 px-4 py-2">
                      <a href={source.url} target="_blank" class="bg-teal-700 rounded-full px-2 py-1">Open</a>
                    </td>
                    <td class="border border-gray-800 px-4 py-2">{source.selector}</td>
                    <td class="border border-gray-800 px-4 py-2">
                      <form method="post" encType="multipart/form-data">
                        <input type="hidden" name="value" value="delete" />
                        <input type="hidden" name="id" value={source.id} />
                        <AppButton disabled={false} type="submit">
                          Delete
                        </AppButton>
                      </form>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
  );
}
