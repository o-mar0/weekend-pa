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

  async init() {
    // Array of Location types
    const categoryNames = ["liquor_store", "supermarket", "hospital"];

    // User location
    const userLocation = {
      lat: -37.82394,
      lng: 144.99125
    }; // Inspire 9

    // Google places (closest) to user location.
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?parameters
    // - Parameters:
    // - key: API KEY (Wadee) (AIzaSyD1vAt8qefNigqN4soYJez4m4Z8J9RDYSk)
    // - location: userLocation
    // - radius: 5000
    // - rankby: 'distance'
    // - type: categoryNames[0]
    // Mapbox optimize.

    const placeResult = {

    };

    /*
      placeResult['liquor_store'] = {
        lat: 333333,
        lon: 333333,
      };
    */
    //place[0]

    const google = window.google;
    var service = new google.maps.places.PlacesService(this.el);

    const getPlaceSearchPromiseForCategoryName = async (categoryName) => {
      const placeSearchParmas = {
        key: "AIzaSyB_mO0b11UhsiOEwZP66gdPBb33sfWQWes",
        radius: "1000",
        rankby: "distance",
        location: userLocation,
        type: categoryName,
      };

      // const placeSearchQueryString = queryString.stringify(placeSearchParmas);
      // const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${placeSearchQueryString}`;

      return new Promise((resolve, reject) => {
        service.nearbySearch(placeSearchParmas, function(places, status) {
          if (places.length === 0) {
            resolve(null);
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
    }

    const placeSearchPromisesForCategoryNames = categoryNames.map((categoryName) => {
      return getPlaceSearchPromiseForCategoryName(categoryName);
    });

    const placeSearchResults = await Promise.all(placeSearchPromisesForCategoryNames);
    console.log(placeSearchResults);

    // categoryNames.forEach((categoryName) => {
    //   getPlaceForCategoryName(categoryName);
    // });

    // Mapbox GL display markers

  }

}

