import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    address: null,
    isLoading: false,
    error: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask;
  }, []);

  // Connect to MetaMask
  const connectMetaMask = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      const error = "MetaMask is not installed. Please install MetaMask to continue.";
      setWallet(prev => ({ ...prev, error }));
      toast({
        title: "MetaMask Required",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setWallet(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        // For demo purposes, we'll generate a mock Hedera account ID
        // In a real implementation, you'd have a mapping or derive it properly
        const mockAccountId = `0.0.${Math.floor(Math.random() * 1000000) + 100000}`;

        setWallet({
          isConnected: true,
          accountId: mockAccountId,
          address,
          isLoading: false,
          error: null,
        });

        toast({
          title: "Wallet Connected",
          description: `Connected to account ${mockAccountId}`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      setWallet({
        isConnected: false,
        accountId: null,
        address: null,
        isLoading: false,
        error: errorMessage,
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isMetaMaskInstalled]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      accountId: null,
      address: null,
      isLoading: false,
      error: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length > 0) {
            const address = accounts[0];
            const mockAccountId = `0.0.${Math.floor(Math.random() * 1000000) + 100000}`;

            setWallet({
              isConnected: true,
              accountId: mockAccountId,
              address,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          console.error("Failed to check wallet connection:", error);
        }
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled]);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskInstalled()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== wallet.address) {
          // Account changed, reconnect
          connectMetaMask();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, [wallet.address, connectMetaMask, disconnect, isMetaMaskInstalled]);

  return {
    ...wallet,
    connectMetaMask,
    disconnect,
    isMetaMaskInstalled,
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}