import "./styles.css";

// Array of Location types
const locationTypes = ["liquor_store", "supermarket", "hospital"];

// User location
const userLocation = {
  lat: -37.82394,
  lng: 144.99125
}; // Inspire 9

const defaultPlacesQueryParams = {
  key: "",
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

const google = window.google;
var service = new google.maps.places.PlacesService(
  document.getElementById("map")
);

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
    });
  } catch (e) {
    // console.log(e);
  }
});

// Mapbox GL display markers

document.getElementById("app").innerHTML = `
<h1>Hello Vanilla!</h1>
<div>
  We use Parcel to bundle this sandbox, you can find more info about Parcel
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
`;
