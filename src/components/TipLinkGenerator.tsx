import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Copy, Check } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

export const TipLinkGenerator = () => {
  const { address, isConnected } = useWallet();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    if (!address || !isConnected) return;

    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      recipient: address,
      ...(amount && { amount }),
      ...(message && { message }),
    });

    const link = `${baseUrl}/tip?${params.toString()}`;
    setGeneratedLink(link);
    
    toast({
      title: "Tip Link Generated!",
      description: "Share this link to receive tips",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Tip link copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Link className="w-5 h-5 mr-2" />
            Tip Link Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Connect your wallet to generate tip links
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Tip Link Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a shareable link for others to tip you
          </p>

          <div className="space-y-2">
            <Label htmlFor="suggest-amount">Suggested Amount (Optional)</Label>
            <Input
              id="suggest-amount"
              type="number"
              step="0.000001"
              placeholder="0.00 ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-hedera"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tip-message">Message (Optional)</Label>
            <Input
              id="tip-message"
              type="text"
              placeholder="Thanks for the tip!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="input-hedera"
            />
          </div>

          <Button
            onClick={generateLink}
            className="btn-hero w-full"
          >
            <Link className="w-4 h-4 mr-2" />
            Generate Tip Link
          </Button>

          {generatedLink && (
            <div className="space-y-2 pt-4 border-t border-border/50">
              <Label>Your Tip Link</Label>
              <div className="flex gap-2">
                <Input
                  value={generatedLink}
                  readOnly
                  className="input-hedera font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
