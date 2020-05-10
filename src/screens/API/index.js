import React from "react";
import { SafeAreaView, StyleSheet, View, ActivityIndicator, FlatList, Text, TouchableOpacity } from 'react-native';

navigator.geolocation = require('@react-native-community/geolocation');
var StoreGlobal = require('../../stores/storeGlobal');

export default class API extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: []
    };
  }

  componentDidMount() {

    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      this.callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location Access Required',
            'message': 'This App needs to Access your location'
          }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //Check if Permission is granted
            that.callLocation(that);
          } else {
            alert("Permission was denied");
          }
        } catch (err) {
          alert("err", err);
          console.warn(err)
        }
      }
      requestLocationPermission();
    }
  }

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID);
  }

  callLocation(that) {

    navigator.geolocation.getCurrentPosition(
      //Get the current location
      (position) => {
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        that.setState({ currentLongitude: currentLongitude });
        that.setState({ currentLatitude: currentLatitude });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    that.watchID = navigator.geolocation.watchPosition((position) => {

      const currentLongitude = JSON.stringify(position.coords.longitude);
      const currentLatitude = JSON.stringify(position.coords.latitude);

      that.setState({ currentLongitude: currentLongitude });
      that.setState({ currentLatitude: currentLatitude });

      // Global state
      StoreGlobal.currentLongitude = Number(currentLongitude);
      StoreGlobal.currentLatitude = Number(currentLatitude);
    });

    fetch("https://ionity.evapi.de/api/ionity/locations/")
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: responseJson
        })
      })
      .catch(error => console.log(error))
  }


  FlatListItemSeparator = () => {
    return (
      <View style={{
        height: .5,
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
      />
    );
  }

  /* SAMPLE RESPONSE

          "id": 302,
        "name": "Montélimar Est",
        "title": "IONITY High Power Charging",
        "description": "Number of CCS Chargers: 4\nStation open 24/7",
        "state": 1,
        "golive": "2020-03-24T08:30:04.815741Z",
        "startbuild": "2020-03-24T08:30:04.802622Z",
        "location": "SRID=4326;POINT (4.782 44.5131)",
        "coords": {
            "lng": 4.782,
            "lat": 44.5131
        },
        "geoState": {
            "name": "Drôme",
            "nameEn": "Drôme",
            "country": "France"
        },
        "city": "Nîmes",
        "cityDistance": 83,
        "road": "E15",
        "chargerCount": 4
  */
  renderItem = (data) =>
    <TouchableOpacity style={styles.list}>
      <Text style={styles.lightText}>Id: {data.item.id}</Text>
      <Text style={styles.lightText}>name: {data.item.name}</Text>
      <Text style={styles.lightText}>title: {data.item.title}</Text>
      <Text style={styles.lightText}>description: {data.item.description}</Text>
      <Text style={styles.lightText}>state: {data.item.state}</Text>
      <Text style={styles.lightText}>golive: {data.item.golive}</Text>
      <Text style={styles.lightText}>startbuild: {data.item.startbuild}</Text>
      <Text style={styles.lightText}>location: {data.item.location}</Text>
      <Text style={styles.lightText}>lng: {data.item.coords.lng}</Text>
      <Text style={styles.lightText}>lat: {data.item.coords.lat}</Text>
      <Text style={styles.lightText}>geoState name: {data.item.geoState.name}</Text>
      <Text style={styles.lightText}>geoState name EN: {data.item.geoState.nameEn}</Text>
      <Text style={styles.lightText}>geoState country: {data.item.geoState.country}</Text>
      <Text style={styles.lightText}>city: {data.item.city}</Text>
      <Text style={styles.lightText}>city distance {data.item.cityDistance}</Text>
      <Text style={styles.lightText}>road: {data.item.road}</Text>
      <Text style={styles.lightText}>chargerCount: {data.item.chargerCount}</Text>
    </TouchableOpacity>

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0c9" />
        </View>
      )
    }
    return (
      <SafeAreaView style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <View style={styles.container}>
          <FlatList
            data={this.state.dataSource}
            ItemSeparatorComponent={this.FlatListItemSeparator}
            renderItem={item => this.renderItem(item)}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list: {
    paddingVertical: 4,
    margin: 5,
    backgroundColor: "#fff"
  }
});