import React, { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import geojson from "geojson";
import RPAMapComponent from "./maps/RPAMap";
import NamingMapComponent, { FieldNamePair } from "./maps/NamingMap";

enum OnboardingStep {
    SBI,
    Map,
    Name
}

export default function Home() {
    const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(OnboardingStep.SBI);

    const sbiRef = useRef<HTMLInputElement>(null);
    const [SBI, setSBI] = useState("");
    const [mapSelectedFields, setMapSelectedFields] = useState<geojson.FeatureCollection>();

    const { changeMustOnboard } = useAuth();
    const { createField } = useDatabase();

    function receiveMapFields(fields: geojson.FeatureCollection) {
        console.log(fields);
        setMapSelectedFields(fields);
        setOnboardingStep(OnboardingStep.Name);
    }

    function sendFieldsToDatabase(givenNames: FieldNamePair[]) {
        console.log(givenNames);

        for (let i = 0; i < mapSelectedFields!.features.length; i++) {
            createField(givenNames.filter(pair => pair.field_id === mapSelectedFields!.features[i].properties!.field_id)[0].name, mapSelectedFields!.features[i].properties!.field_id, "None", mapSelectedFields!.features[i]);
        }

        changeMustOnboard(false);
    }

    // function sendFieldsToDatabase(givenNames: FieldNamePair[]) {
    //     console.log(givenNames);
    //     for (let i = 0; i < mapSelectedFields!.features.length; i++) {
    //         addDoc(collection(database, "fields"), {
    //             name: givenNames.filter(pair => pair.field_id === mapSelectedFields!.features[i].properties!.field_id)[0].name,
    //             userID: currentUser!.uid,
    //             rpa_field_id: mapSelectedFields!.features[i].properties!.field_id,
    //         })
    //         .then((fieldRef) => {
    //             set(ref(realtimeDB, "fields/" + currentUser!.uid + "/" + fieldRef.id), mapSelectedFields!.features[i]);
    //         })
    //         .then(() => {
    //             updateDoc(doc(database, "users", currentUser!.uid), {
    //                 mustOnboard: false
    //             });
    //         })
    //     }
    // }

    if (onboardingStep === OnboardingStep.SBI) {
        return (
            <div>
                <h1>Welcome to Agri App</h1>

                <form onSubmit={() => { setSBI(sbiRef.current!.value); setOnboardingStep(OnboardingStep.Map) }} >
                    <label>SBI:</label>       
                    <input type="text" ref={sbiRef} />
                    <br /><br />

                    <button type="submit">Continue</button>
                </form>

            </div>
        )
    } else if (onboardingStep === OnboardingStep.Map) {
        return (
            <div>
                <h1>Welcome to Agri App</h1>
                <RPAMapComponent SBI={SBI} exportFields={receiveMapFields} />
            </div>
        )
    } else if (onboardingStep === OnboardingStep.Name) {
        return (
            <div>
                <h1>Welcome to Agri App</h1>

                <NamingMapComponent fields={mapSelectedFields!} exportNames={sendFieldsToDatabase}/>
            </div>
        )
    } else {
        return (
            <div>
                ERROR: Unknown Current State
            </div>
        )
    }
}
