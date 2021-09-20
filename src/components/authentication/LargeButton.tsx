type LargeButtonProps = {
    loading: boolean;
    text: string;
}

export default function LargeButton(props: LargeButtonProps) {
    return (
        <button className="bg-primary-500 text-white px-4 py-2 w-full rounded-lg font-semibold shadow-md hover:bg-primary-600 transition duration-100" type="submit" disabled={props.loading}>{props.text}</button>
    )
}
