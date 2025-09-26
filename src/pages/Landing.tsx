import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, DollarSign, Users, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Send HBAR tips in seconds with minimal fees"
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Built on Hedera's secure hashgraph consensus"
    },
    {
      icon: DollarSign,
      title: "Low Fees",
      description: "Ultra-low transaction costs, perfect for micro-tips"
    },
    {
      icon: Users,
      title: "Easy to Use",
      description: "Simple interface for both tippers and creators"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by Hedera Hashgraph
          </div>

          {/* Main Hero Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Hedera TipJar
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The easiest way to send and receive HBAR tips on the Hedera network. 
              Fast, secure, and affordable micro-transactions for creators and supporters.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/app")}
              className="btn-hero text-lg px-8 py-4"
            >
              Start Tipping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open("https://hedera.com", "_blank")}
              className="text-lg px-8 py-4"
            >
              Learn About Hedera
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">~$0.0001</div>
              <div className="text-muted-foreground">Average transaction fee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">3-5s</div>
              <div className="text-muted-foreground">Transaction finality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Carbon Negative</div>
              <div className="text-muted-foreground">Environmentally friendly</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Hedera TipJar?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built for the next generation of digital tipping with enterprise-grade security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="card-gradient hover:shadow-lg transition-all hover:scale-105">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Start tipping in just 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              1
            </div>
            <h3 className="text-xl font-semibold">Connect Wallet</h3>
            <p className="text-muted-foreground">
              Connect your MetaMask wallet to access Hedera
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              2
            </div>
            <h3 className="text-xl font-semibold">Enter Details</h3>
            <p className="text-muted-foreground">
              Add recipient account ID and tip amount
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">
              3
            </div>
            <h3 className="text-xl font-semibold">Send Tip</h3>
            <p className="text-muted-foreground">
              Confirm transaction and tip is sent instantly
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Tipping?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the future of digital tipping on Hedera Hashgraph
            </p>
            <Button
              onClick={() => navigate("/app")}
              className="btn-hero text-lg px-8 py-4"
            >
              Launch TipJar App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Hedera TipJar. Built with ❤️ for the Hedera community.</p>
        </div>
      </footer>
    </div>
  );
};