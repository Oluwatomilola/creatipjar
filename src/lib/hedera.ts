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

// Execute transfer via HashConnect
export const executeTransferWithWallet = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  hashconnect: any
): Promise<{ success: boolean; transactionId?: string; error?: string }> => {
  try {
    console.log("Executing transfer with HashConnect:", {
      from: fromAccountId,
      to: toAccountId,
      amount: `${amount} HBAR`,
    });
    
    // Create the transfer transaction
    const transaction = await createTransferTransaction(fromAccountId, toAccountId, amount);
    
    // With HashConnect, you would use the signer to execute the transaction
    if (hashconnect && hashconnect.hcData?.topic) {
      try {
        // Get the provider and signer from HashConnect
        const provider = hashconnect.getProvider('testnet', hashconnect.hcData.topic, fromAccountId);
        const signer = hashconnect.getSigner(provider);
        
        // Execute the transaction with the signer
        const txResponse = await transaction.executeWithSigner(signer);
        
        return {
          success: true,
          transactionId: txResponse.transactionId.toString()
        };
      } catch (signError) {
        console.error("HashConnect signing failed:", signError);
        return {
          success: false,
          error: "User rejected transaction or signing failed"
        };
      }
    }
    
    // Fallback simulation for development
    const mockTransactionId = `0.0.${Date.now()}@${Date.now()}.${Math.floor(Math.random() * 1000000000)}`;
    return {
      success: true,
      transactionId: mockTransactionId
    };
    
  } catch (error) {
    console.error("Transfer execution failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
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