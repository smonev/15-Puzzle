import 'babel-core/polyfill';

import React from 'react';
import BoardView from './app/BoardView';

function onDeviceReady() {
  if (typeof window.deviceReadyFired !== 'undefined') {
    return;
  }
  window.deviceReadyFired = true;

  let injectTapEventPlugin = require('react-tap-event-plugin');
  injectTapEventPlugin();

  React.initializeTouchEvents(true);
  React.render(<BoardView />, document.getElementById('boardDiv'));
}

document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('DOMContentLoaded', function() {
  window.isMobileDevice = false;
  if ((document.URL.indexOf('http://') === -1) && (document.URL.indexOf('https://') === -1)) {
    window.isMobileDevice = true;
  }

  if ( !window.isMobileDevice ) {
    onDeviceReady();
  }
});

