import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import LargeTextInput from '../components/authentication/LargeTextInput';
import LargeButton from '../components/authentication/LargeButton';
import BackgroundCard from '../components/authentication/BackgroundCard';

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            setError("Passwords don't match");
            return;
        }

        try {
            setError("");
            setLoading(true);
            await signup(emailRef.current!.value, passwordRef.current!.value);
            history.push("/");
        } catch (error) {
            console.log(error);
            setError("Failed to create an account");
        }

        setLoading(false);
    }

    return (
        <BackgroundCard title="Sign Up">

            { error && <p>{error}</p> }

            <form className="space-y-6" onSubmit={handleSubmit}>
                <LargeTextInput labelText="Email Address" inputType="email" inputRef={emailRef} />
                <LargeTextInput labelText="Password" inputType="password" inputRef={passwordRef} />
                <LargeTextInput labelText="Confirm Password" inputType="password" inputRef={passwordConfirmRef} />
                <LargeButton text="Sign Up" loading={loading} />
            </form>

            <div className="text-sm font-semibold text-gray-700 text-center mt-8">
                Already have an account? <Link className="cursor-pointer text-primary-600 hover:text-primary-800" to="/login">Login</Link>
            </div>
        </BackgroundCard>
    )
}
