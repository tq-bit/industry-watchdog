import { type PageProps } from "$fresh/server.ts";
import AppNavbar from "../components/client/AppNavbar.tsx";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32"/>
        <title>Industry Watchdog</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-gray-950 text-white min-h-screen p-6">
        <AppNavbar></AppNavbar>
        <Component />
      </body>
    </html>
  );
}
