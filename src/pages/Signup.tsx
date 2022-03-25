import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

import LargeTextInput from '../components/authentication/LargeTextInput';
import LargeButton from '../components/authentication/LargeButton';
import BackgroundCard from '../components/authentication/BackgroundCard';

export default function Signup() {
    const emailRef = useRef<HTMLInputElement>(null);
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const passwordConfirmRef = useRef<HTMLInputElement>(null);

    const { signup } = useAuth();
    const [error, setError] = useState("");
    const history = useHistory();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (passwordRef.current?.value !== passwordConfirmRef.current?.value) {
            setError("Passwords don't match");
            return;
        }

        try {
            setError("");
            await signup(emailRef.current!.value, passwordRef.current!.value, firstNameRef.current!.value, lastNameRef.current!.value);
            history.push("/login");
        } catch (error) {
            console.log(error);
            setError("Failed to create an account");
        }
    }

    return (
        <BackgroundCard title="Sign Up">

            { error && <p className="text-red-600">{error}</p> }

            <form className="space-y-6" onSubmit={handleSubmit}>
                <LargeTextInput labelText="Email Address" inputType="email" inputRef={emailRef} />
                <LargeTextInput labelText="First Name" inputType="text" inputRef={firstNameRef} />
                <LargeTextInput labelText="Last Name" inputType="text" inputRef={lastNameRef} />
                <LargeTextInput labelText="Password" inputType="password" inputRef={passwordRef} />
                <LargeTextInput labelText="Confirm Password" inputType="password" inputRef={passwordConfirmRef} />
                <LargeButton text="Sign Up" loading={false} />
            </form>

            <div className="text-sm font-semibold text-gray-700 text-center mt-8">
                Already have an account? <Link className="cursor-pointer text-primary-600 hover:text-primary-800" to="/login">Login</Link>
            </div>
        </BackgroundCard>
    )
}
