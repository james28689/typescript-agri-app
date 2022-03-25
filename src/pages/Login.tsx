import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from "../contexts/AuthContext";

import LargeTextInput from '../components/authentication/LargeTextInput';
import LargeButton from '../components/authentication/LargeButton';
import BackgroundCard from '../components/authentication/BackgroundCard';

export default function Login() {
    const formRef = useRef<HTMLFormElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setLoading(true);

        await login(emailRef.current!.value, passwordRef.current!.value).catch(e => {
            console.log(e)
            setError("User not found.");
            formRef.current!.reset();
        });

        setLoading(false);
    }

    return (
        <BackgroundCard title="Login">
            { error && <p className="text-md text-red-500 mb-4">{error}</p>}

            <form className="space-y-6" ref={formRef} onSubmit={handleSubmit}>
                <LargeTextInput labelText="Email Address" inputRef={emailRef} inputType="email"  />
                <LargeTextInput labelText="Password" inputRef={passwordRef} inputType="password" />
                <LargeButton loading={loading} text="Login" />
            </form>

            <div className="text-sm font-semibold text-gray-700 text-center mt-8">
                Don't have an account? <Link className="cursor-pointer text-primary-600 hover:text-primary-800" to="/signup">Sign Up</Link>
            </div>
        </BackgroundCard>
    )
}