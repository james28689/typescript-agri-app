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
    area_ha: number;
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

export interface ISale {
    _id: string;
    crop: string;
    amount: number;
    price: number;
    date: Date;
    field: string;
    user: string;
}

export interface ICost {
    _id: string;
    date: Date;
    title: string;
    detail: string;
    amount: number;
    field: string;
    user: string;
}

export interface IUsage {
    _id: string;
    date: Date;
    amount: number;
    stock: string;
    field: string;
    user: string;
}

interface IDatabaseContext {
    fields: IField[] | null;
    stocks: IStock[] | null;
    sales: ISale[] | null;
    costs: ICost[] | null;
    usages: IUsage[] | null;

    updateFields(): void;
    createField(name: string, rpa_field_id: string, crop: string, geometry: Feature): void;
    updateField(field: IField): void;

    updateStocks(): void;
    createStock(name: string, type: string, units: string, amount: number, used: number): void;
    updateStock(stock: IStock): void;
    deleteStock(stockID: string): void;

    updateSales(): void;
    createOrder(amount: number, pricePerUnit: number, stockID: string): void;
    createSale(crop: string, amount: number, price: number, field: string): void;
    updateSale(sale: ISale): void;
    deleteSale(saleID: string): void;

    updateCosts(): void;
    createCost(title: string, detail: string, field: string, amount: number): void;
    updateCost(cost: ICost): void;
    deleteCost(costID: string): void;

    updateUsages(): void;
    createUsage(amount: number, stock: string, field: string): void;
    updateUsage(usage: IUsage): void;
    deleteUsage(usageID: string): void;
}

const DatabaseContext = React.createContext({} as IDatabaseContext);

export function useDatabase() {
    return React.useContext(DatabaseContext);
}

export function DatabaseProvider({ children }: { children: any }) {
    const [fields, setFields] = useState<IField[] | null>(null);
    const [stocks, setStocks] = useState<IStock[] | null>(null);
    const [sales, setSales] = useState<ISale[] | null>(null);
    const [costs, setCosts] = useState<ICost[] | null>(null);
    const [usages, setUsages] = useState<IUsage[] | null>(null);
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

            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale/getSalesByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as ISale[];
                
                setSales(typedRes);
            });

            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cost/getCostsByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as ICost[];
                setCosts(typedRes);
            })

            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/usage/getUsagesByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as IUsage[];
                setUsages(typedRes);
            });
        } else {
            setFields(null);
            setStocks(null);
            setSales(null);
            setCosts(null);
            setUsages(null);
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
                geometry,
                area_ha: geometry.properties!.area_ha
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

    function updateSales() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/sale/getSalesByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as ISale[];
                console.log(typedRes);
                setSales(typedRes);
            })
        } else {
            setSales(null);
        }
    }

    function createSale(crop: string, amount: number, price: number, field: string) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale/create`, {
                crop,
                amount,
                price,
                field
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateSales();
            });
        }
    }

    function updateSale(sale: ISale) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/sale/update`, {
                ...sale
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateSales();
            });
        }
    }

    function deleteSale(saleID: string) {
        if (currentUser) {
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/sale/delete/${saleID}`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateSales();
            })
        }
    }

    function updateCosts() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/cost/getCostsByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as ICost[];
                console.log(typedRes);
                setCosts(typedRes);
            })
        } else {
            setCosts(null);
        }
    }

    function createCost(title: string, detail: string, field: string, amount: number) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cost/create`, {
                title,
                detail,
                field,
                amount
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateCosts();
            });
        }
    }

    function updateCost(cost: ICost) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/cost/update`, {
                ...cost
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateCosts();
            });
        }
    }

    function deleteCost(costID: string) {
        if (currentUser) {
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/cost/delete/${costID}`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateCosts();
            })
        }
    }

    function updateUsages() {
        if (currentUser) {
            axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/usage/getUsagesByUser`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                const typedRes = res.data as IUsage[];
                console.log(typedRes);
                setUsages(typedRes);
            });
        } else {
            setUsages(null);
        }
    }

    function createUsage(amount: number, stock: string, field: string) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/usage/create`, {
                amount,
                field,
                stock
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateUsages();
            });
        }
    }

    function updateUsage(usage: IUsage) {
        if (currentUser) {
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/usage/update`, {
                ...usage
            }, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateUsages();
            });
        }
    }

    function deleteUsage(usageID: string) {
        if (currentUser) {
            axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/usage/delete/${usageID}`, {
                headers: {
                    "x-access-token": accessToken
                }
            }).catch(err => {
                console.log(err);
            }).then((res:any) => {
                console.log(res);
                updateUsages();
            })
        }
    }

    const value: IDatabaseContext = {
        fields,
        stocks,
        sales,
        costs,
        usages,

        updateFields,
        createField,
        updateField,

        updateStocks,
        createStock,
        updateStock,
        deleteStock,

        createOrder,
        updateSales,
        createSale,
        updateSale,
        deleteSale,

        updateCosts,
        createCost,
        updateCost,
        deleteCost,

        updateUsages,
        createUsage,
        updateUsage,
        deleteUsage
    }

    return (
        <DatabaseContext.Provider value={value}>
            { children }
        </DatabaseContext.Provider>
    )
}