import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ExternalLink, RefreshCw, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { fetchRecentTransactions, Transaction } from "@/lib/api";
import { formatHbar, tinybarsToHbar } from "@/lib/hedera";
import { CURRENT_NETWORK } from "@/lib/hedera";

interface TransactionHistoryProps {
  refreshTrigger?: number;
}

export const TransactionHistory = ({ refreshTrigger }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const txs = await fetchRecentTransactions();
      // Filter for successful transfer transactions
      const tipTransactions = txs.filter(tx => 
        tx.result === "SUCCESS" && 
        tx.transfers.length >= 2 &&
        tx.transfers.some(transfer => transfer.amount > 0)
      );
      setTransactions(tipTransactions.slice(0, 10)); // Show last 10 tips
    } catch (err) {
      setError("Failed to load transactions");
      console.error("Transaction loading error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [refreshTrigger]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseFloat(timestamp) * 1000);
    return date.toLocaleString();
  };

  const getTransactionUrl = (transactionId: string) => {
    const baseUrl = CURRENT_NETWORK.mirrorNodeUrl.includes('testnet') 
      ? 'https://hashscan.io/testnet'
      : 'https://hashscan.io/mainnet';
    return `${baseUrl}/transaction/${transactionId}`;
  };

  if (isLoading) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>Recent Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-32"></div>
                  </div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <History className="w-5 h-5 text-primary" />
              <span>Recent Tips</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTransactions}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-primary" />
            <span>Recent Tips</span>
            <Badge variant="secondary">{transactions.length}</Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadTransactions}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tips Yet</h3>
            <p className="text-muted-foreground">
              Recent tip transactions will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const sender = tx.transfers.find(t => t.amount < 0);
              const receiver = tx.transfers.find(t => t.amount > 0);
              const amount = receiver ? Math.abs(receiver.amount) : 0;
              const hbarAmount = tinybarsToHbar(amount);

              return (
                <div
                  key={tx.transaction_id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">
                          {formatHbar(hbarAmount)} HBAR
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Tip
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>From: {sender?.account || 'Unknown'}</p>
                        <p>To: {receiver?.account || 'Unknown'}</p>
                        <p>{formatTimestamp(tx.consensus_timestamp)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={tx.result === "SUCCESS" ? "default" : "destructive"}
                      className={tx.result === "SUCCESS" ? "success-glow" : ""}
                    >
                      {tx.result}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(getTransactionUrl(tx.transaction_id), '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};