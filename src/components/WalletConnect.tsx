import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

export const WalletConnect = () => {
  const { 
    isConnected, 
    accountId, 
    isLoading, 
    walletType,
    pairingString,
    connectWallet, 
    connectHashPack,
    disconnect, 
    isHashPackInstalled 
  } = useWallet();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect your wallet to start sending tips on Hedera
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={connectWallet}
                disabled={isLoading}
                className="btn-hero w-full"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </div>
                 ) : (
                   <>
                     <Wallet className="w-4 h-4 mr-2" />
                     Connect HashPack
                   </>
                 )}
              </Button>
              
              {pairingString && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    Enter this pairing code in HashPack:
                  </p>
                  <p className="font-mono text-sm break-all">{pairingString}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(pairingString, "Pairing code")}
                    className="mt-2"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </Button>
                </div>
              )}
              
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => window.open("https://www.hashpack.app/", "_blank")}
                  className="text-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Don't have HashPack? Install it here
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                <Wallet className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Wallet Connected</h3>
                <p className="text-sm text-muted-foreground">HashPack</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={disconnect}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Hedera Account ID</p>
                <p className="font-mono text-sm">{accountId}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(accountId!, "Account ID")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};