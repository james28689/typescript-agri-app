import React, { useState, useEffect } from "react";
import axios from "axios";

interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    mustOnboard: string;
}

interface IAuthContext {
    currentUser: IUser | null;
    accessToken: string;
    signup(email: string, password: string, firstName: string, lastName: string): Promise<void>;
    login(email: string, password: string): Promise<void>;
    logout(): void;
    changeEmail(email: string): Promise<void>;
    changePassword(password: string): Promise<void>;
    changeMustOnboard(onboard: boolean): Promise<void>;
}

const AuthContext = React.createContext({} as IAuthContext);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    async function signup(email: string, password: string, firstName: string, lastName: string) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
            firstName,
            lastName,
            email,
            password
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            console.log(res);
        })
    }

    async function login(email: string, password: string) {
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`, {
            email,
            password
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            console.log(res)

            const newUserInfo: IUser = {
                email: res.data.email,
                firstName: res.data.firstName,
                lastName: res.data.lastName,
                mustOnboard: res.data.mustOnboard
            }

            setCurrentUser(newUserInfo);
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);

            setTimeout(refreshAccessTokens, ((res.data.tokenExpiry * 1000) - 30_000));
        })
    }

    async function refreshAccessTokens() {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/refresh-token`, {
            refreshToken
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            setAccessToken(res.data.accessToken);
            setRefreshToken(res.data.refreshToken);

            setTimeout(refreshAccessTokens, ((res.data.tokenExpiry * 1000) - 30_000));
        })
    }

    function logout() {
        setCurrentUser(null);
        setAccessToken("");
        setRefreshToken("");
    }

    async function changeEmail(email: string) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-email`, {
            email
        }, {
            headers: {
                "x-access-token": accessToken
            }
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            console.log(res);
        })
    }

    async function changePassword(password: string) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-password`, {
            password
        }, {
            headers: {
                "x-access-token": accessToken
            }
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            console.log(res);
        })
    }

    async function changeMustOnboard(onboard: boolean) {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-onboard`, {
            onboard
        }, {
            headers: {
                "x-access-token": accessToken
            }
        }).catch((err) => {
            console.log(err)
        }).then((res: any) => {
            console.log(res);
        })
    }
    
    const value: IAuthContext = {
        currentUser,
        accessToken,
        signup,
        login,
        logout,
        changeEmail,
        changePassword,
        changeMustOnboard
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}