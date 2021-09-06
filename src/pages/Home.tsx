import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { database } from "../firebase"
import { collectionData } from "rxfire/firestore";

import { useAuth } from "../contexts/AuthContext";

import mapboxgl from "mapbox-gl";

const turf = require("@turf/turf");

interface IField {
    id: string;
    name: string;
    userID: string;
}

export default function Home() {
    const [error, setError] = useState("");
    const { logout, currentUser } = useAuth();
    const history = useHistory();

    mapboxgl.accessToken = "pk.eyJ1IjoiamFtZXMyODY4OSIsImEiOiJja3F4eWNqc24xMnd0MzFxcDB2azVzbDZuIn0._BCf462zUp_7C1cjeAGueg";

    const [fields, setFields] = useState<IField[]>();
    const [receivedData, setReceivedData] = useState<any>();

    useEffect(() => {
        var map = new mapboxgl.Map({
            container: "my-map",
            style: "mapbox://styles/mapbox/satellite-streets-v9"
        });

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );

        map.addControl(new mapboxgl.NavigationControl());

        fetch("https://environment.data.gov.uk/arcgis/rest/services/RPA/LandParcels/MapServer/0/query?where=SBI=106791068&f=geojson")
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setReceivedData(data);      

                map.addSource("parcels", {
                    type: "geojson",
                    data: data
                });
        
                map.addLayer({
                    id: "parcel-boundaries",
                    type: "fill",
                    source: "parcels",
                    paint: {
                        "fill-color": "#ff0000",
                        "fill-opacity": 0.5
                    }
                });

                var centerPoint = turf.centerOfMass(data);
                console.log(centerPoint);

                map.flyTo({center: centerPoint.geometry.coordinates, zoom: 10});

                map.on("click", "parcel-boundaries", (e) => {
                    let fieldCoords = data.features.map((feature:any) => feature.geometry.coordinates);
                    // console.log(fieldCoords);

                    const selectedFeature = map.queryRenderedFeatures(e.point, {
                        layers: ["parcel-boundaries"]
                    })

                    console.log(selectedFeature);
                    // let clickedField = fieldCoords.filter(field => {
                    //     return e.features![0].geometry === 
                    // })
                })
            })
    }, []);

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

    return (
        <div>
            <h1>Home</h1>
            <Link to="/about">About</Link>

            { fields && fields.map(field => {
                return <p>{field.name}</p>
            })}

            <div id="my-map" style={{ width: "100%", height: 800 }}></div>
            { error && <p>{error}</p> }
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
