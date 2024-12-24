import { JSX } from "preact";
import { useSignal } from "@preact/signals";
import { AppButton } from "../components/client/AppButton.tsx";

interface AppPopverProps {
  formTitle: string;
  formSubtitle?: string;
  children: JSX.Element;
}

export default function AppPopver(
  { children, formTitle, formSubtitle }: AppPopverProps,
) {
  const visible = useSignal(false);
  return (
    <div>
      <AppButton
        onClick={() => (visible.value = !visible.value)}
      >
        Create
      </AppButton>
      <div
        style={{ display: visible.value ? "block" : "none" }}
        class="h-screen bg-opacity-40 bg-gray-900 w-full absolute top-0 left-0"
      >
        <div class="container mx-auto w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="border border-gray-800 p-4 rounded bg-gray-900">
            <h1 class="text-2xl font-semibold mb-4">{formTitle}</h1>
            {formSubtitle && <p class="text-gray-300 mb-4">{formSubtitle}</p>}
            <form method="post" encType="multipart/form-data">
              <input type="hidden" name="value" value="create" />
              {children}

              <div class="flex justify-between mt-4">
                <AppButton type="submit">
                  Submit
                </AppButton>

                <AppButton
                  type="button"
                  onClick={() => (visible.value = false)}
                >
                  Cancel
                </AppButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
