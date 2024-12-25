# Industry Watchdog

This project is a prototype project for the [Bright Data challenge](https://dev.to/devteam/join-us-for-the-bright-data-web-scraping-challenge-3000-in-prizes-3mg2?bb=196805) on dev.to. IW lets users take a quick glance at a single KPI to see if something is going on in their industry.

## Getting Started

1. Clone the repo
2. Install [Deno](https://docs.deno.com/runtime/)
3. Rename `.env.example` to `.env`
4. set the `BROWSER_WS` and `OPENAI_API_KEY` variables
5. Run `deno task start`
6. Navigate to `http://localhost:8000`, add your sources and scores and run the indexing process

## How to use

1. Remove all sources and scores
2. Follow the steps on the `Home`-page
3. Run the indexing process