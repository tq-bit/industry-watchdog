export default function AppNavbar() {
  return (
    <div class="container mx-auto mb-4">

    <nav class="bg-gray-800 px-4 py-2 flex justify-between items-center rounded ">
      <a href="/" class="text-lg font-bold">
        Industry Watchdog
      </a>
      <ul class="flex space-x-4">
        <li>
          <a href="/" class="font-semibold hover:text-teal-200">
            Home
          </a>
        </li>
        <li>
          <a href="/sources" class="font-semibold hover:text-teal-200">
            Sources
          </a>
        </li>
        <li>
          <a href="/scores" class="font-semibold hover:text-teal-200">
            Scores
          </a>
        </li>
      </ul>
    </nav>
    </div>
  );
}
