import { useState, useEffect, useCallback } from "react";
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

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    isLoading: false,
    error: null,
    walletType: null,
    pairingString: null,
  });

  const [hashconnect] = useState(() => new HashConnect(true)); // true for testnet

  // Check if HashPack is installed
  const isHashPackInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.hashconnect;
  }, []);

  // Initialize HashConnect
  const initHashConnect = useCallback(async () => {
    try {
      const appMetadata = {
        name: 'Hedera TipJar',
        description: 'A decentralized tipping dApp on Hedera',
        icon: 'https://hedera.com/logo.png',
      };

      const initData = await hashconnect.init(appMetadata, 'testnet', false);
      
      setWallet(prev => ({ 
        ...prev, 
        pairingString: initData.pairingString 
      }));

      // Listen for pairing events
      hashconnect.pairingEvent.once((pairingData) => {
        if (pairingData.accountIds && pairingData.accountIds.length > 0) {
          const accountId = pairingData.accountIds[0];
          setWallet({
            isConnected: true,
            accountId,
            isLoading: false,
            error: null,
            walletType: 'hashpack',
            pairingString: null,
          });

          toast({
            title: "Wallet Connected",
            description: `Connected to HashPack account ${accountId}`,
          });
        }
      });

      // Listen for extension found
      hashconnect.foundExtensionEvent.once(() => {
        hashconnect.connectToLocalWallet();
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize HashConnect";
      setWallet(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      
      toast({
        title: "Initialization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [hashconnect]);

  // Connect to HashPack
  const connectHashPack = useCallback(async () => {
    setWallet(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await initHashConnect();
      await hashconnect.connect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      setWallet(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [hashconnect, initHashConnect]);


  // Connect wallet
  const connectWallet = useCallback(async () => {
    await connectHashPack();
  }, [connectHashPack]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    hashconnect.clearConnectionsAndData();
    setWallet({
      isConnected: false,
      accountId: null,
      isLoading: false,
      error: null,
      walletType: null,
      pairingString: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, [hashconnect]);

  // Initialize HashConnect on mount
  useEffect(() => {
    initHashConnect();
  }, [initHashConnect]);


  return {
    ...wallet,
    connectWallet,
    connectHashPack,
    disconnect,
    isHashPackInstalled,
    hashconnect,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hashconnect?: any;
  }
}