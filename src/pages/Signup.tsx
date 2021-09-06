import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

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
        <div>
            <h1>Signup</h1>

            { error && <p>{error}</p> }

            <form onSubmit={handleSubmit}>
                <label>Email</label>       
                <input type="email" ref={emailRef} />
                <br /><br />

                <label>Password</label>
                <input type="password" ref={passwordRef} />
                <br /><br />

                <label>Confirm Password</label>
                <input type="password" ref={passwordConfirmRef} />
                <br /><br />

                <button type="submit" disabled={loading}>Sign Up</button>
            </form>

            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}
