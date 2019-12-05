/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/
import { featureCollection, feature } from '@turf/turf';
import queryString from 'query-string';
import Leg from './routes/Leg';

export const initMap = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new Map(el));
};

const defaultRouteLineColor = '#3887be';
const activeRouteLineColor = '#ff0000';

export class Map {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.legs = [];
    this.userLocation = null;
    this.map = null;
    this.placeCache = {};
    this.markers = [];
    this.hasMapLoaded = false;

    this.categoryMarkers = {};
    this.taskLocationMarkers = {};

    this.init();
  }

  async init() {
    this.buildMap();
  }

  async updateCategoryNames(categoryNames) {
    this.legs.forEach(leg => {
      leg.updateAvailableCategoryNames(categoryNames);
    });
  }

  async addLegs(legsData) {
    const userLocation = await this.getUserLocationPromise();

    this.legs = legsData.map((legData, index) => {
      const previousLeg = this.legs[index - 1];
      let previousLegEndLocation = previousLeg ? previousLeg.endLocation : null;

      if (!previousLegEndLocation) {
        previousLegEndLocation = userLocation;
      }

      return new Leg(legData, previousLegEndLocation);
    });
  }

  async zoomIntoLeg(legIndex) {
    const leg = this.legs[legIndex];

    const startLocation = leg.startLocation;
    const endLocation = leg.endLocation;

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([startLocation.longitude, startLocation.latitude]);
    bounds.extend([endLocation.longitude, endLocation.latitude]);

    const legPlaceLocations = await leg.getLocationsForLegPlaces();

    legPlaceLocations.forEach(legPlaceLocation => {
      bounds.extend([legPlaceLocation.longitude, legPlaceLocation.latitude]);
    });

    this.map.fitBounds(bounds, {
      padding: 50,
    });

    this.legs.forEach(async thisLeg => {
      const lineLayerId = `routeline-active${leg.taskId}`;

      const map = await this.getMap();
      this.addRouteLineLayerToMap(leg.taskId);

      if (thisLeg === leg) {
        map.setPaintProperty(lineLayerId, 'line-color', activeRouteLineColor);
      }
      else {
        map.setPaintProperty(lineLayerId, 'line-color', defaultRouteLineColor);
      }
    });
  }

  async zoomIntoFinalLeg() {
    const fromLocation = this.legs[this.legs.length - 1].endLocation;
    const toLocation = await this.getUserLocationPromise();

    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([fromLocation.longitude, fromLocation.latitude]);
    bounds.extend([toLocation.longitude, toLocation.latitude]);

    this.map.fitBounds(bounds, {
      padding: 50,
    });
  }

  highlightCategoryMarker(categoryName) {
    const marker = this.categoryMarkers[categoryName];
    this.highlightMarker(marker);
  }

  highlightTaskLocationMarker(taskId) {
    const marker = this.taskLocationMarkers[taskId];
    this.highlightMarker(marker);
  }

  highlightMarker(marker) {
    this.removeActiveStateFromMarkers();

    const markerElImage = marker.getElement().querySelector('.js-marker-image');
    markerElImage.style.transform = 'scale(1.5)';
    markerElImage.classList.add('js-marker-active-image');
    console.log(marker);
    console.log(marker.lngLat.lat);
    this.map.fire('click', {latLng: marker.lngLat});
  }

  removeActiveStateFromMarkers() {
    const activeMarkers = document.querySelectorAll('.js-marker-active-image');
    activeMarkers.forEach(activeMarker => {
      activeMarker.classList.remove('js-marker-active-image');
      activeMarker.style.transform = '';
    });
  }

  getUserLocationPromise = () => {
    return new Promise((resolve, reject) => {
      if (this.userLocation) {
        return resolve(this.userLocation);
      }

      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };


        resolve(this.userLocation);
      }, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  async updateMap() {
    // User location
    const fallbackLocation = {
      latitude: -37.82394,
      longitude: 144.99125
    }; // Inspire 9
    // Mapbox GL display markers
    return this.updateMapWithLatestData();
  }

  removeAllMarkersFromMap() {
    this.markers.forEach(marker => {
      marker.remove();
    });

    this.markers = [];
  }

  generateIconMarkerEl(fontAwesomeIconName, color ='ff0000') {
    const markerWrapperEl = document.createElement('div');

    const imageEl = document.createElement('img');
    imageEl.classList.add('js-marker-image');
    imageEl.setAttribute('src', `https://cdn.mapmarker.io/api/v1/font-awesome/v5/pin?icon=${fontAwesomeIconName}&size=50&hoffset=0&voffset=-1&background=${color}`);
    markerWrapperEl.appendChild(imageEl);

    return markerWrapperEl;
  }

  async addUserMarkerToMap() {
    const userLocation = await this.getUserLocationPromise();

    const userMarker = new mapboxgl.Marker({
      color: 'red',
      element: this.generateIconMarkerEl('fa-user-solid')
    })
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .addTo(this.map);

    this.markers.push(userMarker);
  }

  addPlaceMarkersToMap() {
    this.legs.forEach(async (leg) => {
      const placeSearchResults = await leg.getPlaceSearchResults();

      placeSearchResults.forEach(placeSearchResult => {
        const markerPopup = new mapboxgl.Popup({
          offset: 25,
        }) // add popups
          .setHTML('<h3>' + placeSearchResult.name + '</h3><p>' + placeSearchResult.address + '</p>');

        const marker = new mapboxgl.Marker({
          element: this.generateIconMarkerEl('fa-circle'),
        })
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
        this.categoryMarkers[placeSearchResult.categoryName] = marker;
      });
    });
  }

  addLocationTaskMarkersToMap() {
    this.legs.forEach(leg => {
      const markerPopup = new mapboxgl.Popup({ offset: 25 }) // add popups
        .setHTML('<h3>' + leg.taskId + '</h3>');

        const marker = new mapboxgl.Marker({
           color: 'orange',
            element: this.generateIconMarkerEl('fa-calendar-check-solid')
        })
        .setLngLat([leg.endLocation.longitude, leg.endLocation.latitude])
        .setPopup(markerPopup)
        .addTo(this.map);

        this.markers.push(marker);
        this.taskLocationMarkers[leg.taskId] = marker;
    });
  }

  buildMap() {
    mapboxgl.accessToken = 'pk.eyJ1Ijoiby1tYXIwIiwiYSI6ImNrM2dzaWUyMTA1N2EzbGw5bmU2aTR0cHoifQ.K1SJ2f_lddAklOarADHODw';
    this.map = new mapboxgl.Map({
      container: this.el,
      style: 'mapbox://styles/o-mar0/ck3qr7fao06n41cnt6nhsinl8', // stylesheet location
      center: [144.99125, -37.82394], // starting position [lng, lat]
      zoom: 12,
    });
    this.map.on('load', () => {
      this.hasMapLoaded = true;
    });
  }

  addRouteLineLayerToMap(suffix) {
    const sourceName = `weekendPARouteLine${suffix}`;

    // If exists, leave it.
    if (this.map.getSource(sourceName)) {
      return;
    }

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
        'line-color': defaultRouteLineColor,
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

  async updateMapWithLatestData() {
    this.removeAllMarkersFromMap();
    this.addUserMarkerToMap();
    this.addLocationTaskMarkersToMap();
    this.addPlaceMarkersToMap();

    this.zoomOutToAllLegs();

    const legJourneyPromises = this.legs.map((leg, legIndex) => this.drawRouteForLeg(legIndex));
    //legJourneyPromises.push(this.getFinalJourney());

    await Promise.all(legJourneyPromises);
    return true;
  }

  async zoomOutToAllLegs() {
    const bounds = new mapboxgl.LngLatBounds();
    const userLocation = await this.getUserLocationPromise();

    bounds.extend([ userLocation.longitude, userLocation.latitude ]);
    this.legs.forEach(leg => bounds.extend([ leg.endLocation.longitude, leg.endLocation.latitude ]));

    const legPlaceLocations = await Promise.all(this.legs.map(leg => leg.getLocationsForLegPlaces()));

    legPlaceLocations.forEach(legPlaceLocationSet => {
      legPlaceLocationSet.forEach(legPlaceLocation => {
        bounds.extend([ legPlaceLocation.longitude, legPlaceLocation.latitude ]);
      });
    });

    this.map.fitBounds(bounds, { padding: 70, maxZoom: 15, duration: 0 });
  }

  async getFinalJourney() {
    // If the leg is the first leg, there is no last leg location so the user location is used. Otherwise use the end location of the last leg.
    const finalLeg = this.legs[this.legs.length - 1];
    const toLocation = await this.getUserLocationPromise();

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
      const map = await this.getMap();
      map.getSource(`weekendPARouteLinefinish`)
            .setData(routeGeoJSON);
    }
  }

  async getMap() {
    if (this.hasMapLoaded) {
      return this.map;
    }

    return new Promise((resolve) => {
      const mapInterval = setInterval(() => {
        if (this.hasMapLoaded) {
          clearInterval(mapInterval);
          resolve(this.map);
        }
      }, 500);
    });

  }

  async drawRouteForLeg(legIndex) {
    const leg = this.legs[legIndex];

    const optimizeResult = await leg.getOptimizedRoute();

    // Create a GeoJSON feature collection
    const routeGeoJSON = featureCollection([feature(optimizeResult.trips[0].geometry)]);


    console.log(`weekendPARouteLine${leg.taskId}`);
    // If there is no route provided, reset
    if (!optimizeResult.trips[0]) {
      throw new Error('no optimize result');
    } else {
      // This is hacky shit.
      const map = await this.getMap();
      this.addRouteLineLayerToMap(leg.taskId);
      map.getSource(`weekendPARouteLine${leg.taskId}`)
        .setData(routeGeoJSON);
    }
  }
}

