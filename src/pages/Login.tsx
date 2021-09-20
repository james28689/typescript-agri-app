import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from "../contexts/AuthContext";

import LargeTextInput from '../components/authentication/LargeTextInput';
import LargeButton from '../components/authentication/LargeButton';
import BackgroundCard from '../components/authentication/BackgroundCard';

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setError("");
            setLoading(true);
            await login(emailRef.current!.value, passwordRef.current!.value);
            history.push("/");
        } catch (error) {
            console.log(error);
            setError("Failed to sign in");
        }

        setLoading(false);
    }

    return (
        <BackgroundCard title="Login">
            { error && <p className="text-md text-red-500 mb-4">{error}</p>}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <LargeTextInput labelText="Email Address" inputRef={emailRef} inputType="email"  />
                <LargeTextInput labelText="Password" inputRef={passwordRef} inputType="password" />
                <Link className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-800 cursor-pointer" to="/forgot-password">Forgot Password?</Link>
                <LargeButton loading={loading} text="Login" />
            </form>

            <div className="text-sm font-semibold text-gray-700 text-center mt-8">
                Don't have an account? <Link className="cursor-pointer text-primary-600 hover:text-primary-800" to="/signup">Sign Up</Link>
            </div>
        </BackgroundCard>
    )
}
