import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Instagram, TrendingUp, Users, DollarSign, Eye, Heart, MessageCircle, Share, Target } from 'lucide-react';
import { InfluencerData } from './InfluencerDashboard';
import { PostPerformance } from './PostPerformance';

interface InfluencerDetailProps {
  influencer: InfluencerData;
  onBack: () => void;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
};

export const InfluencerDetail = ({ influencer, onBack }: InfluencerDetailProps) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* Influencer Header */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-card via-card to-secondary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-foreground">{influencer.handle}</h1>
                  <Badge className="bg-dashboard-primary text-white">
                    Rank #{influencer.rank}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-muted-foreground">
                  <span className="text-lg">{influencer.petParentName}</span>
                  <span>•</span>
                  <span>Pet: {influencer.petName}</span>
                  <span>•</span>
                  <span>{influencer.city}, {influencer.state}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{influencer.tier}</Badge>
                  <Badge variant="outline">{influencer.partnerType}</Badge>
                  <Badge variant="outline">{influencer.category}</Badge>
                  <Badge variant="outline">{influencer.platform}</Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-dashboard-primary">
                  {formatNumber(influencer.followerCount)}
                </div>
                <div className="text-muted-foreground">Followers</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Top-of-Page Dashboard Layout - 3 Quick-Glance Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 🧑‍💼 Influencer Snapshot */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-dashboard-primary" />
                <span>🧑‍💼 Influencer Snapshot</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Handle</span>
                <span className="font-semibold text-foreground">{influencer.handle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Follower Tier</span>
                <Badge variant="secondary" className="font-semibold">
                  {influencer.tier}: {formatNumber(influencer.followerCount)}+
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Pets</span>
                <span className="font-semibold text-foreground">{influencer.category} (1)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">City, State</span>
                <span className="font-semibold text-foreground">{influencer.city}, {influencer.state}</span>
              </div>
            </CardContent>
          </Card>

          {/* 📈 Performance Overview */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-success/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <TrendingUp className="h-5 w-5 text-dashboard-success" />
                <span>📈 Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Avg Views</span>
                <span className="font-semibold text-foreground">
                  {influencer.contentImpressions ? formatNumber(influencer.contentImpressions) : '6,200'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Engagement Rate</span>
                <span className="font-semibold text-dashboard-primary">
                  {influencer.engagementRate ? `${influencer.engagementRate.toFixed(1)}%` : '14.7%'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">ROAS</span>
                <span className="font-semibold text-dashboard-success">
                  ${influencer.roas ? influencer.roas.toFixed(2) : '133.33'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">CPE</span>
                <span className="font-semibold text-foreground">$0.09</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">CPV</span>
                <span className="font-semibold text-foreground">$0.01</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">AOV</span>
                <span className="font-semibold text-foreground">$0.32</span>
              </div>
            </CardContent>
          </Card>

          {/* 📸 Content + Brand Fit */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Instagram className="h-5 w-5 text-dashboard-warning" />
                <span>📸 Content + Brand Fit</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Common Format</span>
                <span className="font-semibold text-foreground">
                  {influencer.platform === 'Instagram' ? 'IG Reel' : 'TikTok'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Style</span>
                <span className="font-semibold text-foreground">Calm, Emotional</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Chewy Box Shown?</span>
                <span className="font-semibold text-dashboard-success">✅ Yes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">CTA Present?</span>
                <span className="font-semibold text-dashboard-primary">🔗 Code + Landing Page</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Product Focus</span>
                <span className="font-semibold text-foreground">Toys / Home Goods</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Performance Section */}
        <PostPerformance posts={influencer.posts} />
      </div>
    </div>
  );
};