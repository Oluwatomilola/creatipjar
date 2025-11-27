import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelfQRcodeWrapper, SelfAppBuilder, countries } from "@selfxyz/qrcode";
import { ShieldCheck } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

export const IdentityVerification = () => {
  const { address, isConnected } = useWallet();
  const [selfApp, setSelfApp] = useState<any | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!address || !isConnected) return;

    const app = new SelfAppBuilder({
      version: 2,
      appName: "CreatipJar",
      scope: "creatipjar",
      endpoint: import.meta.env.VITE_SELF_ENDPOINT || "https://api.self.xyz",
      logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
      userId: address,
      endpointType: "staging_celo",
      userIdType: "hex",
      userDefinedData: `CreatipJar verification for ${address}`,
      disclosures: {
        minimumAge: 18,
        excludedCountries: [
          countries.CUBA,
          countries.IRAN,
          countries.NORTH_KOREA,
          countries.RUSSIA,
        ],
        nationality: true,
      },
    }).build();

    setSelfApp(app);
  }, [address, isConnected]);

  const handleSuccessfulVerification = () => {
    setIsVerified(true);
    toast({
      title: "Identity Verified!",
      description: "Your identity has been successfully verified with Self.xyz",
    });
  };

  const handleVerificationError = () => {
    toast({
      title: "Verification Failed",
      description: "Failed to verify identity. Please try again.",
      variant: "destructive",
    });
  };

  if (!isConnected) {
    return (
      <Card className="card-gradient">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2" />
            Identity Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8 text-muted-foreground">
            Connect your wallet to verify your identity
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2" />
          Identity Verification
          {isVerified && (
            <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isVerified ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Verify your identity using Self.xyz to unlock additional features
            </p>
            {selfApp ? (
              <div className="flex justify-center">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  onSuccess={handleSuccessfulVerification}
                  onError={handleVerificationError}
                />
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">
                  Loading verification...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Identity Verified</h3>
            <p className="text-sm text-muted-foreground">
              Your identity has been verified successfully
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
