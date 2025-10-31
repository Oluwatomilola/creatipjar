import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { HashConnect } from "@hashgraph/hashconnect";

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  isLoading: boolean;
  error: string | null;
  walletType: 'hashpack' | null;
  pairingString: string | null;
}

const appMetadata = {
  name: "CreatipJar",
  description: "Send HBAR tips instantly on Hedera",
  icon: "https://absolute.url/to/icon.png",
  url: window.location.origin,
};

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    isLoading: false,
    error: null,
    walletType: null,
    pairingString: null,
  });
  
  const hashconnectRef = useRef<HashConnect | null>(null);
  const initDataRef = useRef<any>(null);

  // Initialize HashConnect
  useEffect(() => {
    const initHashConnect = async () => {
      try {
        const hashconnect = new HashConnect(true); // Enable debug mode
        hashconnectRef.current = hashconnect;

        // Listen for HashPack extension being found
        hashconnect.foundExtensionEvent.once((walletMetadata) => {
          console.log("Found extension:", walletMetadata);
          toast({
            title: "HashPack Detected",
            description: "HashPack wallet extension is installed",
          });
        });

        // Set up pairing event listener
        hashconnect.pairingEvent.once((pairingData) => {
          console.log("Pairing event:", pairingData);
          if (pairingData.accountIds && pairingData.accountIds.length > 0) {
            setWallet(prev => ({
              ...prev,
              isConnected: true,
              accountId: pairingData.accountIds[0],
              walletType: 'hashpack',
              isLoading: false,
              pairingString: null,
            }));

            toast({
              title: "Wallet Connected!",
              description: `Connected to ${pairingData.accountIds[0]}`,
            });
          }
        });

        // Initialize with testnet
        const initData = await hashconnect.init(appMetadata, "testnet", false);
        initDataRef.current = initData;
        
        console.log("HashConnect initialized:", initData);
        
        // Set pairing string
        if (initData.pairingString) {
          setWallet(prev => ({
            ...prev,
            pairingString: initData.pairingString,
          }));
        }

        // Check for existing pairings
        if (initData.savedPairings && initData.savedPairings.length > 0) {
          const pairing = initData.savedPairings[0];
          if (pairing.accountIds && pairing.accountIds.length > 0) {
            setWallet(prev => ({
              ...prev,
              isConnected: true,
              accountId: pairing.accountIds[0],
              walletType: 'hashpack',
            }));
          }
        }
      } catch (error) {
        console.error("Failed to initialize HashConnect:", error);
        toast({
          title: "Initialization Error",
          description: "Failed to initialize wallet connection",
          variant: "destructive",
        });
      }
    };

    initHashConnect();
  }, []);

  // Check if HashPack is installed
  const isHashPackInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.hashconnect;
  }, []);

  // Connect to HashPack
  const connectHashPack = useCallback(async () => {
    if (!hashconnectRef.current) {
      toast({
        title: "Error",
        description: "HashConnect not initialized",
        variant: "destructive",
      });
      return;
    }

    setWallet(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // v2 API: connectToLocalWallet() opens the HashPack extension for pairing
      await hashconnectRef.current.connectToLocalWallet();
      
      toast({
        title: "Opening HashPack",
        description: "Please approve the connection in your HashPack wallet extension",
      });
      
      setWallet(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      console.error("Failed to connect:", error);
      setWallet(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "Failed to connect wallet",
      }));

      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to HashPack. Make sure HashPack extension is installed.",
        variant: "destructive",
      });
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    await connectHashPack();
  }, [connectHashPack]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    if (hashconnectRef.current && initDataRef.current) {
      const topic = initDataRef.current.topic;
      if (topic) {
        hashconnectRef.current.disconnect(topic);
      }
    }
    
    setWallet({
      isConnected: false,
      accountId: null,
      isLoading: false,
      error: null,
      walletType: null,
      pairingString: initDataRef.current?.pairingString || null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, []);

  return {
    ...wallet,
    connectWallet,
    connectHashPack,
    disconnect,
    isHashPackInstalled,
    hashconnect: hashconnectRef.current,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hashconnect?: any;
  }
}