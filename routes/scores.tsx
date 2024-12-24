import { FreshContext, Handlers } from "$fresh/server.ts";

import AppInputGroup from "../components/client/AppInputGroup.tsx";
import { AppButton } from "../components/client/AppButton.tsx";
import AppPopverForm from "../islands/AppPopoverForm.tsx";
import ScoresDb from "../components/server/db/Scores.db.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    return await ctx.render({
      scores: ScoresDb.read(),
    });
  },

  async POST(req: Request, ctx: FreshContext): Promise<Response> {
    const form = await req.formData();
    const value = form.get("value") as "create" | "delete";

    if (value === "create") {
      const keywords = form.get("keywords") as string;
      const weight = form.get("weight") as string;
      const type = form.get("type") as "relevance" | "impact";
      await ScoresDb.create({
        id: crypto.randomUUID(),
        keywords: keywords.split(", ").map((k) => k.trim()),
        weight: +weight,
        type: type,
      });
    }

    if (value === "delete") {
      const id = form.get("id") as string;
      await ScoresDb.delete({ id });
    }

    return await ctx.render({
      scores: ScoresDb.read(),
    });
  },
};

export default function Sources(
  { data }: {
    data: {
      scores: {
        id: string;
        keywords: string[];
        weight: number;
        type: "relevance" | "impact";
      }[];
    };
  },
) {
  return (
    <div class="container mx-auto">
      {/* PopoverButton for new sources */}

      {/* Table for existing scores */}
      <div class="bg-gray-800 px-4 py-2 flex items-center justify-between rounded-t border-gray-50">
        <h1 class="text-2xl font-semibold">Scores</h1>
        <AppPopverForm formTitle="Add a news scoring" formSubtitle="Scorings are used to measure the relevance and impact of scraped news">
          <>
            <AppInputGroup
              label="Keywords (Comma separated)"
              attrs={{ name: "keywords", type: "text", required: true }}
            />
            <AppInputGroup
              label="Weight"
              attrs={{ name: "weight", type: "number", required: true }}
            />

            <AppInputGroup
              label="Type"
              attrs={{ name: "type", type: "select", required: true }}
              options={[
                { value: "relevance", label: "Relevance" },
                { value: "impact", label: "Impact" },
              ]}
            />
          </>
        </AppPopverForm>
      </div>
      <table class="w-full">
        <thead class="bg-gray-800 border border-gray-800">
          <tr class="font-semibold text-left">
            <th class="px-4 py-2">Keywords</th>
            <th class="px-4 py-2">Weight</th>
            <th class="px-4 py-2">Type</th>
            <th class="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.scores.length === 0
            ? (
              <tr>
                <td class="border border-gray-800 px-4 py-2" colspan={6}>
                  <div class="text-center">No scores added yet.</div>
                </td>
              </tr>
            )
            : (
              data.scores.map((score) => (
                <tr>
                  <td class="border border-gray-800 px-4 py-2">
                    {score.keywords.map((k) => k).join(", ")}
                  </td>
                  <td class="border border-gray-800 px-4 py-2">
                    {score.weight}
                  </td>
                  <td class="border border-gray-800 px-4 py-2">{score.type}</td>
                  <td class="border border-gray-800 px-4 py-2">
                    <form method="post" encType="multipart/form-data">
                      <input type="hidden" name="value" value="delete" />
                      <input type="hidden" name="id" value={score.id} />
                      <AppButton type="submit">
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
