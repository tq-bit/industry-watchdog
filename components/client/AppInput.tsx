import { JSX } from "preact";

export default function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
    return <input class="px-2 py-1 border border-gray-900 bg-gray-800 rounded outline-none active:outline-teal-900 focus:outline-teal-900" {...props} />;
}