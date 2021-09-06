import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

export default function ForgotPassword() {
    const emailRef = useRef<HTMLInputElement>(null);
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        try {
            setMessage("");
            setError("");
            setLoading(true);
            await resetPassword(emailRef.current!.value);
            setMessage("Password reset email sent");
        } catch (error) {
            console.log(error);
            setError("Failed to sign in");
        }

        setLoading(false);
    }

    return (
        <div>
            <h1>Forgot Password</h1>

            { message && <p>{message}</p> }

            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" ref={emailRef} />
                <br /><br />

                <button type="submit" disabled={loading}>Reset Password</button>

                { error && <p>{error}</p> }
            </form>

            <Link to="/login">Login</Link>

            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    )
}
