import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

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
    changeMustOnboard(mustOnboard: boolean): Promise<void>;
}

const AuthContext = React.createContext({} as IAuthContext);

export function useAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }: { children: any }) {
    const [currentUser, setCurrentUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    // const [refreshToken, setRefreshToken] = useState("");

    const history = useHistory();

    async function signup(email: string, password: string, firstName: string, lastName: string) {
        try{
            setLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`, {
                firstName,
                lastName,
                email,
                password
            })

            console.log(res);
            
        } catch (err) {
            throw err;
        }
    }

    async function login(email: string, password: string) {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/signin`, {
                email,
                password
            })

            console.log(res)

            if (res.data.message) {
                throw new Error("User not found");
            } else {
                const newUserInfo: IUser = {
                    email: res.data.email,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    mustOnboard: res.data.mustOnboard
                }
                
                console.log(res.data.refreshToken);

                setAccessToken(res.data.accessToken);
                // setRefreshToken(res.data.refreshToken);
                setCurrentUser(newUserInfo);
                
                history.push("/");
                
                setTimeout(refreshAccessTokens, ((res.data.tokenExpiry * 1000) - 30_000), res.data.refreshToken);
            }
        } catch(err) {
            throw err;
        }
    }

    async function refreshAccessTokens(receivedRefreshToken: string) {
        if (receivedRefreshToken === "") {
            console.log("Refresh token empty");
            logout();
            return;
        }
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/refresh-token`, {
            refreshToken: receivedRefreshToken
        }).catch((err: any) => {
            console.log(err);
        }).then((res: any) => {
            setAccessToken(res.data.accessToken);
            // setRefreshToken(res.data.refreshToken);

            setTimeout(refreshAccessTokens, ((res.data.tokenExpiry * 1000) - 30_000), res.data.refreshToken);
        })
    }

    function logout() {
        setCurrentUser(null);
        setAccessToken("");
        // setRefreshToken("");
    }

    async function changeEmail(email: string) {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-email`, {
                email
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            });

            console.log(res);
        }
        catch (err) {
            console.log(err);
        }
    }

    async function changePassword(password: string) {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-password`, {
                password
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            });

            console.log(res);
        } catch (err) {
            console.log(err);
        }
    }

    async function changeMustOnboard(mustOnboard: boolean) {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/change-onboard`, {
                mustOnboard
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            });

            console.log(res);
            await getNewUserData();
        } catch (err) {
            console.log(err);
        }
    }

    async function getNewUserData() {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user-data`, {
                headers: {
                    "x-access-token": accessToken
                }
            });

            setCurrentUser(res.data);
        } catch (err) {
            console.log(err);
        }
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