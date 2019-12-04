/*
legData is in this format:
{
  taskId,
  endLocation: {
    latitude,
    longitude,
  },
  categories: Array.from(categoryEls).map(categoryEl => categoryEl.value),
}
*/
import queryString from 'query-string';

export default class Leg {
  constructor(legData, startLocation) {
    this.taskId = legData.taskId;

    this.startLocation = startLocation;
    this.endLocation = legData.endLocation;

    this.categoryNames = legData.categories;
    this.selectedCategoryNames = [];

    this.placeCache = {};
    this.placesService = null;

    this.initPlacesService();
  }

  initPlacesService() {
    const google = window.google;
    const googleMapEl = document.createElement('div');
    this.placesService = new google.maps.places.PlacesService(googleMapEl);
  }

  updateAvailableCategoryNames(categoryNames) {
    this.selectedCategoryNames = categoryNames;
  }

  async fetchRouteForLeg() {
    const placeSearchResults = await this.getPlaceSearchResults();

    return this.getOptimizedRoute();
  }

  async getLocationsForLegPlaces() {
    const legPlaceSearchResults = await this.getPlaceSearchResults();

    return legPlaceSearchResults
      .map(legPlace => legPlace.location);
  }

  async getPlaceSearchResults() {
    const placeSearchPromisesForCategoryNames = this.categoryNames.filter(categoryName => {
      return this.selectedCategoryNames.includes(categoryName);
    }).map((categoryName) => {
      return this.getPlaceSearchPromiseForCategoryName(categoryName);
    });
    const placeSearchResults = await Promise.all(placeSearchPromisesForCategoryNames);

    return placeSearchResults.filter(legPlace => legPlace);
  }

  async getPlaceSearchPromiseForCategoryName(categoryName) {
    if (this.placeCache[categoryName]) {
      return this.placeCache[categoryName];
    }

    const startLocation = this.startLocation;
    const endLocation = this.endLocation;

    const midPoint = {
      latitude: ((endLocation.latitude - startLocation.latitude) / 2) + startLocation.latitude,
      longitude: ((endLocation.longitude - startLocation.longitude) / 2) + startLocation.longitude,
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

  async getOptimizedRoute() {
    return new Promise(async (resolve, reject) => {
      // If the leg is the first leg, there is no last leg location so the user location is used. Otherwise use the end location of the last leg.
      const startLocation = this.startLocation;
      const endLocation = this.endLocation;

      const coordinates = [];
      coordinates.push(`${startLocation.longitude},${startLocation.latitude}`);

      const activeCategoriesForLeg = this.categoryNames;

      const placesAlongTheWay = await this.getPlaceSearchResults();

      placesAlongTheWay.forEach(place => {
        coordinates.push(`${place.location.longitude},${place.location.latitude}`);
      });

      coordinates.push(`${endLocation.longitude},${endLocation.latitude}`);

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

      resolve(optimizeResult);
    });
  }
}
