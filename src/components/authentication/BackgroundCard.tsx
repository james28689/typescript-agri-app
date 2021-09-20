import React from "react";

import wheatIcon from "../../images/wheat-icon-2.png"
import backgroundImage from "../../images/background.png"

type BackgroundCardProps = {
    title: string;
    children: React.ReactNode;
}

export default function BackgroundCard(props: BackgroundCardProps) {
    return (
        <div style={{backgroundImage: `url(${backgroundImage})`}} className="w-screen h-screen bg-no-repeat bg-cover flex items-center justify-center">
            <div className="max-w-md md:w-full space-y-8 bg-white py-8 px-6 md:shadow-2xl md:rounded-lg space-y-4 w-screen h-screen md:h-auto">
                <img className="h-14 w-auto mx-auto" src={wheatIcon} />
            
                <h1 className="text-center text-3xl font-extrabold text-gray-900">{props.title}</h1>

                { props.children }
            </div>
        </div>
    )
}
