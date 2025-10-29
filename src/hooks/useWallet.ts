import { useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

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

  // Check if HashPack is installed
  const isHashPackInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.hashconnect;
  }, []);

  // Connect to HashPack
  const connectHashPack = useCallback(async () => {
    setWallet(prev => ({ ...prev, isLoading: true, error: null }));
    
    toast({
      title: "HashConnect Integration Coming Soon",
      description: "HashPack wallet integration is being set up",
    });
    
    setWallet(prev => ({ ...prev, isLoading: false }));
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    await connectHashPack();
  }, [connectHashPack]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
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
  }, []);

  return {
    ...wallet,
    connectWallet,
    connectHashPack,
    disconnect,
    isHashPackInstalled,
    hashconnect: null, // Temporarily disabled
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hashconnect?: any;
  }
}