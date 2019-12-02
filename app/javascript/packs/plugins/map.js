/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';
import queryString from 'query-string';

export const initMap = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new Map(el));
};

export class Map {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.legs = [];
    this.selectedCategoryNames = [];
    this.userLocation = null;
    this.map = null;
    this.placeCache = {};
    this.markers = [];
    this.hasMapLoaded = false;

    this.init();
  }

  async init() {
    this.buildMap();
    this.initPlacesService();
  }

  async updateCategoryNames(categoryNames) {
    this.selectedCategoryNames = categoryNames;
    return this.updateMap();
  }

  async addLegs(legs) {
    /*
    return {
      taskId,
      location: {
        latitude,
        longitude,
      },
      categories: Array.from(categoryEls).map(categoryEl => categoryEl.value),
    };
    */
    this.legs = legs;
  }

  async zoomIntoJourney(journeyIndex) {
    // Map must be set up for this to work.
    const fromMarker = this.markers[journeyIndex];
    const toMaker = this.markers.length === journeyIndex + 1 ? this.markers[0] : this.markers[journeyIndex + 1];

    this.map.fitBounds([fromMarker.getLngLat(), toMaker.getLngLat()], {
      padding: 50,
    });
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
    const placeSearchPromisesForCategoryNames = this.selectedCategoryNames.map((categoryName) => {
      return this.getPlaceSearchPromiseForCategoryName(categoryName);
    });
    return Promise.all(placeSearchPromisesForCategoryNames);
  }

  async getPlaceSearchPromiseForCategoryName(categoryName) {
    if (this.placeCache[categoryName]) {
      return this.placeCache[categoryName];
    }

    const leg = this.legs.find(leg => {
      return leg.categories.includes(categoryName);
    });

    const legIndex = this.legs.indexOf(leg);
    const previousLegEndLocation = legIndex === 0 ? this.userLocation : this.legs[legIndex - 1].endLocation;

    const midPoint = {
      latitude: ((leg.endLocation.latitude - previousLegEndLocation.latitude) / 2) + previousLegEndLocation.latitude,
      longitude: ((leg.endLocation.longitude - previousLegEndLocation.longitude) / 2) + previousLegEndLocation.longitude,
    }

    const placeSearchParmas = {
      key: "AIzaSyB_mO0b11UhsiOEwZP66gdPBb33sfWQWes",
      radius: "1000",
      rankby: "distance",
      location: {
        lat: midPoint.latitude,
        lng: midPoint.longitude,
      },
      type: categoryName,
    };

    console.log(placeSearchParmas);

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

    // Mapbox GL display markers
    return this.updateMapWithLatestData(this.userLocation, placeSearchResults.filter(x => x));
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

  addLocationTaskMarkersToMap() {
    this.legs.forEach(leg => {
      const markerPopup = new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + leg.id + '</h3>');

        const marker = new mapboxgl.Marker({
           color: 'orange',
        })
        .setLngLat([leg.endLocation.longitude, leg.endLocation.latitude])
        .setPopup(markerPopup)
        .addTo(this.map);

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
      this.hasMapLoaded = true;
      this.addRouteLineLayersToMap();
    });
  }

  initPlacesService() {
    const google = window.google;
    const googleMapEl = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(googleMapEl);
  }

  addRouteLineLayerToMap(suffix) {
    const sourceName = `weekendPARouteLine${suffix}`;

    this.map.addSource(sourceName, {
      type: 'geojson',
      data: null,
    });
    this.map.addLayer({
      id: `routeline-active${suffix}`,
      type: 'line',
      source: sourceName,
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
      id: `routearrows${suffix}`,
      type: 'symbol',
      source: sourceName,
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

  addRouteLineLayersToMap() {
    this.legs.forEach(leg => {
      this.addRouteLineLayerToMap(leg.taskId);
    });
    this.addRouteLineLayerToMap('finish');
  }

  async updateMapWithLatestData(userLocation, placeSearchResults) {
    this.removeAllMarkersFromMap();
    this.addUserMarkerToMap(userLocation);
    this.addLocationTaskMarkersToMap();
    this.addPlaceMarkersToMap(placeSearchResults);

    if (placeSearchResults.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      placeSearchResults.forEach(placeSearchResult => bounds.extend([ placeSearchResult.location.longitude, placeSearchResult.location.latitude ]));
      this.legs.forEach(leg => bounds.extend([ leg.endLocation.longitude, leg.endLocation.latitude ]));
      bounds.extend([ userLocation.longitude, userLocation.latitude ])
      this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });

      const legJourneyPromises = this.legs.map((leg, legIndex) => this.getOptimizedRouteForLeg(userLocation, legIndex));
      legJourneyPromises.push(this.getFinalJourney());

      return Promise.all(legJourneyPromises);
    }

    return false;
  }

  async getFinalJourney() {
    // If the leg is the first leg, there is no last leg location so the user location is used. Otherwise use the end location of the last leg.
    const finalLeg = this.legs[this.legs.length - 1];
    const toLocation = this.userLocation;

    const coordinates = [];
    coordinates.push(`${finalLeg.endLocation.longitude},${finalLeg.endLocation.latitude}`);
    coordinates.push(`${toLocation.longitude},${toLocation.latitude}`);

    // Set the profile to `driving`
    // Coordinates will include the current location of the truck,
    const params = {
      overview: 'full',
      steps: 'true',
      geometries: 'geojson',
      source: 'first',
      destination: 'last',
      roundtrip: 'false',
      access_token: mapboxgl.accessToken,
    };
    const optimizeUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(';')}?${queryString.stringify(params)}`;
    const optimizeResult = await fetch(optimizeUrl).then(response => response.json());

    // Create a GeoJSON feature collection
    var routeGeoJSON = featureCollection([feature(optimizeResult.trips[0].geometry)]);

    // If there is no route provided, reset
    if (!optimizeResult.trips[0]) {
      throw new Error('no optimize result');
    } else {
      setTimeout(() => {
          this.map.getSource(`weekendPARouteLinefinish`)
            .setData(routeGeoJSON);
        }, this.hasMapLoaded ? 0 : 5000);
    }
  }

  async getOptimizedRouteForLeg(userLocation, legIndex) {
    return new Promise(async (resolve, reject) => {
      // Store the location of the truck in a variable called coordinates
      // const coordinates = placeSearchResults.map(placeSearchResult => {
      //   return `${placeSearchResult.location.longitude},${placeSearchResult.location.latitude}`;
      // }).slice(0, 11);
      const thisLeg = this.legs[legIndex];

      // If the leg is the first leg, there is no last leg location so the user location is used. Otherwise use the end location of the last leg.
      const fromLocation = legIndex === 0 ? userLocation : this.legs[legIndex - 1].endLocation;
      const toLocation = thisLeg.endLocation;

      const coordinates = [];
      coordinates.push(`${fromLocation.longitude},${fromLocation.latitude}`);

      // Inject the category places.
      const activeCategoriesForLeg = thisLeg.categories.filter(categoryName => {
        return this.selectedCategoryNames.includes(categoryName);
      });
      const placesAlongTheWay = await Promise.all(activeCategoriesForLeg.map(category =>
          this.getPlaceSearchPromiseForCategoryName(category)));

      placesAlongTheWay.forEach(place => {
        coordinates.push(`${place.location.longitude},${place.location.latitude}`);
      });

      coordinates.push(`${toLocation.longitude},${toLocation.latitude}`);

      // const coordinates = this.legs.map(leg => `${leg.endLocation.longitude},${leg.endLocation.latitude}`);

      // coordinates.unshift(`${userLocation.longitude},${userLocation.latitude}`);

      // Set the profile to `driving`
      // Coordinates will include the current location of the truck,
      const params = {
        overview: 'full',
        steps: 'true',
        geometries: 'geojson',
        source: 'first',
        destination: 'last',
        roundtrip: 'false',
        access_token: mapboxgl.accessToken,
      };
      const optimizeUrl = `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates.join(';')}?${queryString.stringify(params)}`;
      const optimizeResult = await fetch(optimizeUrl).then(response => response.json());

      // Create a GeoJSON feature collection
      var routeGeoJSON = featureCollection([feature(optimizeResult.trips[0].geometry)]);

      // If there is no route provided, reset
      if (!optimizeResult.trips[0]) {
        reject('no optimize result');
      } else {
        setTimeout(() => {
            resolve(true);
            this.map.getSource(`weekendPARouteLine${thisLeg.taskId}`)
              .setData(routeGeoJSON);
          }, this.hasMapLoaded ? 0 : 5000);
      }
    });
  }
}

