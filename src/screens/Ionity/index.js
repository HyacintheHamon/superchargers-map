import React, { Component } from "react";
import { StyleSheet, SafeAreaView, Animated, Image, Dimensions } from "react-native";
import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT, prototype, Marker } from 'react-native-maps';
import mapStyle from '../../json/mapStyle.json'
//import MapView from 'react-native-map-clustering';

var StoreGlobal = require('../../stores/storeGlobal');
var ionityMarker = require('../../img/ionity-marker.png');
var ionityMarkerWhite = require('../../img/ionity-marker-white.png');

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;

export default class Ionity extends Component {

  state = {
    region: {
      latitude: StoreGlobal.currentLatitude,
      longitude: StoreGlobal.currentLatitude,
      latitudeDelta: 0.04864195044303443,
      longitudeDelta: 0.040142817690068,
    },
    ionityDataSource: []
  };

  async getIonityDataSource() {
    await fetch("https://ionity.evapi.de/api/ionity/locations/")
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          ionityDataSource: responseJson
        })
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getIonityDataSource();
  }

  render() {

    mapMarkers = () => {

      return this.state.ionityDataSource.map((marker, index) => {

        console.log('Marker latitude :', marker.coords.lat);
        console.log('Marker longitude :', marker.coords.lng);

        if (marker.state == 1) {
          return (
            <Marker
              key={index}
              tracksViewChanges={false}
              coordinate={{ latitude: marker.coords.lat, longitude: marker.coords.lng }}
            //cluster={true}
            >
              <Image source={ionityMarker} style={styles.ionityMarker} />
            </Marker>
          );
        } else {
          return (
            <Marker
              key={index}
              tracksViewChanges={false}
              coordinate={{ latitude: marker.coords.lat, longitude: marker.coords.lng }}
            //cluster={true}
            >
              <Image source={ionityMarkerWhite} style={styles.ionityMarker} />
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
        style={styles.container}
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
