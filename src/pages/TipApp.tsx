import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalletConnect } from "@/components/WalletConnect";
import { TipForm } from "@/components/TipForm";
import { TransactionHistory } from "@/components/TransactionHistory";
import { Analytics } from "@/components/Analytics";
import { IdentityVerification } from "@/components/IdentityVerification";
import { TipLinkGenerator } from "@/components/TipLinkGenerator";

export const TipApp = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTipSent = () => {
    // Trigger refresh of transaction history and analytics
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  CreatipJar
                </h1>
                <p className="text-sm text-muted-foreground">Send ETH tips on Base</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Testnet
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Analytics Dashboard */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Network Statistics</h2>
            <Analytics />
          </div>

          {/* Main App Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Wallet & Forms */}
            <div className="space-y-6">
              <WalletConnect />
              <TipForm onTipSent={handleTipSent} />
              <TipLinkGenerator />
            </div>

            {/* Right Column - History & Verification */}
            <div className="space-y-6">
              <TransactionHistory refreshTrigger={refreshTrigger} />
              <IdentityVerification />
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-muted/30 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Running on Base Sepolia</h3>
            <p className="text-muted-foreground mb-4">
              This demo uses Base Sepolia testnet for safe testing.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Fast Transactions
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Low Fees
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                Carbon Negative
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};