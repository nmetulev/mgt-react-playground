import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Providers, ProviderState, MsalProvider} from '@microsoft/mgt';
import {Login} from '@microsoft/mgt-react';

import {Persona} from '@fluentui/react'

Providers.globalProvider = new MsalProvider({clientId: 'a974dfa0-9f57-49b9-95db-90f04ce2111a', scopes: ["user.read"]})

function useSignedIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = () => {
      let provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };
    
    Providers.onProviderUpdated(updateState);
    updateState();
  }, [])

  return isSignedIn;
}

function useGet(resource: string) {
  const [response, setResponse] = useState<any>();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const isSignedIn = useSignedIn();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        try {
          setResponse(await Providers.globalProvider.graph.client.api(resource).get());
        } catch (e) {
          setError(e);
        }
        setLoading(false);
      })();
    }
  }, [isSignedIn])

  return [response, error, loading];
}

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