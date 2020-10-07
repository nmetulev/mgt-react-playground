import { useEffect, useState } from 'react';
import {Providers, ProviderState} from '@microsoft/mgt';

export function useSignedIn() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = () => {
      let provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();
  }, []);

  return isSignedIn;
}

export function useGet(resource: string) {
  const [response, setResponse] = useState<any>();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const isSignedIn = useSignedIn();

  useEffect(() => {
    if (isSignedIn) {
      (async () => {
        try {
          setResponse(
            await Providers.globalProvider.graph.client.api(resource).get()
          );
        } catch (e) {
          setError(e);
        }
        setLoading(false);
      })();
    }
  }, [isSignedIn]);

  return [response, error, loading];
}
