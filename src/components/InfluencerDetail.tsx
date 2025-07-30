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
export const InfluencerDetail = ({
  influencer,
  onBack
}: InfluencerDetailProps) => {
  return <div className="min-h-screen bg-background p-6">
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
                <div className="text-3xl font-bold text-dashboard-primary mx-[65px]">
                  {formatNumber(influencer.followerCount)}
                </div>
                <div className="text-muted-foreground mx-[66px]">Followers</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Performance Overview */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Performance Overview</h2>
            <p className="text-muted-foreground">Key performance metrics and statistics</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-foreground">
                {influencer.contentImpressions ? formatNumber(influencer.contentImpressions) : '6,200'}
              </div>
              <div className="text-sm text-muted-foreground">Avg Views</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-secondary/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-dashboard-primary">
                {influencer.engagementRate ? `${influencer.engagementRate.toFixed(1)}%` : '14.7%'}
              </div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-dashboard-success">
                ${influencer.roas ? influencer.roas.toFixed(2) : '133.33'}
              </div>
              <div className="text-sm text-muted-foreground">ROAS</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-warning/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-foreground">$0.09</div>
              <div className="text-sm text-muted-foreground">CPE</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-info/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-foreground">$0.01</div>
              <div className="text-sm text-muted-foreground">CPV</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-accent/5 rounded-lg border border-border/50">
              <div className="text-lg font-bold text-foreground">$0.32</div>
              <div className="text-sm text-muted-foreground">AOV</div>
            </div>
          </div>
        </div>

        {/* Post Performance Section */}
        <PostPerformance posts={influencer.posts} />
      </div>
    </div>;
};