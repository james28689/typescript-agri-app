import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

// import { useAuth } from "../contexts/AuthContext";

import LargeTextInput from '../components/authentication/LargeTextInput';
import LargeButton from '../components/authentication/LargeButton';
import BackgroundCard from '../components/authentication/BackgroundCard';

export default function ForgotPassword() {
    const emailRef = useRef<HTMLInputElement>(null);
    // const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        try {
            setMessage("");
            setError("");
            setLoading(true);
            // await resetPassword(emailRef.current!.value);
            console.log("Placeholder for reset password email")
            setMessage("Password reset email sent");
        } catch (error: any) {
            console.log(error.message);
            setError("Failed to sign in");
        }

        setLoading(false);
    }

    return (
        <BackgroundCard title="Forgot Password">
            { error && <p>{error}</p> }

            <form className="space-y-6" onSubmit={handleSubmit}>
                <LargeTextInput labelText="Email Address" inputType="email" inputRef={emailRef} />

                <LargeButton text="Reset Password" loading={loading} />
            </form>

            { message && <p>{message}</p> }

            <div className="text-sm font-semibold text-gray-700 text-center mt-8">
                Don't have an account? <Link className="cursor-pointer text-primary-600 hover:text-primary-800" to="/signup">Sign Up</Link>
            </div>
        </BackgroundCard>
    )
}
