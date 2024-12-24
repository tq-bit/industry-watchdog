import { JSX } from "preact";
import AppInput from './AppInput.tsx'
import AppSelect from "./AppSelect.tsx";
import AppLabel from './AppLabel.tsx'

type InputGroupProps = {
    label: string
    attrs: JSX.HTMLAttributes<HTMLInputElement | HTMLSelectElement>
    options?: { value: string; label: string }[]
}

export default function InputGroup({label, attrs, options}: InputGroupProps) {
    return (
        <div class="flex flex-col my-2">
            <AppLabel  text={label}></AppLabel>
            {attrs.type === 'select' && options && <AppSelect options={options} attrs={attrs as JSX.HTMLAttributes<HTMLSelectElement>}></AppSelect>}
            {attrs.type !== 'select' && <AppInput {...attrs as JSX.HTMLAttributes<HTMLInputElement>}></AppInput>}
        </div>
    )
}