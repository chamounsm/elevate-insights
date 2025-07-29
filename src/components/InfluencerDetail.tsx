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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Content Impressions</CardTitle>
              <Eye className="h-4 w-4 text-dashboard-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {influencer.contentImpressions ? formatNumber(influencer.contentImpressions) : 'N/A'}
              </div>
              <p className="text-xs text-dashboard-success">High visibility</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accounts Reached</CardTitle>
              <Users className="h-4 w-4 text-dashboard-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {influencer.accountsReached ? formatNumber(influencer.accountsReached) : 'N/A'}
              </div>
              <p className="text-xs text-dashboard-success">Expanding reach</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-success/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-dashboard-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${influencer.totalRevenue ? influencer.totalRevenue.toLocaleString() : '0'}
              </div>
              <p className="text-xs text-dashboard-success">Revenue generated</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-warning/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Engagement Rate</CardTitle>
              <Heart className="h-4 w-4 text-dashboard-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {influencer.engagementRate ? `${influencer.engagementRate.toFixed(1)}%` : 'N/A'}
              </div>
              <p className="text-xs text-dashboard-success">Above average</p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-dashboard-primary" />
                <span>Engagement Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Engagements</span>
                <span className="font-semibold text-foreground">
                  {influencer.totalEngagements ? formatNumber(influencer.totalEngagements) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Engagement Rate</span>
                <span className="font-semibold text-dashboard-primary">
                  {influencer.engagementRate ? `${influencer.engagementRate.toFixed(1)}%` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recent Growth</span>
                <span className="font-semibold text-dashboard-success">
                  {influencer.recentGrowth ? `+${influencer.recentGrowth}%` : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-dashboard-success" />
                <span>Performance Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">ROAS</span>
                <span className="font-semibold text-foreground">
                  {influencer.roas ? `${influencer.roas.toFixed(2)}x` : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CPA</span>
                <span className="font-semibold text-dashboard-warning">
                  ${influencer.cpa ? influencer.cpa.toFixed(2) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Partner Rate</span>
                <span className="font-semibold text-dashboard-primary">
                  ${influencer.rate.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Partnership Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform:</span>
                    <span className="font-medium text-foreground">{influencer.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier:</span>
                    <span className="font-medium text-foreground">{influencer.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partner Type:</span>
                    <span className="font-medium text-foreground">{influencer.partnerType}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Location & Demographics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-foreground">{influencer.city}, {influencer.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium text-foreground">{influencer.category}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Pet Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pet Name:</span>
                    <span className="font-medium text-foreground">{influencer.petName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-medium text-foreground">{influencer.petParentName}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Post Performance Section */}
        <PostPerformance posts={influencer.posts} />
      </div>
    </div>
  );
};