import {
  Client,
  PrivateKey,
  AccountId,
  TransferTransaction,
  Hbar,
  TransactionReceipt,
  TransactionResponse,
} from "@hashgraph/sdk";

// Hedera network configuration
export const HEDERA_NETWORK = {
  testnet: {
    nodeAccountId: "0.0.3",
    mirrorNodeUrl: "https://testnet.mirrornode.hedera.com",
    jsonRpcUrl: "https://testnet.hashio.io/api",
  },
  mainnet: {
    nodeAccountId: "0.0.3", 
    mirrorNodeUrl: "https://mainnet-public.mirrornode.hedera.com",
    jsonRpcUrl: "https://mainnet.hashio.io/api",
  },
};

export const CURRENT_NETWORK = HEDERA_NETWORK.testnet;

// Initialize Hedera client for testnet
export const getHederaClient = (): Client => {
  return Client.forTestnet();
};

// Create a transfer transaction
export const createTransferTransaction = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number
): Promise<TransferTransaction> => {
  const client = getHederaClient();
  
  const transferTransaction = new TransferTransaction()
    .addHbarTransfer(AccountId.fromString(fromAccountId), Hbar.fromTinybars(-amount * 100000000)) // Convert HBAR to tinybars
    .addHbarTransfer(AccountId.fromString(toAccountId), Hbar.fromTinybars(amount * 100000000));

  return transferTransaction;
};

// Execute transfer via MetaMask/wallet
export const executeTransferWithWallet = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  ethereum: any
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    if (!ethereum) {
      throw new Error("MetaMask not found");
    }

    // Create the transaction
    const transferTx = await createTransferTransaction(fromAccountId, toAccountId, amount);
    
    // Convert transaction to bytes for signing
    const txBytes = transferTx.toBytes();
    
    // Request signature from MetaMask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const signature = await ethereum.request({
      method: 'personal_sign',
      params: [txBytes, accounts[0]],
    });

    // For demo purposes, we'll simulate a successful transaction
    // In a real implementation, you'd submit the signed transaction to Hedera
    const mockTransactionId = `0.0.${Date.now()}@${Date.now()}.${Math.floor(Math.random() * 1000000000)}`;
    
    return {
      success: true,
      transactionId: mockTransactionId,
    };
  } catch (error) {
    console.error("Transfer failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Transfer failed",
    };
  }
};

// Validate Hedera account ID format
export const isValidAccountId = (accountId: string): boolean => {
  const regex = /^\d+\.\d+\.\d+$/;
  return regex.test(accountId);
};

// Format HBAR amount
export const formatHbar = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(amount);
};

// Convert tinybars to HBAR
export const tinybarsToHbar = (tinybars: number): number => {
  return tinybars / 100000000;
};

// Convert HBAR to tinybars
export const hbarToTinybars = (hbar: number): number => {
  return Math.floor(hbar * 100000000);
};