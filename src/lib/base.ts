import { parseEther, parseUnits, formatEther, isAddress } from 'viem';
import { base, baseSepolia } from 'wagmi/chains';

// Base network configuration
export const BASE_NETWORK = {
  mainnet: {
    chainId: base.id,
    name: base.name,
    rpcUrl: base.rpcUrls.default.http[0],
    blockExplorer: 'https://basescan.org',
    apiUrl: 'https://api.basescan.org/api',
  },
  sepolia: {
    chainId: baseSepolia.id,
    name: baseSepolia.name,
    rpcUrl: baseSepolia.rpcUrls.default.http[0],
    blockExplorer: 'https://sepolia.basescan.org',
    apiUrl: 'https://api-sepolia.basescan.org/api',
  },
};

// Use Sepolia for development/testing
export const CURRENT_NETWORK = BASE_NETWORK.sepolia;

// USDC contract address on Base Sepolia
export const USDC_CONTRACT_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Token types
export type TokenType = 'ETH' | 'USDC';

// Validate Ethereum address format
export const isValidAddress = (address: string): boolean => {
  return isAddress(address);
};

// Format ETH amount
export const formatEth = (amount: string | number): string => {
  const ethValue = typeof amount === 'string' ? amount : amount.toString();
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(parseFloat(ethValue));
};

// Format USDC amount
export const formatUsdc = (amount: string | number): string => {
  const usdcValue = typeof amount === 'string' ? amount : amount.toString();
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(parseFloat(usdcValue));
};

// Parse amount to wei/smallest unit
export const parseAmount = (amount: number, tokenType: TokenType): bigint => {
  if (tokenType === 'ETH') {
    return parseEther(amount.toString());
  } else {
    // USDC has 6 decimals
    return parseUnits(amount.toString(), USDC_DECIMALS);
  }
};

// Convert wei to ETH
export const weiToEth = (wei: bigint): string => {
  return formatEther(wei);
};

// Convert smallest unit to USDC
export const smallestToUsdc = (smallest: bigint): string => {
  return (Number(smallest) / Math.pow(10, USDC_DECIMALS)).toString();
};

// ERC20 ABI for USDC transfers
export const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

// Get block explorer URL
export const getExplorerUrl = (hash: string, type: 'tx' | 'address' = 'tx'): string => {
  return `${CURRENT_NETWORK.blockExplorer}/${type}/${hash}`;
};

// Get short address format (0x1234...5678)
export const shortenAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
