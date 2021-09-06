import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useAuth } from "../contexts/AuthContext";

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
        <div>
            <h1>Login</h1>

            { error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input ref={emailRef} type="email" required />
                <br /><br />

                <label>Password</label>
                <input ref={passwordRef} type="password" required />
                <br /><br />

                <button type="submit" disabled={loading}>Login</button>
            </form>

            <Link to="/forgot-password">Forgot Password?</Link>
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}
