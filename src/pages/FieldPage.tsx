import React, { useState, useEffect, useRef } from "react";
import Nav from "../components/navbar/Nav";
import { IField, useDatabase } from "../contexts/DatabaseContext";
import { useHistory, useParams } from "react-router-dom";

type FieldPageParams = {
    id: string;
}

export default function FieldPage() {
    const { fields, updateField } = useDatabase();
    const { id } = useParams<FieldPageParams>();
    const [field, setField] = useState<IField>({} as IField);
    const [editMode, setEditMode] = useState(false);
    const cropSelectRef = useRef<HTMLSelectElement>(null);
    const history = useHistory();

    useEffect(() => {
        let newField = fields!.filter(field => {return field._id === id})[0];
        setField(newField);
        console.log(field);
    }, [fields])

    function update() {
        console.log(cropSelectRef.current!.value);
        
        const newField = {
            ...field,
            crop: cropSelectRef.current!.value
        }

        updateField(newField);
        setEditMode(false);
    }

    return(
        <div className="flex">
            <Nav active="" />

            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <div className="pb-4 flex flex-row">
                        <button onClick={history.goBack} className="text-primary-600 hover:text-primary-900">Back</button>
                        <div className="w-full"></div>
                        <button className="text-primary-600 hover:text-primary-900" onClick={() => { setEditMode(!editMode) }}>Edit</button>
                    </div>

                    <div className="flex flex-row align-bottom">
                        <h1 className="text-3xl font-semibold">{field.name}</h1>
                        {/* { field.geometry.properties && <h2 className="text-xl font-medium">{field.geometry.properties!.area_ha} ha</h2> } */}
                    </div>

                    { editMode ? 
                            <>
                            <label className="block mb-2 text-sm font-medium text-secondary-900">Select Crop</label>
                            <select ref={cropSelectRef} defaultValue={field.crop} id="crops" className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
                                <option>None</option>
                                <optgroup label="Cereals">
                                    <option>Wheat</option>
                                    <option>Barley</option>
                                    <option>Rye</option>
                                    <option>Oats</option>
                                    <option>Canary Grass</option>
                                </optgroup>
                                <optgroup label="Forage">
                                    <option>Maize</option>
                                    <option>Clovers</option>
                                    <option>Lucerne</option>
                                </optgroup>
                                <optgroup label="Industrial">
                                    <option>Flax</option>
                                    <option>Sugar Beet</option>
                                    <option>Oilseed Rape</option>
                                    <option>Soybean</option>
                                    <option>Potatoes</option>
                                </optgroup>
                            </select>
        
                            <button onClick={update}>Update</button>
                            </>
                        :
                        <>
                        <p>{field.crop}</p>
                        <p>{field.user}</p>
                        </>
                    }

                    
                </div>
            </div>
        </div>
    )
}

/* <select id="crops" className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5">
    <option>Adjuvants</option>
    <option>Fertiliser</option>
    <option>Fungicides</option>
    <option>Harvest</option>
    <option>Herbicides</option>
    <option>Insecticides</option>
    <option>Lime</option>
    <option>Seed / Plants</option>
</select> */