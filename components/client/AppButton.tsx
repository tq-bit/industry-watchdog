import { JSX } from "preact";

export function AppButton(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      class="bg-teal-800 hover:bg-teal-900 text-white font-bold py-1 px-2 rounded"
    />
  );
}
