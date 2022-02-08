// import React, { useState, useEffect } from "react";

import { useAuth } from "../contexts/AuthContext";

import Onboarding from "../components/Onboarding";
import Dashboard from "../components/Dashboard";

export default function Home() {
    const { currentUser } = useAuth();

    if (currentUser!.mustOnboard) {
        return <Onboarding />
    } else {
        return <Dashboard />
    }
}