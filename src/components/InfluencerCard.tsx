import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, MapPin, Instagram, Zap } from 'lucide-react';
import { InfluencerData } from './InfluencerDashboard';

interface InfluencerCardProps {
  influencer: InfluencerData;
  onClick: () => void;
}

const getRankIcon = (rankType: string) => {
  switch (rankType) {
    case 'trending-up':
      return <TrendingUp className="h-4 w-4" />;
    case 'trending-down':
      return <TrendingDown className="h-4 w-4" />;
    default:
      return <TrendingUp className="h-4 w-4" />;
  }
};

const getRankColor = (rankType: string) => {
  switch (rankType) {
    case 'trending-up':
      return 'bg-dashboard-success/20 text-dashboard-success border-dashboard-success/30';
    case 'trending-down':
      return 'bg-dashboard-destructive/20 text-dashboard-destructive border-dashboard-destructive/30';
    default:
      return 'bg-dashboard-success/20 text-dashboard-success border-dashboard-success/30';
  }
};

const formatFollowerCount = (count: number) => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toString();
};

export const InfluencerCard = ({ influencer, onClick }: InfluencerCardProps) => {
  return (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-md hover:scale-[1.02] border border-border/50 bg-gradient-to-r from-card to-card/50"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Rank Badge */}
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRankColor(influencer.rankType)}`}>
                {getRankIcon(influencer.rankType)}
                <span>#{influencer.rank}</span>
              </div>
              
              {/* Handle and Platform */}
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-foreground text-lg">{influencer.handle}</h3>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {influencer.platform}
                </Badge>
              </div>
            </div>
          </div>

          {/* Influencer Details */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                {influencer.petParentName}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Pet: {influencer.petName}</span>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{influencer.city}, {influencer.state}</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-foreground">{formatFollowerCount(influencer.followerCount)}</div>
                <div className="text-muted-foreground text-xs">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-dashboard-primary">{influencer.engagementRate?.toFixed(1)}%</div>
                <div className="text-muted-foreground text-xs">Engagement</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-dashboard-success">${influencer.rate.toLocaleString()}</div>
                <div className="text-muted-foreground text-xs">Rate</div>
              </div>
              {influencer.erLgbmPrediction !== undefined && (
                <div className="text-center">
                  <div className="font-semibold text-dashboard-warning">
                    {influencer.erLgbmPrediction.toFixed(1)}%
                  </div>
                  <div className="text-muted-foreground text-xs">Predicted ER</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional badges */}
        <div className="flex items-center space-x-2 mt-4">
          <Badge variant="secondary" className="text-xs">
            {influencer.tier}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {influencer.partnerType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {influencer.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};