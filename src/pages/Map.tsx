import React from "react";
import mapboxgl from "mapbox-gl";

import geojson from "geojson"

const turf = require("@turf/turf");

mapboxgl.accessToken = "pk.eyJ1IjoiamFtZXMyODY4OSIsImEiOiJja3F4eWNqc24xMnd0MzFxcDB2azVzbDZuIn0._BCf462zUp_7C1cjeAGueg";

type MapProps = {
    onMount: MapFunction;
    exportFields: (fields: geojson.FeatureCollection) => void;
}

type MapState = {
    fieldData: geojson.FeatureCollection | undefined;
    selectedFields: string[];
}

export enum MapFunction {
    fetchGovDataAndDisplay,
}

class MapComponent extends React.Component<MapProps, MapState> {
    constructor(props: MapProps) {
        super(props);

        this.handleFinish = this.handleFinish.bind(this);
    }

    state: MapState = {
        fieldData: undefined,
        selectedFields: []
    }

    fetchGovDataAndDisplay(map: mapboxgl.Map) {
        fetch("https://environment.data.gov.uk/arcgis/rest/services/RPA/LandParcels/MapServer/0/query?where=SBI=106791068&f=geojson&outFields=sheet_id,parcel_id,id")
            .then(res => res.json())
            .then((data: geojson.FeatureCollection) => {
                console.log(data);
                
                for (let i = 0; i < data.features.length; i++) {
                    data.features[i].properties!.field_id = data.features[i].properties!.sheet_id + " " + data.features[i].properties!.parcel_id;
                    data.features[i].id = data.features[i].properties!.id;
                }

                this.setState((state) => ({
                    ...state,
                    fieldData: data
                }));

                map.addSource("parcels", {
                    type: "geojson",
                    data: data
                });

                map.addLayer({
                    id: "parcel-boundaries",
                    type: "fill",
                    source: "parcels",
                    paint: {
                        "fill-color": [
                            "case",
                            ["boolean", ["feature-state", "selected"], false],
                            "#00ff00",
                            "#ff0000"
                        ],
                        "fill-opacity": 0.5
                    }
                });

                map.on("click", "parcel-boundaries", (e) => {
                    const clicked = map.queryRenderedFeatures(e.point, {
                        layers: ["parcel-boundaries"]
                    })

                    const selectedID = clicked[0].properties!.field_id;

                    if (this.state.selectedFields.includes(selectedID)) {
                        const newSelectedFields = Object.assign([], this.state.selectedFields)
                        newSelectedFields.splice(newSelectedFields.indexOf(selectedID), 1)

                        this.setState({
                            selectedFields: newSelectedFields,
                        });

                        map.setFeatureState(
                            { source: "parcels", id: clicked[0].id! },
                            { selected: false }
                        )
                    } else {
                        this.setState((state) => ({
                            selectedFields: [...state.selectedFields, selectedID],
                        }));

                        map.setFeatureState(
                            { source: "parcels", id: clicked[0].id! },
                            { selected: true }
                        )
                    }


                });

                var centerPoint = turf.centerOfMass(data);
                console.log(centerPoint);

                map.flyTo({center: centerPoint.geometry.coordinates, zoom: 11});
            });
    }

    handleFinish() {
        let fields = Object.assign({}, this.state.fieldData);

        fields!.features = fields!.features.filter(field => this.state.selectedFields.includes(field.properties!.field_id));

        this.props.exportFields(fields!);
    }

    componentDidMount() {
        var map = new mapboxgl.Map({
            container: "map-container",
            style: "mapbox://styles/mapbox/satellite-streets-v9"
        });

        map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                trackUserLocation: true,
            })
        );

        map.addControl(new mapboxgl.NavigationControl());

        if (this.props.onMount === MapFunction.fetchGovDataAndDisplay) {
            this.fetchGovDataAndDisplay(map);
        }
    }

    render() {
        return (
            <div>
                <div id="map-container" style={{ width: "100%", height: 800 }}></div>
                <button onClick={this.handleFinish}>Finish</button>
            </div>
        )
    }
}

export default MapComponent;