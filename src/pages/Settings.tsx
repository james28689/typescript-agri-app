import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext"

export default function Settings() {
    // const { removeUser } = useAuth();
    // const { deleteUserFields } = useDatabase();

    async function handleDeleteAccount() {
        // await deleteUserFields();
        // await removeUser();
        
    }

    return(
        <div>
            <button onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    )
}