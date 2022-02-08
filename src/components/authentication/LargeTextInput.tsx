import React from "react";

type LargeTextInputProps = {
    labelText: string;
    inputRef: React.RefObject<HTMLInputElement>;
    inputType: "email" | "password" | "text";
}

export default function LargeTextInput(props: LargeTextInputProps) {
    return (
        <div>
            <div className="text-sm font-bold text-gray-700 tracking-wide mb-2">{props.labelText}</div>
            <input className="w-full text-lg border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-primary-500" ref={props.inputRef} type={props.inputType} required />
        </div>
    )
}
