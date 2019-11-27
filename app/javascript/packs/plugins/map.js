/*
  Example safe-executing JS script for Lewagon.
  packs/plugins/myPlugin.js
*/

export const initMap = (selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  return elements.map(el => new MyPlugin(el));
};

class MyPlugin {
  // Keep the constructor lean, don't add anything more to this.
  constructor(el) {
    this.el = el;

    this.init();
  }

  init() {
    // Array of Location types
    const locationTypes = ["liquor_store", "supermarket", "hospital"];

    // User location
    const userLocation = {
      lat: -37.82394,
      lng: 144.99125
    }; // Inspire 9

    const defaultPlacesQueryParams = {
      key: "AIzaSyD1vAt8qefNigqN4soYJez4m4Z8J9RDYSk",
      radius: "1000",
      rankby: "distance",
      location: userLocation
    };
    // Google places (closest) to user location.
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?parameters
    // - Parameters:
    // - key: API KEY (Wadee) (AIzaSyD1vAt8qefNigqN4soYJez4m4Z8J9RDYSk)
    // - location: userLocation
    // - radius: 5000
    // - rankby: 'distance'
    // - type: locationTypes[0]
    // Mapbox optimize.

    const placeResult = {

    };

    /*
      placeResult['liquor_store'] = {
        lat: 333333,
        lon: 333333,
      };
    */
    place[0]

    const google = window.google;
    var service = new google.maps.places.PlacesService(this.el);

    locationTypes.forEach(async locationType => {
      const placeSearchParmas = {
        ...defaultPlacesQueryParams,
        type: locationType
      };

      // const placeSearchQueryString = queryString.stringify(placeSearchParmas);
      // const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${placeSearchQueryString}`;

      try {
        service.nearbySearch(placeSearchParmas, function(place, status) {
          console.log(place[0], locationType);
          placeResult['liquor_store'] = {
          lat: 333333,
          lon: 333333,
      };
        });
      } catch (e) {
        console.error(e.message);
      }

    });

    // Mapbox GL display markers

  }

}

