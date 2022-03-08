import React from "react";
import mapboxgl from "mapbox-gl";
import geojson from "geojson";

const turf = require("@turf/turf");

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN!;

type MapProps = {
    fields: geojson.FeatureCollection;
    exportNames: (names: FieldNamePair[]) => void;
}

type MapState = {
    currentField: geojson.Feature | undefined;
    namedFieldCount: number;
    names: FieldNamePair[];
    inputValue: string;
}

export type FieldNamePair = {
    field_id: string;
    name: string;
}

export default class NamingMapComponent extends React.Component<MapProps, MapState> {
    constructor(props: MapProps) {
        super(props);

        this.handleNameSubmit = this.handleNameSubmit.bind(this);
    }

    map: mapboxgl.Map | undefined;

    state: MapState = {
        currentField: this.props.fields.features[0],
        namedFieldCount: 1,
        names: [],
        inputValue: ""
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

        this.map.on("load", () => {
            this.map!.addSource("parcels", {
                type: "geojson",
                data: this.props.fields
            });

            this.map!.setFeatureState(
                { source: "parcels", id: this.state.currentField!.id! },
                { currentField: true }
            )

            for(let i = 1; i < this.props.fields.features.length; i++) {
                this.map!.setFeatureState(
                    { source: "parcels", id: this.props.fields.features[i].id! },
                    { currentField: false }
                )
            }
    
            this.map!.addLayer({
                id: "parcel-boundaries",
                type: "fill",
                source: "parcels",
                paint: {
                    "fill-color": [
                        "case",
                        ["boolean", ["feature-state", "currentField"], false],
                        "#00ff00",
                        "#808080"
                    ],
                    "fill-opacity": 0.5
                }
            });

            this.map!.flyTo({ center: turf.center(this.state.currentField!).geometry.coordinates, zoom: 13 });
        })
    }

    handleNameSubmit(event: React.SyntheticEvent) {
        event.preventDefault();

        if (this.state.namedFieldCount === this.props.fields.features.length) {
            this.setState((state) => ({
                names: [...state.names, {field_id: this.state.currentField!.properties!.field_id, name: this.state.inputValue}]
            }), () => this.props.exportNames(this.state.names));
        } else {
            this.setState((state) => ({
                names: [...state.names, {field_id: this.state.currentField!.properties!.field_id, name: this.state.inputValue}]
            }));

            this.map!.setFeatureState(
                { source: "parcels", id: this.state.currentField!.id! },
                { currentField: false }
            )

            this.setState((state) => ({
                currentField: this.props.fields.features[state.namedFieldCount]
            }), () => {
                this.map!.setFeatureState(
                    { source: "parcels", id: this.state.currentField!.id! },
                    { currentField: true }
                );

                this.map!.flyTo({ center: turf.center(this.state.currentField!).geometry.coordinates, zoom: 13 });

                this.setState((state) => ({
                    namedFieldCount: state.namedFieldCount + 1,
                }));
            });
        }

        this.setState({inputValue: ""})
    }

    render() {
        return (
            <div className="flex" style={{ display: "flex" }}>
                <div id="map-container" style={{ width: "100%", height: 600 }}></div>
                <div className="ml-4" style={{ minWidth: "300px" }}>
                    <h2 className="text-2xl font-semibold mb-2">{this.state.currentField!.properties!.field_id} - {this.state.namedFieldCount} of {this.props.fields.features.length}</h2>
                    <form onSubmit={this.handleNameSubmit}>
                        <label className="block mt-6 mb-2 text-sm font-medium text-secondary-900">Name</label>
                        <input type="text" value={this.state.inputValue} onChange={event => this.setState({inputValue: event.target.value})} className="bg-secondary-50 border border-secondary-300 text-secondary-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 mb-3" />
                        <button type="submit" className="text-white bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-lg font-semibold">{this.state.namedFieldCount === this.props.fields.features.length ? "Finish" : "Next"}</button>
                    </form>
                </div>
            </div>
            
        )
    }
}