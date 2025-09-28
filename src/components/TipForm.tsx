import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import { isValidAccountId, executeTransferWithWallet } from "@/lib/hedera";

interface TipFormProps {
  onTipSent?: () => void;
}

export const TipForm = ({ onTipSent }: TipFormProps) => {
  const { isConnected, accountId, hashconnect } = useWallet();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !accountId) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!isValidAccountId(recipient)) {
      toast({
        title: "Invalid Account ID",
        description: "Please enter a valid Hedera account ID (format: 0.0.123456)",
        variant: "destructive",
      });
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid tip amount",
        variant: "destructive",
      });
      return;
    }

    if (tipAmount > 100) {
      toast({
        title: "Amount Too Large",
        description: "Maximum tip amount is 100 HBAR",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await executeTransferWithWallet(
        accountId,
        recipient,
        tipAmount,
        hashconnect
      );

      if (result.success) {
        toast({
          title: "Tip Sent Successfully! 🎉",
          description: `Sent ${tipAmount} HBAR to ${recipient}`,
          className: "success-glow",
        });

        // Reset form
        setRecipient("");
        setAmount("");
        setMemo("");
        
        // Trigger refresh of transaction history
        onTipSent?.();
      } else {
        toast({
          title: "Transfer Failed",
          description: result.error || "Failed to send tip",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Send className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Connect Wallet to Send Tips</h3>
            <p className="text-muted-foreground">
              Connect your wallet to start sending HBAR tips on Hedera
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-primary" />
          <span>Send a Tip</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Account ID</Label>
            <Input
              id="recipient"
              placeholder="0.0.123456"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-hedera"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the Hedera account ID of the recipient
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (HBAR)</Label>
            <Input
              id="amount"
              type="number"
              step="0.00000001"
              min="0.00000001"
              max="100"
              placeholder="1.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-hedera"
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum: 0.00000001 HBAR, Maximum: 100 HBAR
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">Memo (Optional)</Label>
            <Textarea
              id="memo"
              placeholder="Thanks for the great content! 🎉"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="input-hedera resize-none"
              rows={3}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">
              Add a personal message (max 100 characters)
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="btn-hero w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending Tip...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send {amount || "0"} HBAR
              </>
            )}
          </Button>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>⚡ Powered by Hedera Hashgraph</p>
            <p>🔒 Secure • Fast • Low Fees</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};