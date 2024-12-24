import { FreshContext, Handlers } from "$fresh/server.ts";

import SourcesDb, { TSource } from "../components/server/db/Sources.db.ts";
import ScoresDb, { TScore } from "../components/server/db/Scores.db.ts";
import IndiciesDb, { TIndex } from "../components/server/db/Indicies.db.ts";
import AiResponsesDb, {
  TAiResponse,
} from "../components/server/db/AiResponses.db.ts";

import AppRefreshIndex from "../islands/AppRefreshIndex.tsx";

export const handler: Handlers = {
  async GET(_req: Request, ctx: FreshContext): Promise<Response> {
    return await ctx.render({
      sources: SourcesDb.read(),
      scores: ScoresDb.read(),
      indicies: IndiciesDb.read(),
      airesponses: AiResponsesDb.read(),
    });
  },
};

function GetStarted(
  { data }: {
    data: {
      sources: TSource[];
      scores: TScore[];
      indicies: TIndex[];
      airesponses: TAiResponse[];
    };
  },
) {
  return (
    <div class="container mx-auto">
      <h1 class="text-2xl font-semibold">Getting started</h1>
      <p class="text-gray-300">
        It seems like this is your first visit to this app, so let's set you up.
      </p>
      <div class="bg-gray-800 p-4 rounded my-4">
        <h2 class="text-xl font-semibold">Disclaimer</h2>
        <p class="text-gray-300">
          This app was built for the{"  "}
          <a class="text-teal-200" href="https://brightdata.com/">Brightdata</a>
          {" "}
          hackathon on dev.to and is not meant to be used productively.
        </p>
      </div>
      <ol>
        {data.sources.length === 0 && (
          <li class="my-4">
            <h2 class="text-xl mb-2">
              <a href="/sources">1. Create your sources</a>
            </h2>
            <p class="text-gray-300 text-md mb-2">
              Sources are parts of a website that are likely to include relevant
              information for your observation case. You can create as many
              sources as you want. A source must have a URL and can have a CSS
              selector if you want to scrape only specific elements.
            </p>
            <a
              href="/sources"
              class="text-teal-200  font-semibold underline"
            >
              Create your sources
            </a>
          </li>
        )}

        {data.scores.length === 0 && (
          <li class="my-4">
            <h2 class="text-xl mb-2">
              <a href="/sources">2. Create your scores</a>
            </h2>
            <p class="text-gray-300 text-md mb-1">
              Scores are sets of keywords that are used to measure the relevance
              and impact of your sources. A score can be of type 'relevance' and
              type 'impact'.
            </p>
            <p class="text-gray-300 mb-1">
              ℹ️ 'Relevance' should include keywords that indicate your
              industry.
            </p>
            <p class="text-gray-300 mb-2">
              ℹ️ 'Impact' should include keywords that indicate risks or
              opportunities.
            </p>

            <a
              href="/scores"
              class="text-teal-200  font-semibold underline"
            >
              Create your scores
            </a>
          </li>
        )}
        {data.scores.length === 0 && data.sources.length === 0 && (
          <li>
            <h2 class="text-xl mb-2">3. Calculate your industry index</h2>
            <p class="text-gray-300 text-md mb-2">
              Once you have created your sources and scores, you can calculate
              your watch-index. Come back to this page and click on 'Start'
            </p>
          </li>
        )}
      </ol>
    </div>
  );
}

