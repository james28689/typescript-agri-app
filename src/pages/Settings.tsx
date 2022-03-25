import Nav from "../components/navbar/Nav";
import { useAuth } from "../contexts/AuthContext";
import { useDatabase } from "../contexts/DatabaseContext";

export default function Settings() {
    const { deleteUserData } = useAuth();
    const { clearAllData } = useDatabase();

    function clearDataConfirm() {
        if (window.confirm("Are you sure you want to clear all data?") === true) {
            clearAllData();
        }
    }

    function deleteAccountConfirm() {
        if (window.confirm("Are you sure you want to delete your account?") === true) {
            clearAllData();
            deleteUserData();
        }
    }

    return(
        <div className="flex">
            <Nav active="" />
            
            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <button onClick={clearDataConfirm} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Clear All Data</button>
                    <br />
                    <button onClick={deleteAccountConfirm} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Delete Account</button>
                </div>
            </div>
        </div>
    )
}