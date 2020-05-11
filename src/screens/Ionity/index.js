import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Animated, Image, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, prototype, Marker } from 'react-native-maps';
import mapStyle from '../../json/mapStyle.json'
//import MapView from 'react-native-map-clustering';
import Geolocation from '@react-native-community/geolocation';
var StoreGlobal = require('../../stores/storeGlobal');
var ionityMarker = require('../../img/ionity-marker.png');
var ionityMarkerWhite = require('../../img/ionity-marker-white.png');

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;

export default class Ionity extends Component {

  state = {
    tracksViewChanges: true,
    currentPosition: {
      latitude: 0.0,
      longitude: 0.0,
    },
    ionityDataSource: []
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

  async getIonityDataSource() {
    await fetch("https://ionity.evapi.de/api/ionity/locations/")
      .then(async response => await response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          ionityDataSource: responseJson
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

    this.getIonityDataSource();
  }

  componentWillUnmount = () => {

    Geolocation.clearWatch(this.watchID);

  }

  render() {

    mapMarkers = () => {

      return this.state.ionityDataSource.map((marker, index) => {

        //console.log('Marker latitude :', marker.coords.lat);
        //console.log('Marker longitude :', marker.coords.lng);

        if (marker.state == 1) {
          return (
            <Marker
              key={index}
              //tracksViewChanges={false}
              tracksViewChanges={this.state.tracksViewChanges}
              coordinate={{ latitude: marker.coords.lat, longitude: marker.coords.lng }}
            //cluster={true}
            >
              <Image source={ionityMarker} style={styles.ionityMarker} onLoad={this.stopTrackingViewChanges} fadeDuration={0} />
            </Marker>
          );
        } else {
          return (
            <Marker
              key={index}
              //tracksViewChanges={false}
              tracksViewChanges={this.state.tracksViewChanges}
              coordinate={{ latitude: marker.coords.lat, longitude: marker.coords.lng }}
            //cluster={true}
            >
              <Image source={ionityMarkerWhite} style={styles.ionityMarker} onLoad={this.stopTrackingViewChanges} fadeDuration={0} />
            </Marker>
          );
        }

      })

    }

    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
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
        region={this.state.region}
        region={{
          latitude: this.state.currentPosition.latitude,
          longitude: this.state.currentPosition.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        {mapMarkers()}
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
  ionityMarker: {
    width: 25,
    height: 40,
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
