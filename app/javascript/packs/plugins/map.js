/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';

export const initMap = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new Map(el));
};

export class Map {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.categoryNames = [];

    this.userLocation = null;

    this.placeCache = {};

    this.markers = [];

    this.init();
  }

  async init() {
    this.buildMap();
    this.initPlacesService();
  }

  updateCategoryNames(categoryNames) {
    this.categoryNames = categoryNames;
    this.updateMap();
  }

  getUserLocationPromise = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(function(position) {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  async getPlaceSearchResults() {
    const placeSearchPromisesForCategoryNames = this.categoryNames.map((categoryName) => {
      return this.getPlaceSearchPromiseForCategoryName(categoryName);
    });
    return Promise.all(placeSearchPromisesForCategoryNames);
  }

  async getPlaceSearchPromiseForCategoryName(categoryName) {
    if (this.placeCache[categoryName]) {
      return this.placeCache[categoryName];
    }

    const placeSearchParmas = {
      key: "AIzaSyB_mO0b11UhsiOEwZP66gdPBb33sfWQWes",
      radius: "1000",
      rankby: "distance",
      location: {
        lat: this.userLocation.latitude,
        lng: this.userLocation.longitude,
      },
      type: categoryName,
    };

    // const placeSearchQueryString = queryString.stringify(placeSearchParmas);
    // const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${placeSearchQueryString}`;

    const placeSearchPromise = new Promise((resolve, reject) => {
      this.placesService.nearbySearch(placeSearchParmas, function(places, status) {
        if (!places || places.length === 0) {
          resolve(null);
          return;
        }

        const closestPlace = places[0];
        const location = {
          name: closestPlace.name,
          address: closestPlace.vicinity,
          location: {
            latitude: closestPlace.geometry.location.lat(),
            longitude: closestPlace.geometry.location.lng(),
          },
          categoryName: categoryName,
        };

        resolve(location);
      });
    });

    this.placeCache[categoryName] = await placeSearchPromise;
    return this.placeCache[categoryName];
  }

  async updateMap() {
    // User location
    const fallbackLocation = {
      latitude: -37.82394,
      longitude: 144.99125
    }; // Inspire 9

    if (!this.userLocation) {
      this.userLocation = await this.getUserLocationPromise();
    }

    // Google places (closest) to user location.
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?parameters
    // - Parameters:
    // - key: API KEY (Wadee) (AIzaSyD1vAt8qefNigqN4soYJez4m4Z8J9RDYSk)
    // - location: userLocation
    // - radius: 5000
    // - rankby: 'distance'
    // - type: categoryNames[0]
    // Mapbox optimize.

    const placeSearchResults = await this.getPlaceSearchResults();
    console.log(placeSearchResults);
    // categoryNames.forEach((categoryName) => {
    //   getPlaceForCategoryName(categoryName);
    // });

    // Mapbox GL display markers
    this.updateMapWithLatestData(this.userLocation, placeSearchResults.filter(x => x));
  }

  removeAllMarkersFromMap() {
    this.markers.forEach(marker => {
      marker.remove();
    });

    this.markers = [];
  }

  addUserMarkerToMap(userLocation) {
    const userMarker = new mapboxgl.Marker({
      color: 'red',
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(this.map);

    this.markers.push(userMarker);
  }

  addPlaceMarkersToMap(placeSearchResults) {
    placeSearchResults.forEach(placeSearchResult => {
      const markerPopup = new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + placeSearchResult.categoryName + '</h3><p>' + placeSearchResult.name + '</p>');

      const marker = new mapboxgl.Marker()
        .setLngLat([placeSearchResult.location.longitude, placeSearchResult.location.latitude])
        .setPopup(markerPopup)
        .addTo(this.map);

      // // DEBUGGING - to see which is which
      // new mapboxgl.Popup()
      //   .setLngLat([placeSearchResult.location.longitude, placeSearchResult.location.latitude])
      //   .setHTML(`${placeSearchResult.categoryName}: ${placeSearchResult.name}`)
      //   .setMaxWidth("300px")
      //   .addTo(this.map);

      this.markers.push(marker);
    });
  }

  buildMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiby1tYXIwIiwiYSI6ImNrM2dzaWUyMTA1N2EzbGw5bmU2aTR0cHoifQ.K1SJ2f_lddAklOarADHODw';
    this.map = new mapboxgl.Map({
      container: this.el,
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [144.99125, -37.82394], // starting position [lng, lat]
      zoom: 12,
    });
    this.map.on('load', () => {
      this.addRouteLineLayerToMap();
    });
  }

  initPlacesService() {
    const google = window.google;
    const googleMapEl = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(googleMapEl);
  }

  addRouteLineLayerToMap() {
    this.map.addSource('weekendPARouteLine', {
      type: 'geojson',
      data: null,
    });
    this.map.addLayer({
      id: 'routeline-active',
      type: 'line',
      source: 'weekendPARouteLine',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': [
          "interpolate",
          ["linear"],
          ["zoom"],
          12, 3,
          22, 12
        ]
      }
    }, 'waterway-label');

    this.map.addLayer({
      id: 'routearrows',
      type: 'symbol',
      source: 'weekendPARouteLine',
      layout: {
        'symbol-placement': 'line',
        'text-field': '▶',
        'text-size': [
          "interpolate",
          ["linear"],
          ["zoom"],
          12, 24,
          22, 60
        ],
        'symbol-spacing': [
          "interpolate",
          ["linear"],
          ["zoom"],
          12, 30,
          22, 160
        ],
        'text-keep-upright': false
      },
      paint: {
        'text-color': '#3887be',
        'text-halo-color': 'hsl(55, 11%, 96%)',
        'text-halo-width': 3
      }
    }, 'waterway-label');
  }

  updateMapWithLatestData(userLocation, placeSearchResults) {
    this.removeAllMarkersFromMap();
    this.addUserMarkerToMap(userLocation);
    this.addPlaceMarkersToMap(placeSearchResults);

    if (placeSearchResults.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      placeSearchResults.forEach(placeSearchResult => bounds.extend([ placeSearchResult.location.longitude, placeSearchResult.location.latitude ]));
      this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });

      this.getOptimizedRouteBetweenPlaces(userLocation, placeSearchResults);
    }
  }

  async getOptimizedRouteBetweenPlaces(userLocation, placeSearchResults) {
    // Store the location of the truck in a variable called coordinates
      const coordinates = placeSearchResults.map(placeSearchResult => {
        return `${placeSearchResult.location.longitude},${placeSearchResult.location.latitude}`;
      }).slice(0, 11);

      coordinates.unshift(`${userLocation.longitude},${userLocation.latitude}`);

      // Set the profile to `driving`
      // Coordinates will include the current location of the truck,
      const optimizeUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(';')}?overview=full&steps=true&geometries=geojson&source=first&access_token=${mapboxgl.accessToken}`;
      const optimizeResult = await fetch(optimizeUrl).then(response => response.json());

      // Create a GeoJSON feature collection
      var routeGeoJSON = featureCollection([feature(optimizeResult.trips[0].geometry)]);

      // If there is no route provided, reset
      if (!optimizeResult.trips[0]) {
          alert('no optimize result');
      } else {
        // Update the `route` source by getting the route source
        // and setting the data equal to routeGeoJSON
        this.map.getSource('weekendPARouteLine')
          .setData(routeGeoJSON);
      }
  }

}

