import {
  RECEIVE_SERIES,
  REQUEST_SERIES_BY_REGION_ID
} from '../actions/types';

export default (state = [], action) => {
    switch(action.type) {
        case RECEIVE_SERIES:
            return action.series.data.map(series => {
              return {
                regions: series.regions,
                data: Object.keys(series.data).sort().reduce((obj,key) => {
                  obj[key] = series.data[key];
                  return obj;
                }, {})
              };
            });
        // Clear data when a new region is requested.
        case REQUEST_SERIES_BY_REGION_ID:
            return [];
        default:
            return state;
    }
}
