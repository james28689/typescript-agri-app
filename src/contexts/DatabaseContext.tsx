import React, { useState, useEffect } from "react";
import { Feature } from "geojson"
import { useAuth } from "./AuthContext"
import { database, realtimeDB } from "../firebase"
import { query, collection, where, doc, getDocs, deleteDoc } from "firebase/firestore"
import { collectionData } from "rxfire/firestore"
import { ref, remove } from "firebase/database"
import { object } from "rxfire/database"

interface IFieldInfo {
    id: string;
    name: string;
    rpa_field_id: string;
    userID: string;
}

interface IFieldGeometries {
    [name: string]: Feature;
}

interface IDatabaseContext {
    fieldInfos: IFieldInfo[] | null;
    fieldGeometries: IFieldGeometries | null;
    deleteUserFields: () => void;
}

const DatabaseContext = React.createContext({} as IDatabaseContext)

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [fieldInfos, setFieldInfos] = useState<IFieldInfo[] | null>(null);
    const [fieldGeometries, setFieldGeometries] = useState<IFieldGeometries | null>(null);
    const { currentUser } = useAuth();

    useEffect(() => {
        if (currentUser) {
            const fieldsRef = query(collection(database, "fields"), where("userID", "==", currentUser!.uid));

            const fieldGeoObserver = object(ref(realtimeDB, "fields/" + currentUser!.uid + "/")).subscribe(receivedGeometries => {
                setFieldGeometries(receivedGeometries.snapshot.val());
            });
            const fieldInfoObserver = collectionData(fieldsRef, { idField: "id" }).subscribe(receivedFields => {
                setFieldInfos(receivedFields as IFieldInfo[]);
            });

            return function cleanup() {
                fieldGeoObserver.unsubscribe();
                fieldInfoObserver.unsubscribe();
            }
        }
    }, [currentUser]);

    function deleteUserFields() {
        const fieldsToDeleteRef = query(collection(database, "fields"), where("userID", "==", currentUser!.uid));

        getDocs(fieldsToDeleteRef)
        .then((querySnapshot) => {
            querySnapshot.forEach(doc => {
                deleteDoc(doc.ref);
            });
        })

        deleteDoc(doc(database, "users", currentUser!.uid));

        remove(ref(realtimeDB, "fields/" + currentUser!.uid));
    }

    const value: IDatabaseContext = {
        fieldInfos,
        fieldGeometries,
        deleteUserFields
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )

}