function IndiciesContent({ indicies }: { indicies: TIndex[] }) {
  return (
    <>
      <h2 class="text-xl font-semibold">Latest index (algorithm generated)</h2>
      <p class="text-gray-300  mb-4">
        {new Date(indicies[0]?.createdAt).toLocaleDateString("de-DE")} at{" "}
        {new Date(indicies[0]?.createdAt).toLocaleTimeString("de-DE")}
      </p>
      <div class="grid grid-cols-9 gap-4">
        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                indicies[0]?.impactIndex <= 10 ? "text-green-500" : ""
              } ${
                indicies[0]?.impactIndex > 10 &&
                  indicies[0]?.impactIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${indicies[0]?.impactIndex >= 80 ? "text-red-500" : ""}`}
            >
              {indicies[0]?.impactIndex}
            </h3>
            <p class="text-gray-300 ">Impact Index</p>
          </div>
        </div>

        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                indicies[0]?.relevanceIndex <= 50 ? "text-red-500" : ""
              } ${
                indicies[0]?.relevanceIndex > 50 &&
                  indicies[0]?.relevanceIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${indicies[0]?.relevanceIndex >= 80 ? "text-green-500" : ""}`}
            >
              {indicies[0]?.relevanceIndex}
            </h3>
            <p class="text-gray-300 ">Relevance Index</p>
          </div>
        </div>

        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                indicies[0]?.industryIndex <= 40 ? "text-green-500" : ""
              } ${
                indicies[0]?.industryIndex > 40 &&
                  indicies[0]?.industryIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${indicies[0]?.industryIndex >= 80 ? "text-red-500" : ""}`}
            >
              {indicies[0]?.industryIndex}
            </h3>
            <p class="text-gray-300 ">Industry Index</p>
          </div>
        </div>
      </div>
    </>
  );
}

function AiResponseContent({ airesponses }: { airesponses: TAiResponse[] }) {
  return (
    <>
      <h2 class="text-xl font-semibold ">Latest index (AI generated)</h2>
      <p class="text-gray-300  mb-4">
        {new Date(airesponses[0]?.createdAt).toLocaleDateString("de-DE")} at
        {" "}
        {new Date(airesponses[0]?.createdAt).toLocaleTimeString("de-DE")}
      </p>
      <div class="grid grid-cols-9 gap-4">
        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                airesponses[0]?.impactIndex <= 10 ? "text-green-500" : ""
              } ${
                airesponses[0]?.impactIndex > 10 &&
                  airesponses[0]?.impactIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${airesponses[0]?.impactIndex >= 80 ? "text-red-500" : ""}`}
            >
              {airesponses[0]?.impactIndex}
            </h3>
            <p class="text-gray-300 ">Impact Index</p>
          </div>
        </div>

        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                airesponses[0]?.relevanceIndex <= 50 ? "text-red-500" : ""
              } ${
                airesponses[0]?.relevanceIndex > 50 &&
                  airesponses[0]?.relevanceIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${
                airesponses[0]?.relevanceIndex >= 80 ? "text-green-500" : ""
              }`}
            >
              {airesponses[0]?.relevanceIndex}
            </h3>
            <p class="text-gray-300">Relevance Index</p>
          </div>
        </div>

        <div class="col-span-3">
          <div class="bg-gray-800 p-4 rounded text-center">
            <h3
              class={`text-4xl font-semibold ${
                airesponses[0]?.industryIndex <= 40 ? "text-green-500" : ""
              } ${
                airesponses[0]?.industryIndex > 40 &&
                  airesponses[0]?.industryIndex < 80
                  ? "text-orange-500"
                  : ""
              } ${airesponses[0]?.industryIndex >= 80 ? "text-red-500" : ""}`}
            >
              {airesponses[0]?.industryIndex}
            </h3>
            <p class="text-gray-300 ">Industry Index</p>
          </div>
        </div>
      </div>
    </>
  );
}

function AiResponseText({ airesponses }: { airesponses: TAiResponse[] }) {
  return (
    <>
      <h2 class="text-xl font-semibold mb-2">AI generated text</h2>
      <p class="text-gray-300 ">{airesponses[0]?.explanation}</p>
    </>
  );
}

function MainContent(
  { data }: {
    data: {
      sources: TSource[];
      scores: TScore[];
      indicies: TIndex[];
      airesponses: TAiResponse[];
    };
  },
) {
  return (
    <>
      <div class="flex">
        <div class="bg-gray-800 p-4 rounded my-4 max-w-48 mr-2">
          <h3 class="text-xl font-semibold">{data.sources.length}</h3>
          <p class="text-gray-300">Sources watched</p>
        </div>
        <div class="bg-gray-800 p-4 rounded my-4 max-w-48 mr-2">
          <h3 class="text-xl font-semibold">{data.scores.length}</h3>
          <p class="text-gray-300">Scores maintained</p>
        </div>

        <div class="bg-gray-800 p-4 rounded my-4 max-w-48 mr-2">
          <h3 class="text-xl font-semibold">{data.indicies.length}</h3>
          <p class="text-gray-300">Indicies available</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-gray-800 p-4 rounded col-span-1">
          <IndiciesContent indicies={data.indicies}></IndiciesContent>
        </div>

        <div class="bg-gray-800 p-4 rounded col-span-1">
          <AiResponseContent airesponses={data.airesponses}></AiResponseContent>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-4">
        <div class="bg-gray-800 p-4 rounded col-span-1">
          <AiResponseText airesponses={data.airesponses}></AiResponseText>
        </div>

        <div class="bg-gray-800 p-4 rounded col-span-1">
          <AppRefreshIndex></AppRefreshIndex>
        </div>
      </div>
    </>
  );
}

export default function Home({
  data,
}: {
  data: {
    sources: TSource[];
    scores: TScore[];
    indicies: TIndex[];
    airesponses: TAiResponse[];
  };
}) {
  return (
    <div class="container mx-auto">
      {(data.scores.length === 0 || data.sources.length === 0) && (
        <GetStarted data={data}></GetStarted>
      )}
      {data.scores.length > 0 && data.sources.length > 0 && (
        <MainContent data={data}></MainContent>
      )}
    </div>
  );
}
