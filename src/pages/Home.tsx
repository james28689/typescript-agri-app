import React, { useState, useEffect } from "react";

import { doc } from "firebase/firestore";
import { database } from "../firebase"
import { docData } from "rxfire/firestore";
import { useAuth } from "../contexts/AuthContext";

import Onboarding from "../components/Onboarding";
import Dashboard from "../components/Dashboard";

export default function Home() {
    const [mustOnboard, setMustOnboard] = useState<Boolean | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        const userDocRef = doc(database, `users/${currentUser!.uid}`);

        docData(userDocRef, { idField: "id"})
        .subscribe(userData => {
            setMustOnboard(userData.mustOnboard);
        })
    }, [currentUser]);

    if (mustOnboard) {
        return <Onboarding />
    } else {
        return <Dashboard />
    }
}

// useEffect(() => {
//     const fieldsRef = query(collection(database, "fields"), where("userID", "==", currentUser!.uid));

//     collectionData(fieldsRef, { idField: "id"})
//     .subscribe(receivedFields => {
//         let formattedFields = receivedFields as IField[];
//         console.log(formattedFields);
//         setFields(formattedFields);
//     });
// }, [currentUser]);

// async function handleLogout() {
//     setError("");
//     try {
//         await logout();
//         history.push("/login");
//     } catch (error) {
//         console.log(error);
//         setError("Error logging out");
//     }
// }
