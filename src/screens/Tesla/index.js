import React, { Component } from "react";
import { VIew, StyleSheet, SafeAreaView, Animated, Image, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, prototype, Marker } from 'react-native-maps';
import mapStyle from '../../json/mapStyle.json'
import { SuperchargerMarker } from '../../svg';
import { SuperchargerMarkerGrey } from '../../svg';
//import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
var StoreGlobal = require('../../stores/storeGlobal');

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default class Tesla extends Component {

    state = {
        tracksViewChanges: true,
        currentPosition: {
            latitude: 0.0,
            longitude: 0.0,
        },
        teslaDataSource: []
    };


    stopTrackingViewChanges = () => {
        this.setState(() => ({
            tracksViewChanges: false,
        }));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.shouldUpdate(nextProps)) {
            this.setState(() => ({
                tracksViewChanges: true,
            }));
        }
    }

    // shouldUpdate = (nextProps) => { //TODO implement }

    async getTeslaDataSource() {
        await fetch("https://api.openchargemap.io/v3/poi/?output=json&operatorid=23&client=Tesla-Key&key=f272a852-9409-48dc-8f0f-f38360c7e1cd")
            .then(async response => await response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    teslaDataSource: responseJson
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {

        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    currentPosition: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );

        this.getTeslaDataSource();

    }

    componentWillUnmount = () => {

        Geolocation.clearWatch(this.watchID);

    }

    render() {


        mapTeslaMarkers = () => {

            return this.state.teslaDataSource.map((marker, index) => {

                // console.log('Marker latitude :', marker.AddressInfo.Latitude);
                // console.log('Marker longitude :', marker.AddressInfo.Longitude);

                if (marker.StatusType.IsOperational == true) {
                    return (
                        <Marker
                            key={index}
                            //tracksViewChanges={false}
                            tracksViewChanges={this.state.tracksViewChanges}
                            coordinate={{ latitude: marker.AddressInfo.Latitude, longitude: marker.AddressInfo.Longitude }}
                            //cluster={true}
                            title={marker.AddressInfo.Title}
                            description={"Address: " + marker.AddressInfo.AddressLine1}
                        >
                            <SuperchargerMarker style={styles.superchargerMarker} onLoad={this.stopTrackingViewChanges} />
                        </Marker>
                    );
                } else {
                    return (
                        <Marker
                            key={index}
                            //tracksViewChanges={false}
                            tracksViewChanges={this.state.ztracksViewChanges}
                            coordinate={{ latitude: marker.AddressInfo.Latitude, longitude: marker.AddressInfo.Longitude }}
                            //cluster={true}
                            title={marker.AddressInfo.Title}
                            description={"Address: " + marker.AddressInfo.AddressLine1}
                        >
                            <SuperchargerMarkerGrey style={styles.superchargerMarker} onLoad={this.stopTrackingViewChanges} />
                        </Marker>
                    );
                }
            })
        }

        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.container}
                customMapStyle={mapStyle}
                mapType="standard"
                showsUserLocation={true}
                userLocationAnnotationTitle="My position"
                followsUserLocation={true}
                showsMyLocationButton={true}
                showsPointsOfInterest={true}
                showsCompass={true}
                showsIndoors={true}
                zoomEnabled={true}
                zoomControlEnabled={true}
                loadingEnabled={true}
                scrollEnabled={true}
                //clustering={true}
                //ref={map => this.map = map}
                //clusterColor='#000'
                //clusterTextColor='#fff'
                //clusterBorderColor='#fff'
                //clusterBorderWidth={4}
                region={{
                    latitude: this.state.currentPosition.latitude,
                    longitude: this.state.currentPosition.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                style={styles.container}
            >
                {mapTeslaMarkers()}
            </MapView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        paddingVertical: 10,
    },
    endPadding: {
        paddingRight: width - CARD_WIDTH,
    },
    card: {
        padding: 10,
        elevation: 2,
        backgroundColor: "#FFF",
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
    },
    cardImage: {
        flex: 3,
        width: "100%",
        height: "100%",
        alignSelf: "center",
    },
    textContent: {
        flex: 1,
    },
    cardtitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 12,
        color: "#444",
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 8,
        height: 12,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    superchargerMarker: {
        width: 24,
        height: 24,
    },
    batteryText: {
        fontSize: 10
    },
    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
});
