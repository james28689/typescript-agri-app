import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateEmail, updatePassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User, UserCredential } from "firebase/auth"

interface ContextType {
    currentUser: User | null;
    signup(email: string, password: string): Promise<UserCredential>;
    login(email: string, password: string): Promise<UserCredential>;
    logout(): Promise<void>;
    resetPassword(email: string): Promise<void>;
    changeEmail(email: string): Promise<void> | undefined;
    changePassword(password: string): Promise<void> | undefined;
}

const AuthContext = React.createContext({} as ContextType);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    function signup(email: string, password: string) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email: string, password: string) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    function resetPassword(email: string) {
        return sendPasswordResetEmail(auth, email);
    }

    function changeEmail(email: string) {
        if (currentUser !== null) {
            return updateEmail(currentUser, email);
        }
    }

    function changePassword(password: string) {
        if (currentUser !== null) {
            return updatePassword(currentUser, password);
        }
    }

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
    }, []);

    const value: ContextType = {
        currentUser,
        signup,
        login,
        logout,
        resetPassword,
        changeEmail,
        changePassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}