import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, History, RefreshCw } from "lucide-react";
import { fetchRecentTransactions, Transaction } from "@/lib/api";
import { useWallet } from "@/hooks/useWallet";
import { formatEth, formatUsdc, getExplorerUrl, shortenAddress } from "@/lib/base";

interface TransactionHistoryProps {
  refreshTrigger?: number;
}

export const TransactionHistory = ({ refreshTrigger }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useWallet();

  const loadTransactions = async () => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchRecentTransactions(address, 20);
      
      // Filter for successful transactions with value
      const filteredTxs = data.filter(
        (tx) => tx.isError === '0' && tx.value !== '0'
      );
      
      setTransactions(filteredTxs.slice(0, 10));
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError("Failed to load transactions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      loadTransactions();
    }
  }, [refreshTrigger, address, isConnected]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Connect your wallet to see transaction history
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={loadTransactions} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            <p className="mb-2">No tips yet</p>
            <p className="text-sm">Send your first tip to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <History className="w-5 h-5 mr-2" />
            Recent Tips
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((tx) => {
            const isOutgoing = tx.from.toLowerCase() === address?.toLowerCase();
            const isToken = !!tx.tokenSymbol;
            const displayAmount = isToken
              ? `${formatUsdc((Number(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal || '6'))).toString())}`
              : `${formatEth((Number(tx.value) / 1e18).toString())} ETH`;

            return (
              <div
                key={tx.hash}
                className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        isOutgoing 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {isOutgoing ? 'Sent' : 'Received'}
                      </span>
                      {isToken && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {tx.tokenSymbol}
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-lg">{displayAmount}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(getExplorerUrl(tx.hash, 'tx'), "_blank")}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>From:</span>
                    <span className="font-mono">{shortenAddress(tx.from)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>To:</span>
                    <span className="font-mono">{shortenAddress(tx.to)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Time:</span>
                    <span>{formatTimestamp(tx.timeStamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};