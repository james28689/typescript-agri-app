import Nav from "../components/navbar/Nav";

export default function Settings() {
    return(
        <div className="flex">
            <Nav active="Home" />
            
            <div className="w-screen h-screen ml-60">
                <div className="p-6">
                    <button onClick={() => console.log("Clear data press.")}>Clear All Data</button>
                    <hr />
                    <button onClick={() => console.log("Button press.")}>Delete Account</button>
                </div>
            </div>
        </div>
    )
}