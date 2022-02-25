import React, { useState, useEffect } from "react";
import { Feature } from "geojson";
import { useAuth } from "./AuthContext";
import axios from "axios";

export interface IField {
    _id: string;
    name: string;
    crop: string;
    rpa_field_id: string;
    user: string;
    geometry: Feature;
}

export interface IOrder {
    date: Date;
    amount: number;
    pricePerUnit: number;
}

export interface IStock {
    _id: string;
    name: string;
    type: string;
    units: string;
    amount: number;
    used: number;
    orders: IOrder[];
    user: string;
}

interface IDatabaseContext {
    fields: IField[] | null;
    stocks: IStock[] | null;
    updateFields(): void;
    createField(name: string, rpa_field_id: string, crop: string, geometry: Feature): void;
    updateField(field: IField): void;
    updateStocks(): void;
    createStock(name: string, type: string, units: string, amount: number, used: number): void;
    updateStock(stock: IStock): void;
    deleteStock(stockID: string): void;
    createOrder(amount: number, pricePerUnit: number, stockID: string): void;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [fields, setFields] = useState<IField[] | null>(null);
    const [stocks, setStocks] = useState<IStock[] | null>(null);
    const { currentUser, accessToken } = useAuth();

    useEffect(() => {
        if (currentUser) {
            console.log()

            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/field/getFieldByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch((err) => {
                console.log(err);
            }).then((res: any) => {
                const typedRes = res.data as IField[];

                const output = typedRes.map(field => {
                    field.geometry.properties!.name = field.name;
                    return field;
                });
                
                setFields(output);
            });

            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stock/getStockByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as IStock[];
                
                setStocks(typedRes);
            });
        } else {
            setFields(null);
            setStocks(null);
        }
    }, [currentUser, accessToken]);

    function updateFields() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/field/getFieldByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch((err) => {
                console.log(err);
            }).then((res: any) => {
                const typedRes = res.data as IField[];

                const output = typedRes.map(field => {
                    field.geometry.properties!.name = field.name;
                    return field
                })
                
                setFields(output);
            })
        } else {
            setFields(null);
        }
    }

    function createField(name: string, rpa_field_id: string, crop: string, geometry: Feature) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/field/create`, {
                name,
                rpa_field_id,
                crop,
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

    function updateField(field: IField) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/field/update`, {
                ...field
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch((err) => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateFields();
            })
        }
    }

    function updateStocks() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stock/getStockByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as IStock[];
                
                setStocks(typedRes);
            })
        } else {
            setStocks(null);
        }
    }

    function createStock(name: string, type: string, units: string, amount: number, used: number) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stock/create`, {
                name,
                type,
                units,
                amount,
                used
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateStocks();
            })
        }
    }

    function updateStock(stock: IStock) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stock/update`, {
                ...stock
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateStocks();
            })
        }
    }

    function deleteStock(stockID: string) {
        if (currentUser) {
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/stock/delete/${stockID}`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateStocks();
            })
        }
    }

    function createOrder(amount: number, pricePerUnit: number, stockID: string) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/stock/create-order`, {
                stockID,
                amount,
                pricePerUnit
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateStocks();
            })
        }
    }

    const value: IDatabaseContext = {
        fields,
        stocks,
        updateFields,
        createField,
        updateField,
        updateStocks,
        createStock,
        updateStock,
        deleteStock,
        createOrder
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}