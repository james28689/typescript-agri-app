import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { database } from "../firebase"
import { collectionData } from "rxfire/firestore";

import { useAuth } from "../contexts/AuthContext";

import mapboxgl from "mapbox-gl";
import Map, { MapFunction } from "./Map"
import geojson from "geojson";

const turf = require("@turf/turf");

interface IField {
    id: string;
    name: string;
    userID: string;
}

export default function Home() {
    const [error, setError] = useState("");
    const [mapSelectedFields, setMapSelectedFields] = useState<geojson.FeatureCollection>();
    const { logout, currentUser } = useAuth();
    const history = useHistory();

    mapboxgl.accessToken = "pk.eyJ1IjoiamFtZXMyODY4OSIsImEiOiJja3F4eWNqc24xMnd0MzFxcDB2azVzbDZuIn0._BCf462zUp_7C1cjeAGueg";

    const [fields, setFields] = useState<IField[]>();

    useEffect(() => {
        const fieldsRef = query(collection(database, "fields"), where("userID", "==", currentUser!.uid));

        collectionData(fieldsRef, { idField: "id"})
        .subscribe(receivedFields => {
            let formattedFields = receivedFields as IField[];
            setFields(formattedFields);
        });
    }, [currentUser]);

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

    function receiveMapFields(fields: geojson.FeatureCollection) {
        console.log(fields);
        setMapSelectedFields(fields);
    }

    return (
        <div>
            <h1>Home</h1>
            <Link to="/about">About</Link>

            { fields && fields.map(field => {
                return <p>{field.name}</p>
            })}

            <Map onMount={MapFunction.fetchGovDataAndDisplay} exportFields={receiveMapFields} />

            { error && <p>{error}</p> }
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
