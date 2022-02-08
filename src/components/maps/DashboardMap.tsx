import React from "react";
import mapboxgl from "mapbox-gl";
import geojson from "geojson";
import { IField } from "../../contexts/DatabaseContext";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!;

type MapProps = {
    fieldData: IField[];
}

type MapState = {
    fieldData: geojson.FeatureCollection | undefined;
}

export default class DashboardMapComponent extends React.Component<MapProps, MapState> {
    map: mapboxgl.Map | undefined;

    state: MapState = {
        fieldData: undefined
    }

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
                trackUserLocation: true
            })
        );

        this.map.addControl(new mapboxgl.NavigationControl());

        this.setState((state, props) => {
            const formattedFeatures = props.fieldData.map(field => {
                return field.geometry
            })

            return {
                fieldData: {
                    "type": "FeatureCollection",
                    "features": formattedFeatures
                }
            }
        })

        this.map.on("load", () => {
            this.map!.addSource("fields", {
                "type": "geojson",
                "data": this.state.fieldData
            });

            this.map!.addLayer({
                "id": "fields",
                "type": "fill",
                "source": "fields",
                "paint": {
                    "fill-color": "#ff0000",
                    "fill-opacity": 0.5
                }
            })

            this.map!.on("click", "fields", e => {
                if (e.features) {
                    new mapboxgl.Popup()
                        .setLngLat(e.lngLat)
                        .setHTML(`<h3>${e.features![0].properties!.name}`)
                        .addTo(this.map!);
                }
            })
        })


    }

    render() {
        return (
            <div id="map-container" style={{ width: "100%", height: "500px" }}>
            </div>
        )
    }
}