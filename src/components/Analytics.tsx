import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Zap } from "lucide-react";
import { fetchAnalytics, AnalyticsData } from "@/lib/api";
import { formatHbar } from "@/lib/hedera";

export const Analytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalTips: 0,
    totalHbarTipped: 0,
    uniqueTippers: 0,
    recentTipsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error("Failed to load analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
    
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Total Tips",
      value: analytics.totalTips.toLocaleString(),
      icon: TrendingUp,
      description: "All-time tips sent",
      color: "text-primary"
    },
    {
      title: "Total HBAR",
      value: formatHbar(analytics.totalHbarTipped),
      icon: DollarSign,
      description: "Total value tipped",
      color: "text-success"
    },
    {
      title: "Unique Tippers",
      value: analytics.uniqueTippers.toLocaleString(),
      icon: Users,
      description: "Different accounts",
      color: "text-accent-foreground"
    },
    {
      title: "Recent Tips",
      value: analytics.recentTipsCount.toLocaleString(),
      icon: Zap,
      description: "Last 24 hours",
      color: "text-warning"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="card-gradient">
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-8 bg-muted rounded w-16"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="card-gradient hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};