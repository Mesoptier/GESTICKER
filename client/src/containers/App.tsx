import { History } from 'history';
import * as React from 'react';
import { SFC } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Store } from 'redux';

import App from '../components/App/App';
import { State } from '../redux/reducers';

export interface AppContainerProps {
    store: Store<State>;
    history: History;
}

const AppContainer: SFC<AppContainerProps> = ({ store, history }) => (
    <ReduxProvider store={store}>
        <ConnectedRouter store={store} history={history}>
            <App />
        </ConnectedRouter>
    </ReduxProvider>
);

export default AppContainer;
