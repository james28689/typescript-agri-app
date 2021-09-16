import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { collection, query, where } from "firebase/firestore";
import { database, realtimeDB } from "../firebase"
import { collectionData } from "rxfire/firestore";
import { object } from "rxfire/database"

import { useAuth } from "../contexts/AuthContext";
import { ref } from "@firebase/database";

interface IField {
    id: string;
    name: string;
    rpa_field_id: string;
    userID: string;
}

export default function Home() {
    const [error, setError] = useState("");
    const { logout, currentUser } = useAuth();
    const history = useHistory();

    const [fields, setFields] = useState<IField[]>();
    const [fieldGeometries, setFieldGeometries] = useState<any>([]);

    useEffect(() => {
        const fieldsRef = query(collection(database, "fields"), where("userID", "==", currentUser!.uid));

        const fieldGeoObserver = object(ref(realtimeDB, "fields/" + currentUser!.uid + "/"));
        const fieldInfoObserver = collectionData(fieldsRef, { idField: "id" });

        fieldGeoObserver.subscribe(receivedGeometries => {
            setFieldGeometries(receivedGeometries.snapshot.val());
        });

        fieldInfoObserver.subscribe(receivedFields => {
            setFields(receivedFields as IField[]);
        });

        // const fieldsSubscription = fieldInfoObserver.pipe(
        //     withLatestFrom(fieldGeoObserver),
        //     map(([fieldInfo, fieldGeo]) => {
        //         return fieldInfo.map(receivedField => {
        //             return({
        //                 ... receivedField,
        //                 geometry: fieldGeo.snapshot.val()[receivedField.id]
        //             } as IField);
        //         });
        //     })
        // ).subscribe(received => {
        //     console.log(received);
        //     setFields(received);
        // });

        // return function cleanup() {
        //     fieldsSubscription.unsubscribe();
        // }

        // collectionData(fieldsRef, { idField: "id"})
        // .subscribe(receivedFields => {
        //     let formattedFields = receivedFields as IField[];
        //     console.log(formattedFields);
        //     setFields(formattedFields);
        // })
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
            <h1>Dashboard</h1>
            <Link to="/about">About</Link>

            { fields && fields.map(field => {
                return(
                    <div key={field.rpa_field_id}>
                        <p><strong>{field.name}</strong></p>
                        <p>{fieldGeometries && Math.round(((fieldGeometries[field.id]?.properties.area_ha * 2.47105) + Number.EPSILON) * 100) / 100}</p>
                    </div>
                )
            })}

            { error && <p>{error}</p> }
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}
