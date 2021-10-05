import { useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
// import { useDatabase } from "../contexts/DatabaseContext";
import Nav from "./navbar/Nav";

import { ReactComponent as SearchIcon } from "../images/search.svg";
import { ReactComponent as UserCircleIcon } from "../images/user-circle.svg";

export default function Home() {
    const [error, setError] = useState("");
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { logout, currentUser } = useAuth();
    // const { fieldInfos, fieldGeometries } = useDatabase();
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

    return (
        <div className="flex">
            <Nav />

            <div className="w-screen h-screen ml-60">
                <div className="flex items-center px-6 py-4">
                    <div className="relative flex w-full flex-wrap items-stretch">
                        <span className="z-10 h-full leading-snug font-normal text-center text-secondary-500 fill-current absolute bg-transparent rounded text-base items-center justify-center w-8 pl-3 py-3">
                            <SearchIcon className="h-5 w-5" />
                        </span>
                        <input type="text" placeholder="Search here..." className="border-secondary-300 px-3 py-3 placeholder-secondary-300 text-secondary-600 relative bg-white rounded-lg text-sm outline-none focus:outline-none focus:border-green-500 focus:ring-primary-500 w-1/4 pl-10"/>
                    </div>

                    <div className="relative ml-auto">
                        <UserCircleIcon className="h-8 w-8 text-secondary-400 fill-current cursor-pointer transform transition duration-200 hover:scale-110" onClick={e => setUserMenuOpened(!userMenuOpened)} />
                        { userMenuOpened && (
                            <div className="absolute right-0 mt-2 py-2 w-auto bg-white rounded-md shadow-xl z-20">
                                <div className="block px-4 py-2 mx-2">
                                    <h1 className="font-semibold text-sm truncate">James Watling</h1>
                                    <h3 className="font-thin text-xs">{currentUser!.email}</h3>
                                </div>
                                <hr className="my-2" />
                                <a href="/forgot-password" className="block px-4 py-2 text-sm capitalize text-secondary-500 rounded-lg mx-2 cursor-pointer hover:bg-primary-500 hover:bg-opacity-30 hover:text-green-600">
                                    Profile
                                </a>
                                <div onClick={handleLogout} className="block px-4 py-2 text-sm capitalize text-secondary-500 rounded-lg mx-2 cursor-pointer hover:bg-primary-500 hover:bg-opacity-30 hover:text-green-600">
                                    Logout
                                </div>
                            </div>
                        ) }
                    </div>
                    
                </div>
                <div className="m-8 p-4 w-80 h-40 bg-white rounded-xl border shadow-lg">
                    <h3 className="text-secondary-700 font-semibold">Total Active Users</h3>
                    <h1 className="text-secondary-900 font-bold text-4xl mt-4">18,765</h1>
                </div>
                { error && <p>{error}</p> }
            </div>
        </div>
    )
}