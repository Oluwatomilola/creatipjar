import axios from "axios";
import { CURRENT_NETWORK } from "./hedera";

export interface Transaction {
  consensus_timestamp: string;
  transaction_id: string;
  transfers: {
    account: string;
    amount: number;
  }[];
  memo_base64?: string;
  result: string;
}

export interface AccountInfo {
  account: string;
  balance: {
    balance: number;
  };
}

// Fetch recent transactions from Hedera Mirror Node
export const fetchRecentTransactions = async (accountId?: string): Promise<Transaction[]> => {
  try {
    let url = `${CURRENT_NETWORK.mirrorNodeUrl}/api/v1/transactions`;
    
    if (accountId) {
      url += `?account.id=${accountId}`;
    }
    
    url += `${accountId ? '&' : '?'}transactiontype=cryptotransfer&limit=20&order=desc`;

    const response = await axios.get(url);
    return response.data.transactions || [];
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
};

// Fetch account balance
export const fetchAccountBalance = async (accountId: string): Promise<number> => {
  try {
    const response = await axios.get(
      `${CURRENT_NETWORK.mirrorNodeUrl}/api/v1/accounts/${accountId}`
    );
    return response.data.balance?.balance ? 
      parseInt(response.data.balance.balance) / 100000000 : 0; // Convert tinybars to HBAR
  } catch (error) {
    console.error("Failed to fetch account balance:", error);
    return 0;
  }
};

// Fetch transaction details
export const fetchTransactionDetails = async (transactionId: string): Promise<Transaction | null> => {
  try {
    const response = await axios.get(
      `${CURRENT_NETWORK.mirrorNodeUrl}/api/v1/transactions/${transactionId}`
    );
    return response.data.transactions?.[0] || null;
  } catch (error) {
    console.error("Failed to fetch transaction details:", error);
    return null;
  }
};

// Get analytics data
export interface AnalyticsData {
  totalTips: number;
  totalHbarTipped: number;
  uniqueTippers: number;
  recentTipsCount: number;
}

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  try {
    // Fetch recent transactions for analytics
    const transactions = await fetchRecentTransactions();
    
    const tipTransactions = transactions.filter(tx => 
      tx.result === "SUCCESS" && 
      tx.transfers.length >= 2 &&
      tx.transfers.some(transfer => transfer.amount > 0)
    );

    const totalHbarTipped = tipTransactions.reduce((sum, tx) => {
      const positiveTransfer = tx.transfers.find(transfer => transfer.amount > 0);
      return sum + (positiveTransfer ? Math.abs(positiveTransfer.amount) / 100000000 : 0);
    }, 0);

    const uniqueTippers = new Set(
      tipTransactions.map(tx => {
        const sender = tx.transfers.find(transfer => transfer.amount < 0);
        return sender?.account;
      }).filter(Boolean)
    ).size;

    const recentTipsCount = tipTransactions.filter(tx => {
      const timestamp = new Date(parseFloat(tx.consensus_timestamp) * 1000);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return timestamp > oneDayAgo;
    }).length;

    return {
      totalTips: tipTransactions.length,
      totalHbarTipped,
      uniqueTippers,
      recentTipsCount,
    };
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return {
      totalTips: 0,
      totalHbarTipped: 0,
      uniqueTippers: 0,
      recentTipsCount: 0,
    };
  }
};