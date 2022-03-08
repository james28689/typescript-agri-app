import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";
import DashboardMapComponent from "./maps/DashboardMap";
import Nav from "./navbar/Nav";

import { ReactComponent as UserCircleIcon } from "../images/user-circle.svg";
import { ReactComponent as SettingsIcon } from "../images/cog.svg";
import { ReactComponent as LogoutIcon } from "../images/angle-double-left.svg";

export default function Home() {
    const [error, setError] = useState("");
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { logout, currentUser } = useAuth();
    const { fields, stocks, sales, costs } = useDatabase();
    const history = useHistory();

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

    function displayFieldData() {
        console.log(fields);
    }

    return (
        <div className="flex">
            <Nav active="Home" />

            <div className="w-screen h-screen ml-60">
                <div className="flex items-center px-6 py-4">
                    {/* <div className="relative flex w-full flex-wrap items-stretch">
                        <span className="z-10 h-full leading-snug font-normal text-center text-secondary-500 fill-current absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                            <SearchIcon className="h-5 w-5" />
                        </span>
                        <input type="text" placeholder="Search here..." className="border-secondary-300 px-3 py-3 placeholder-secondary-300 text-secondary-600 relative bg-white rounded-lg text-sm outline-none focus:outline-none focus:border-green-500 focus:ring-primary-500 w-1/4 pl-10"/>
                    </div> */}

                    <div className="relative ml-auto">
                        <UserCircleIcon className="h-8 w-8 text-secondary-400 fill-current cursor-pointer transform transition duration-200 hover:scale-110" onClick={e => setUserMenuOpened(!userMenuOpened)} />
                        { userMenuOpened && (
                            <div className="absolute right-0 mt-2 py-2 w-auto bg-white rounded-md shadow-xl z-20">
                                <div className="block px-4 py-2 mx-2">
                                    <h1 className="font-semibold text-sm truncate">{currentUser?.firstName} {currentUser?.lastName}</h1>
                                    <h3 className="font-thin text-xs">{currentUser!.email}</h3>
                                </div>
                                <hr className="my-2" />
                                <Link to="/settings" className="px-4 py-2 text-sm capitalize text-secondary-600 rounded-lg mx-2 cursor-pointer hover:bg-primary-500 hover:bg-opacity-30 hover:text-green-600 flex flex-row items-center">
                                    <SettingsIcon className="w-4 h-4 mr-2 fill-current" />
                                    Settings
                                </Link>
                                <div onClick={handleLogout} className="px-4 py-2 text-sm capitalize text-secondary-600 rounded-lg mx-2 cursor-pointer hover:bg-primary-500 hover:bg-opacity-30 hover:text-green-600 flex flex-row items-center">
                                    <LogoutIcon className="w-4 h-4 mr-2 fill-current" />
                                    Logout
                                </div>
                            </div>
                        ) }
                    </div>
                    
                </div>

                <div className="space-y-4">
                    <div className="m-8 p-6 min-w-80 min-h-40 inline-block bg-white rounded-xl border shadow-lg">
                        <h3 className="text-secondary-700 font-semibold">Total Area Farmed</h3>
                        <h1 className="text-secondary-900 font-bold text-4xl mt-4">{fields?.filter(f => f.crop !== "None").map(f => f.geometry.properties!.area_ha).reduce((a,b) => a+b, 0).toFixed(2)} ha</h1>
                    </div>

                    <div className="m-8 p-6 min-w-80 min-h-40 inline-block bg-white rounded-xl border shadow-lg">
                        <h3 className="text-secondary-700 font-semibold">Total Stock Costs</h3>
                        <h1 className="text-secondary-900 font-bold text-4xl mt-4">£{[...stocks?.map(s => [...s.orders.map(o => o.amount * o.pricePerUnit) ?? [], 0].reduce((a,b) => a+b)) ?? [], 0].reduce((a,b) => a+b)}</h1>
                    </div>
                    
                    <div className="m-8 p-6 min-w-80 min-h-40 inline-block bg-white rounded-xl border shadow-lg">
                        <h3 className="text-secondary-700 font-semibold">Total Sale Income</h3>
                        <h1 className="text-secondary-900 font-bold text-4xl mt-4">£{[...sales?.map(s => s.price) ?? [], 0].reduce((a,b) => a+b)}</h1>
                    </div>

                    <div className="m-8 p-6 min-w-80 min-h-40 inline-block bg-white rounded-xl border shadow-lg">
                        <h3 className="text-secondary-700 font-semibold">Total Additional Costs</h3>
                        <h1 className="text-secondary-900 font-bold text-4xl mt-4">£{[...costs?.map(c => c.amount) ?? [], 0].reduce((a,b) => a+b)}</h1>
                    </div>
                </div>
                
                { fields &&
                    <div className="m-8 overflow-hidden rounded-xl border shadow-lg">
                        <div className="w-full" style={{ height: "30rem" }}>
                            <DashboardMapComponent fieldData={fields!}/>
                        </div>
                    </div>
                }   

                { error && <p>{error}</p> }
            </div>
        </div>
    )
}