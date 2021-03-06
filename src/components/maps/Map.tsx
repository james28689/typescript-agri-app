import React from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN!;

type MapProps = {
}

type MapState = {
}

export enum MapFunction {
    fetchGovDataAndDisplay,
    
}

class MapComponent extends React.Component<MapProps, MapState> {
    constructor(props: MapProps) {
        super(props);
    }

    map: mapboxgl.Map | undefined;

    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: "map-container",
            style: "mapbox://styles/mapbox/satellite-streets-v9"
        });

        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );

        this.map.addControl(new mapboxgl.NavigationControl());
    }

    render() {
        return (
            <div id="map-container" style={{ width: "100%", height: 800 }}></div>
        )
    }
}

export default MapComponent;