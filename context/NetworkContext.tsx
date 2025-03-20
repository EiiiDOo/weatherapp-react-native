import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import * as Network from "expo-network";

// Define the type for the context value
type NetworkContextType = boolean | null;

// Create the context with the defined type
const NetworkContext = createContext<NetworkContextType>(null);

// Define the type for the provider's props
interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isConnected, setIsConnected] = useState<NetworkContextType>(null);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      const networkState = await Network.getNetworkStateAsync();
      setIsConnected(networkState.isConnected ?? false);
    };

    checkNetworkStatus();

    // Optionally, set up a polling mechanism or use a library
    // to listen for network changes if needed.
  }, []);

  return (
    <NetworkContext.Provider value={isConnected}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkConnection = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error(
      "useNetworkConnection must be used within a NetworkProvider"
    );
  }
  return context;
};
