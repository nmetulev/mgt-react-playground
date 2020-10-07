import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {Providers, ProviderState, MsalProvider} from '@microsoft/mgt';
import {Login, Person} from '@microsoft/mgt-react';

import {ProgressIndicator} from '@fluentui/react'

Providers.globalProvider = new MsalProvider({clientId: 'a974dfa0-9f57-49b9-95db-90f04ce2111a', scopes: ["user.read", "user.readbasic.all"]})

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
  const [response, setResponse] = useState();
  const [error, setError] = useState();
  const isSignedIn = useSignedIn();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        try {
          setResponse(await Providers.globalProvider.graph.client.api(resource).get());
        } catch (e) {
          setError(e);
        }
      })();
    }
  }, [isSignedIn])

  return [response, error];
}

function App() {

  // let [me, setMe] = useState<microsoftgraph.User>();
  const isSignedIn = useSignedIn();
  const [me] = useGet('me');

  // let [me, meError] = useGraphState('/me');

  // useEffect(() => {
  //   if (isSignedIn) {
  //     (async () => {
  //       let user = await Providers.globalProvider.graph.client.api('/me').get();
  //       setMe(user);
  //     })();
  //   }
  // }, [isSignedIn])


  return (
    <div className="App">
      <Login />
      <Person personDetails={me} fetchImage></Person>
      <ProgressIndicator></ProgressIndicator>
    </div>
  );
}



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);