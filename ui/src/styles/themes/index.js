import { createMuiTheme } from '@material-ui/core/styles';

import blueGrey from '@material-ui/core/colors/blueGrey';
import orange from '@material-ui/core/colors/orange';
import grey from '@material-ui/core/colors/grey';

const lightBase = createMuiTheme({palette: { type: 'light'}});
const darkBase = createMuiTheme({palette: {type: 'dark'}});

export const light = createMuiTheme(lightBase, {
  palette: {
    type: 'light',
    primary: {
      main: blueGrey[600],
    },
    secondary: {
      main: orange[400]
    },
    nivo: {
      heatmap: {
        colors: {
          emptyColor: lightBase.palette.background.default,
          spectrum: [
            '#66c2a5',
            '#3977b4',
            '#fcff99',
            '#f5c086',
            '#d9241e'
          ]
        }
      },
      line: {
        colors: 'category10',
        text: 'black'
      },
      calendar: {
        // category10 colors
        colors: [
          '#66c2a5',
          '#fcff99',
          '#f5c086',
          '#d9241e'
        ],
        dayBorderColor: grey[300],
        monthBorderColor: grey[300],
        emptyColor: lightBase.palette.background.default,
        text: lightBase.palette.text.primary
      }
    }
  }
});


export const dark = createMuiTheme(darkBase, {
  palette: {
    type: 'dark',
    primary: {
      main: blueGrey[800],
      linkText: '#8dd3c7'
    },
    secondary: {
      main: orange[600]
    },
    nivo: {
      heatmap: {
        colors: {
          emptyColor: darkBase.palette.background.default,
          spectrum: [
            '#66c2a5',
            '#8dd3c7',
            '#fcffb3',
            '#f3b462',
            '#f08072'
          ]
        }
      },
      line: {
        colors: 'set3',
        text: 'white'
      },
      calendar: {
        // set3 colors
        colors: [
          '#8dd3c7',
          '#fcffb3',
          '#f3b462',
          '#f08072'
        ],
        dayBorderColor: grey[600],
        monthBorderColor: grey[600],
        emptyColor: darkBase.palette.background.default,
        text: darkBase.palette.text.primary
      }
    }
  }
});
