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

    if (onboardingStep === OnboardingStep.SBI) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-semibold">Welcome to Agri</h1>

                <form onSubmit={() => { setSBI(sbiRef.current!.value); setOnboardingStep(OnboardingStep.Map) }} className="max-w-sm" >
                    <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">SBI</label>
                    <input type="text" ref={sbiRef} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />

                    <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg font-semibold">Next</button>
                </form>

            </div>
        )
    } else if (onboardingStep === OnboardingStep.Map) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">Welcome to Agri App</h1>
                <RPAMapComponent SBI={SBI} exportFields={receiveMapFields} />
            </div>
        )
    } else if (onboardingStep === OnboardingStep.Name) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-semibold mb-4">Welcome to Agri App</h1>

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
