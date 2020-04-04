import * as Actions from './types';
import { selectRegion, selectSubregion, fetchRegion } from './RegionActions';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const DEFAULT_LOCATION = "United States";

export const setDefaultLocation = name => ({type: Actions.SET_DEFAULT_LOCATION, name})
export const geolocationError = error => ({ type: Actions.ERROR_GEOLOCATION, error})
export const requestGeocoding = () => ({ type: Actions.REQUEST_GEOCODING })
export const receiveGeocoding = components => ({ type: Actions.RECEIVE_GEOCODING, components })

export const requestGeolocation = () => ({ type: Actions.REQUEST_GEOLOCATION })
export const receiveGeolocation = coords => ({  type: Actions.RECEIVE_GEOLOCATION, coords })

export const fetchGeolocation = () => {
    return (dispatch, getState) => {
      dispatch(requestGeolocation());

      if (!navigator.geolocation) {
        dispatch(geolocationError("Geolocation unavailable"));
        return;
      }

      return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition((pos) => {
          Promise.all([
            dispatch(receiveGeolocation(pos.coords)),
            dispatch(fetchGeocoding(pos.coords))
          ]).then(resolve)
        }, (err) => {
          dispatch(geolocationError(err));

          // Load a default region if possible.
          const { regions } = getState();
          const region = regions.all.find(r => r.name === DEFAULT_LOCATION);
          if (region) {
            Promise.all([
              dispatch(selectRegion(region.id)),
              dispatch(fetchRegion(region.id))
            ]).then(resolve);
          } else {
            resolve();
          }
        },
        {timeout: 10000});
      });
    }
}

export const fetchGeocoding = coords => {
    return (dispatch, getState) => {
        dispatch(requestGeocoding());
        return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&sensor=false&key=${GOOGLE_API_KEY}`)
            .then(response => response.json())
            .then(json => {
              dispatch(receiveGeocoding(json.results));
              let region = getState().location.region;
              let matchingRegion = getState().regions.all.find(r => r.name === region.long_name || r.name === region.short_name);

              if (matchingRegion) {
                dispatch(selectRegion(matchingRegion.id));
                // Attempt to fetch the municipalities for the region.
                return dispatch(fetchRegion(matchingRegion.id));
              }
            })
            .then(result => {
              if (!result) {
                return;
              }

              // Attempt to match the municipality to the user's municipality
              let municipality = getState().location.municipality;
              let matchingMunicipality = getState().regions.current.subregions.find(m => m.name === municipality.long_name || m.name === municipality.short_name);

              if (matchingMunicipality) {
                dispatch(selectSubregion(matchingMunicipality.id));
              }
            });
    }
}
