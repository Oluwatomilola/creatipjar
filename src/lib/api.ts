import axios from "axios";
import { CURRENT_NETWORK } from "./base";

// Transaction data structure for Base network
export interface Transaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  contractAddress?: string;
  tokenName?: string;
  tokenSymbol?: string;
  tokenDecimal?: string;
  isError: string;
  txreceipt_status?: string;
}

// Account info structure
export interface AccountInfo {
  address: string;
  balance: string;
}

// BaseScan API key (optional, but recommended for higher rate limits)
const BASESCAN_API_KEY = import.meta.env.VITE_BASESCAN_API_KEY || '';

// Fetch recent transactions for an address (both ETH and USDC)
export const fetchRecentTransactions = async (
  address: string,
  limit: number = 50
): Promise<Transaction[]> => {
  try {
    // Fetch normal ETH transactions
    const ethResponse = await axios.get(CURRENT_NETWORK.apiUrl, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: limit,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    // Fetch ERC20 token transactions (USDC)
    const tokenResponse = await axios.get(CURRENT_NETWORK.apiUrl, {
      params: {
        module: 'account',
        action: 'tokentx',
        address,
        startblock: 0,
        endblock: 99999999,
        page: 1,
        offset: limit,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    let allTransactions: Transaction[] = [];

    if (ethResponse.data.status === '1' && ethResponse.data.result) {
      allTransactions = [...ethResponse.data.result];
    }

    if (tokenResponse.data.status === '1' && tokenResponse.data.result) {
      allTransactions = [...allTransactions, ...tokenResponse.data.result];
    }

    // Sort by timestamp (most recent first)
    allTransactions.sort((a, b) => parseInt(b.timeStamp) - parseInt(a.timeStamp));

    // Filter successful transactions only
    return allTransactions.filter(
      (tx) => tx.isError === '0' && tx.txreceipt_status !== '0'
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};

// Fetch ETH balance for an address
export const fetchAccountBalance = async (address: string): Promise<string> => {
  try {
    const response = await axios.get(CURRENT_NETWORK.apiUrl, {
      params: {
        module: 'account',
        action: 'balance',
        address,
        tag: 'latest',
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.status === '1') {
      // Convert from wei to ETH
      const balanceInWei = BigInt(response.data.result);
      const balanceInEth = Number(balanceInWei) / 1e18;
      return balanceInEth.toFixed(4);
    }

    return '0';
  } catch (error) {
    console.error("Error fetching balance:", error);
    return '0';
  }
};

// Fetch transaction details
export const fetchTransactionDetails = async (hash: string): Promise<Transaction | null> => {
  try {
    const response = await axios.get(CURRENT_NETWORK.apiUrl, {
      params: {
        module: 'proxy',
        action: 'eth_getTransactionByHash',
        txhash: hash,
        apikey: BASESCAN_API_KEY,
      },
    });

    if (response.data.result) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return null;
  }
};

// Analytics data structure
export interface AnalyticsData {
  totalTips: number;
  totalAmount: number;
  uniqueTippers: number;
  recentTipsCount: number;
}

// Fetch analytics for an address
export const fetchAnalytics = async (address: string): Promise<AnalyticsData> => {
  try {
    const transactions = await fetchRecentTransactions(address, 100);
    
    // Filter for incoming transactions (tips received)
    const incomingTips = transactions.filter(
      (tx) => tx.to.toLowerCase() === address.toLowerCase() && tx.value !== '0'
    );

    // Calculate total amount (combine ETH and token transfers)
    let totalAmount = 0;
    incomingTips.forEach((tx) => {
      if (tx.tokenSymbol) {
        // Token transfer (USDC)
        const decimals = parseInt(tx.tokenDecimal || '6');
        totalAmount += Number(tx.value) / Math.pow(10, decimals);
      } else {
        // ETH transfer
        totalAmount += Number(tx.value) / 1e18;
      }
    });

    // Count unique tippers
    const uniqueTippers = new Set(incomingTips.map((tx) => tx.from.toLowerCase())).size;

    // Recent tips (last 24 hours)
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
    const recentTips = incomingTips.filter(
      (tx) => parseInt(tx.timeStamp) > oneDayAgo
    );

    return {
      totalTips: incomingTips.length,
      totalAmount: parseFloat(totalAmount.toFixed(4)),
      uniqueTippers,
      recentTipsCount: recentTips.length,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      totalTips: 0,
      totalAmount: 0,
      uniqueTippers: 0,
      recentTipsCount: 0,
    };
  }
};