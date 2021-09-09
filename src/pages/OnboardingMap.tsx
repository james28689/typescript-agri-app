import React from "react";
import Map, { MapFunction } from "./Map";
import mapboxgl from "mapbox-gl";

export default function OnboardingMap() {
    const childRef = React.useRef<Map>(null);


    const onMountFunction = (map: mapboxgl.Map) => {
        childRef.current!.fetchGovDataAndDisplay(map);
    }

    return(
        <Map onMount={MapFunction.fetchGovDataAndDisplay} ref={childRef} />
    )
}