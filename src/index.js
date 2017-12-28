import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';

import reactTimeAgo from 'react-time-ago'
import javascriptTimeAgo from 'javascript-time-ago'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
javascriptTimeAgo.locale(require('javascript-time-ago/locales/en'))
javascriptTimeAgo.locale(require('javascript-time-ago/locales/ru'))
require('javascript-time-ago/intl-messageformat-global')
require('intl-messageformat/dist/locale-data/en')
require('intl-messageformat/dist/locale-data/ru')


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
