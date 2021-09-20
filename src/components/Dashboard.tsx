import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext"

import BackgroundCard from "./authentication/BackgroundCard";

export default function Home() {
    const [error, setError] = useState("");
    const { logout } = useAuth();
    const { fieldInfos, fieldGeometries } = useDatabase();
    const history = useHistory();

    async function handleLogout() {
        setError("");
        try {
            await logout();
            history.push("/login");
        } catch (error) {
            console.log(error);
            setError("Error logging out");
        }
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="/about">About</Link>
            <br />
            <Link to="/settings">Settings</Link>

            { fieldInfos && fieldInfos.map(field => {
                return(
                    <div key={field.rpa_field_id}>
                        <p><strong>{field.name}</strong></p>
                        <p>{fieldGeometries && Math.round(((fieldGeometries[field.id]?.properties!.area_ha * 2.47105) + Number.EPSILON) * 100) / 100}</p>
                    </div>
                )
            })}

            { error && <p>{error}</p> }
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
