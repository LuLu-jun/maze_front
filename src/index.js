import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import Reducer from './redux/reducers';
import './index.css';

//ftp test -lulu

const store = createStore(Reducer);

ReactDOM.render(
    <CookiesProvider>
        <BrowserRouter>
            <Provider store={store}>
                <App/>
            </Provider>
        </BrowserRouter>
    </CookiesProvider>,
    document.getElementById('root')
);
registerServiceWorker();
