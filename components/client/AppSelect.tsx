import { JSX } from "preact";

type SelectProps = {
  options: { value: string; label: string }[];
  attrs: JSX.HTMLAttributes<HTMLSelectElement>;
};

export default function AppSelect({ options, attrs }: SelectProps) {
  return (
    <select class="px-2 py-1 border border-gray-900 bg-gray-800 outline-none active:outline-teal-900 focus:outline-teal-900 rounded" {...attrs}>
      {options.map((o) => <option value={o.value}>{o.label}</option>)}
    </select>
  );
}
