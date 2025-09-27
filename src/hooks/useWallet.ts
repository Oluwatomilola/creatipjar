import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

export interface WalletState {
  isConnected: boolean;
  accountId: string | null;
  address: string | null;
  isLoading: boolean;
  error: string | null;
  walletType: 'metamask' | 'hashpack' | null;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    accountId: null,
    address: null,
    isLoading: false,
    error: null,
    walletType: null,
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.ethereum && window.ethereum.isMetaMask;
  }, []);

  // Check if HashPack is installed
  const isHashPackInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.hashpack;
  }, []);

  // Connect to HashPack
  const connectHashPack = useCallback(async () => {
    if (!isHashPackInstalled()) {
      const error = "HashPack is not installed. Please install HashPack to continue.";
      setWallet(prev => ({ ...prev, error }));
      toast({
        title: "HashPack Required",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setWallet(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await window.hashpack.connectToLocalWallet();
      
      if (response.success && response.data && response.data.accountIds.length > 0) {
        const accountId = response.data.accountIds[0];
        
        setWallet({
          isConnected: true,
          accountId,
          address: null, // HashPack uses account IDs, not addresses
          isLoading: false,
          error: null,
          walletType: 'hashpack',
        });

        toast({
          title: "Wallet Connected",
          description: `Connected to HashPack account ${accountId}`,
        });
      } else {
        throw new Error("Failed to connect to HashPack");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
      setWallet({
        isConnected: false,
        accountId: null,
        address: null,
        isLoading: false,
        error: errorMessage,
        walletType: null,
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isHashPackInstalled]);

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
          walletType: 'metamask',
        });

        toast({
          title: "Wallet Connected",
          description: `Connected to MetaMask account ${mockAccountId}`,
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
        walletType: null,
      });

      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [isMetaMaskInstalled]);

  // Connect wallet (tries HashPack first, then MetaMask)
  const connectWallet = useCallback(async () => {
    if (isHashPackInstalled()) {
      await connectHashPack();
    } else if (isMetaMaskInstalled()) {
      await connectMetaMask();
    } else {
      const error = "No compatible wallet found. Please install HashPack or MetaMask.";
      setWallet(prev => ({ ...prev, error }));
      toast({
        title: "Wallet Required",
        description: error,
        variant: "destructive",
      });
    }
  }, [isHashPackInstalled, isMetaMaskInstalled, connectHashPack, connectMetaMask]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet({
      isConnected: false,
      accountId: null,
      address: null,
      isLoading: false,
      error: null,
      walletType: null,
    });

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      // Check HashPack first
      if (isHashPackInstalled()) {
        try {
          const response = await window.hashpack.findLocalWallets();
          if (response.success && response.data && response.data.length > 0) {
            // HashPack is connected
            const accountId = response.data[0].accountId;
            setWallet({
              isConnected: true,
              accountId,
              address: null,
              isLoading: false,
              error: null,
              walletType: 'hashpack',
            });
            return;
          }
        } catch (error) {
          console.error("Failed to check HashPack connection:", error);
        }
      }

      // Check MetaMask
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
              walletType: 'metamask',
            });
          }
        } catch (error) {
          console.error("Failed to check MetaMask connection:", error);
        }
      }
    };

    checkConnection();
  }, [isMetaMaskInstalled, isHashPackInstalled]);

  // Listen for account changes
  useEffect(() => {
    if (wallet.walletType === 'metamask' && isMetaMaskInstalled()) {
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
  }, [wallet.address, wallet.walletType, connectMetaMask, disconnect, isMetaMaskInstalled]);

  return {
    ...wallet,
    connectWallet,
    connectMetaMask,
    connectHashPack,
    disconnect,
    isMetaMaskInstalled,
    isHashPackInstalled,
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
    hashpack?: {
      connectToLocalWallet: () => Promise<{
        success: boolean;
        data?: {
          accountIds: string[];
          network: string;
        };
        error?: string;
      }>;
      findLocalWallets: () => Promise<{
        success: boolean;
        data?: Array<{
          accountId: string;
          network: string;
        }>;
        error?: string;
      }>;
    };
  }
}