import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Providers, MsalProvider} from '@microsoft/mgt';
import {Login} from '@microsoft/mgt-react';
import {Persona} from '@fluentui/react'
import { useGet } from './mgt';

Providers.globalProvider = new MsalProvider({clientId: 'a974dfa0-9f57-49b9-95db-90f04ce2111a', scopes: ["user.read"]})

function App() {

  const [me, meError, meLoading] = useGet('me');

  return (
    <div className="App">
      <Login />
      {me && <Persona text={me.displayName}></Persona>}
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);