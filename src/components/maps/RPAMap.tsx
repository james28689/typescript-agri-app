import React from "react";
import mapboxgl from "mapbox-gl";
import geojson from "geojson"
const turf = require("@turf/turf");

mapboxgl.accessToken = "pk.eyJ1IjoiamFtZXMyODY4OSIsImEiOiJja3F4eWNqc24xMnd0MzFxcDB2azVzbDZuIn0._BCf462zUp_7C1cjeAGueg";

type MapProps = {
    SBI?: string;
    exportFields?: (fields: geojson.FeatureCollection) => void;
}

type MapState = {
    fieldData: geojson.FeatureCollection | undefined;
    selectedFields: string[];
}

export default class RPAMapComponent extends React.Component<MapProps, MapState> {
    constructor(props: MapProps) {
        super(props);

        this.handleFinish = this.handleFinish.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }

    map: mapboxgl.Map | undefined;

    state: MapState = {
        fieldData: undefined,
        selectedFields: []
    }

    handleFinish() {
        let fields = Object.assign({}, this.state.fieldData);

        fields!.features = fields!.features.filter(field => this.state.selectedFields.includes(field.properties!.field_id));

        this.props.exportFields!(fields!);
    }

    handleSelectAll() {
        const allFields: string[] = []
        this.state.fieldData!.features.forEach(feature => {
            allFields.push(feature.properties!.field_id);
            this.map!.setFeatureState(
                { source: "parcels", id: feature.id! },
                { selected: true }
            )
        });

        console.log(allFields);

        this.setState({
            selectedFields: allFields
        });
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
                trackUserLocation: true,
            })
        );

        this.map.addControl(new mapboxgl.NavigationControl());

        fetch(`https://environment.data.gov.uk/arcgis/rest/services/RPA/LandParcels/MapServer/0/query?where=SBI=${this.props.SBI!}&f=geojson&outFields=sheet_id,parcel_id,id,area_ha`)
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

                this.map!.addSource("parcels", {
                    type: "geojson",
                    data: data
                });

                this.map!.addLayer({
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

                this.map!.on("click", "parcel-boundaries", (e) => {
                    const clicked = this.map!.queryRenderedFeatures(e.point, {
                        layers: ["parcel-boundaries"]
                    })

                    const selectedID = clicked[0].properties!.field_id;

                    if (this.state.selectedFields.includes(selectedID)) {
                        const newSelectedFields = Object.assign([], this.state.selectedFields)
                        newSelectedFields.splice(newSelectedFields.indexOf(selectedID), 1)

                        this.setState({
                            selectedFields: newSelectedFields,
                        });

                        this.map!.setFeatureState(
                            { source: "parcels", id: clicked[0].id! },
                            { selected: false }
                        )
                    } else {
                        this.setState((state) => ({
                            selectedFields: [...state.selectedFields, selectedID],
                        }));

                        this.map!.setFeatureState(
                            { source: "parcels", id: clicked[0].id! },
                            { selected: true }
                        )
                    }
                });

                var centerPoint = turf.centerOfMass(data);
                console.log(centerPoint);

                this.map!.flyTo({center: centerPoint.geometry.coordinates, zoom: 11});
            });
    }

    render() {
        return (
            <div id="container" style={{ display: "flex" }}>
                <div id="left" style={{ width: "100%" }}>
                    <div id="map-container" style={{ width: "100%", height: 800 }}></div>

                    <button onClick={this.handleSelectAll}>Select All</button>

                    <button onClick={this.handleFinish}>Next</button>
                </div>

                <div id="right" style={{ minWidth: "200px" }}>
                    <h2>Selected Field IDs</h2>
                    <ul>
                    { this.state.selectedFields.map(field => {
                        return <li key={field}>{field}</li> 
                    }) }
                    </ul>
                </div>
            </div>
        )
    }
}