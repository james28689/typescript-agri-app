import React, { useState, useEffect } from "react";
import { Feature } from "geojson";
import { useAuth } from "./AuthContext";
import axios from "axios";

interface IField {
    name: string;
    rpa_field_id: string;
    user: string;
    geometry: Feature;
}

interface IDatabaseContext {
    fields: IField[] | null;
    updateFields(): void;
    createField(name: string, rpa_field_id: string, geometry: Feature): void;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [fields, setFields] = useState<IField[] | null>(null);
    const { currentUser, accessToken } = useAuth();

    useEffect(() => {
        updateFields();
    }, [currentUser])

    function updateFields() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/field/getFieldByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch((err) => {
                console.log(err);
            }).then((res: any) => {
                setFields(res.data as IField[])
            })
        }
    }

    function createField(name: string, rpa_field_id: string, geometry: Feature) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/field/create`, {
                name,
                rpa_field_id,
                geometry
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch((err) => {
                console.log(err)
            }).then((res:any) => {
                console.log(res);
                updateFields();
            })
        }
    }

    const value: IDatabaseContext = {
        fields,
        updateFields,
        createField
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}