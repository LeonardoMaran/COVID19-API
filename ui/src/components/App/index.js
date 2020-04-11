import App from './App';
import { withCookies } from 'react-cookie';
import { connect } from 'react-redux';
import { geolocated } from 'react-geolocated';
import { styled } from '../../styles';

import {
  fetchGeolocation,
  fetchSeriesList,
  selectTheme,
  fetchRegions,
  fetchDefaultSeries,
  toggleTheme
} from '../../actions';

const mapStateToProps = (state, own) => ({
    filters: state.filters,
    loading: state.loading,
    location: state.location,
    theme: state.theme,
    cookies: own.cookies
});

const mapStateToDispatch = dispatch => ({
  fetchGeolocation: () => dispatch(fetchGeolocation()),
  fetchSeriesList: () => dispatch(fetchSeriesList()),
  fetchRegions: () => dispatch(fetchRegions()),
  fetchDefaultSeries: () => dispatch(fetchDefaultSeries()),
  toggleTheme: cookies => dispatch(toggleTheme(cookies)),
  selectTheme: theme => dispatch(selectTheme(theme))
});

export default styled()(withCookies(connect(mapStateToProps, mapStateToDispatch)(geolocated()(App))));
