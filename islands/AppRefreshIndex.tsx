import { useSignal } from "@preact/signals";

export default function AppRefreshIndexButton() {
  const status = useSignal("");
  const text = useSignal("");
  const loading = useSignal(false);
  const loadingCompleted = useSignal(false);
  const buttonDisabled = useSignal(false);

  const refreshIndicies = async () => {
    try {
      loading.value = true;
      const res = await fetch("/api/index/refresh");
      const { message } = await res.json();
      text.value = message.text;
      status.value = message.status;
      loadingCompleted.value = true;
      setTimeout(() => globalThis.location.reload(), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      buttonDisabled.value = true;
      loading.value = false;
    }
  };
  return (
    <div class="w-96 mt-12 mx-auto">
      {text.value && (
        <div
          class={`p-4 rounded mb-2 ${
            status.value === "success" ? "bg-green-800" : "bg-red-800"
          }`}
        >
          <p class="font-semibold">{text.value}</p>
          <p>This page will refresh automatically in a moment</p>
        </div>
      )}
      <div class=" bg-gray-800 p-4 rounded">
        <h2 class="text-2xl font-semibold mb-2">Refresh indicies</h2>
        <p class="mb-2 text-gray-300">
          Clicking the below buttons performs a full refresh, including
          refreshing the source's content and recalculating index values
        </p>
        <button
          onClick={refreshIndicies}
          disabled={loading.value || buttonDisabled.value}
          class="bg-teal-800 hover:bg-teal-900 disabled:bg-teal-600 text-white font-bold py-1 px-2 rounded w-full text-xl flex items-center justify-center"
        >
          {loading.value &&
            (
              <>
                <svg
                  class="animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    stroke-width="4"
                  >
                  </circle>
                  <path
                    class="opacity-75"
                    fill="white"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  >
                  </path>
                </svg>
                Loading, please wait
              </>
            )}
          {!loading.value &&
            <span>Refresh Indicies</span>}
        </button>
        {loading.value && (
          <small class="text-gray-300 text-center mx-auto block mt-1">
            Refreshing the indicies may take a while
          </small>
        )}
      </div>
    </div>
  );
}
