// import React, { useState, useEffect } from "react";
// import { auth, database } from "../firebase";
// import { createUserWithEmailAndPassword, updateEmail, updatePassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, deleteUser, User, UserCredential } from "firebase/auth"
// import { doc, setDoc } from "firebase/firestore";

// interface IAuthContext {
//     currentUser: User | null;
//     signup(email: string, password: string): Promise<void>;
//     login(email: string, password: string): Promise<UserCredential>;
//     logout(): Promise<void>;
//     resetPassword(email: string): Promise<void>;
//     changeEmail(email: string): Promise<void> | undefined;
//     changePassword(password: string): Promise<void> | undefined;
//     removeUser: () => void;
// }

// const AuthContext = React.createContext({} as IAuthContext);

// export function useAuth() {
//     return React.useContext(AuthContext);
// }

// export function AuthProvider({ children }: { children: any }) {
//     const [currentUser, setCurrentUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);

//     async function signup(email: string, password: string) {
//         createUserWithEmailAndPassword(auth, email, password)
//         .then(async (userCredential:UserCredential) => {
//             await setDoc(doc(database, "users", userCredential.user.uid), {
//                 mustOnboard: true
//             });
//         }
//         )
//     }

//     function login(email: string, password: string) {
//         return signInWithEmailAndPassword(auth, email, password);
//     }

//     function logout() {
//         return signOut(auth);
//     }

//     function resetPassword(email: string) {
//         return sendPasswordResetEmail(auth, email);
//     }

//     function changeEmail(email: string) {
//         if (currentUser !== null) {
//             return updateEmail(currentUser, email);
//         }
//     }

//     function changePassword(password: string) {
//         if (currentUser !== null) {
//             return updatePassword(currentUser, password);
//         }
//     }

//     function removeUser() {
//         deleteUser(currentUser!);
//     }

//     useEffect(() => {
//         onAuthStateChanged(auth, (user) => {
//             setCurrentUser(user);
//             setLoading(false);
//         });
//     }, []);

//     const value: IAuthContext = {
//         currentUser,
//         signup,
//         login,
//         logout,
//         resetPassword,
//         changeEmail,
//         changePassword,
//         removeUser
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     )
// }

export {}