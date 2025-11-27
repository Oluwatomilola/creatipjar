import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, DollarSign } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";
import { isValidAddress, parseAmount, TokenType, ERC20_ABI, USDC_CONTRACT_ADDRESS, CURRENT_NETWORK } from "@/lib/base";
import { useSendTransaction, useWriteContract, useAccount } from 'wagmi';
import { parseEther, parseUnits } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TipFormProps {
  onTipSent?: () => void;
}

export const TipForm = ({ onTipSent }: TipFormProps) => {
  const { address, isConnected, chainId } = useWallet();
  const { address: account } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenType, setTokenType] = useState<TokenType>("ETH");
  const [isLoading, setIsLoading] = useState(false);

  const { sendTransaction } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!recipient || !isValidAddress(recipient)) {
      toast({
        title: "Invalid Recipient",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    const tipAmount = parseFloat(amount);
    if (isNaN(tipAmount) || tipAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (tokenType === 'ETH') {
        // Send ETH
        sendTransaction({
          to: recipient as `0x${string}`,
          value: parseEther(amount),
        }, {
          onSuccess: (hash) => {
            toast({
              title: "Tip Sent Successfully!",
              description: `Sent ${amount} ETH to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
            });
            setRecipient("");
            setAmount("");
            onTipSent?.();
          },
          onError: (error) => {
            toast({
              title: "Transaction Failed",
              description: error.message,
              variant: "destructive",
            });
          },
          onSettled: () => {
            setIsLoading(false);
          }
        });
      } else if (tokenType === 'USDC') {
        // Send USDC
        try {
          const hash = await writeContractAsync({
            address: USDC_CONTRACT_ADDRESS,
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [recipient as `0x${string}`, parseUnits(amount, 6)],
            account: account!,
            chain: baseSepolia,
          });
          
          toast({
            title: "Tip Sent Successfully!",
            description: `Sent ${amount} USDC to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
          });
          setRecipient("");
          setAmount("");
          setIsLoading(false);
          onTipSent?.();
        } catch (error: any) {
          console.error("USDC transfer error:", error);
          toast({
            title: "Transaction Failed",
            description: error.message || "Failed to send USDC tip",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      console.error("Error sending tip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send tip",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Send className="w-5 h-5 mr-2" />
            Send a Tip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Please connect your wallet to send tips
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="w-5 h-5 mr-2" />
          Send a Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input-hedera"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address to tip
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input-hedera"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Select value={tokenType} onValueChange={(value) => setTokenType(value as TokenType)}>
                <SelectTrigger id="token" disabled={isLoading}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="btn-hero w-full"
            disabled={isLoading || !recipient || !amount}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending Tip...
              </div>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Send {tokenType} Tip
              </>
            )}
          </Button>

          <div className="pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              Powered by Base network • Fast & affordable transactions
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};