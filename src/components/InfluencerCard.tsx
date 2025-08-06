import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, MapPin, Instagram, Zap, Eye, Target } from 'lucide-react';
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
      <CardContent className="px-8 py-6">
        <div className="max-w-5xl mx-auto space-y-4">
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
            <div className="space-y-2">
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
              {/* Additional badges moved here */}
              <div className="flex items-center space-x-2 pt-1">
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
            </div>

            {/* Stats Grid - Organized layout */}
            <div className="space-y-3">
              {/* Top row */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                {/* Column 1: Followers */}
                <div className="text-center">
                  <div className="font-semibold text-foreground">{formatFollowerCount(influencer.followerCount)}</div>
                  <div className="text-muted-foreground text-xs">Followers</div>
                </div>
                {/* Column 2: Current ER */}
                <div className="text-center">
                  <div className="font-semibold text-black">{influencer.engagementRate?.toFixed(1)}%</div>
                  <div className="text-muted-foreground text-xs">Current ER</div>
                </div>
                {/* Column 3: Predicted ER */}
                {influencer.erLgbmPrediction !== undefined && (
                  <div className="text-center">
                    <div className="font-semibold text-black">
                      {influencer.erLgbmPrediction.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground text-xs">Predicted ER</div>
                  </div>
                )}
                {/* Column 4: ER Change */}
                {influencer.erChangeAbsolute !== undefined && influencer.predictedEngagementRate !== undefined && (
                  <div className="text-center">
                    <div className={`font-semibold flex items-center justify-center gap-1 ${
                      influencer.erChangeAbsolute >= 0 ? 'text-dashboard-success' : 'text-dashboard-destructive'
                    }`}>
                      {influencer.erChangeAbsolute >= 0 ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                      {influencer.erChangeAbsolute >= 0 ? '+' : ''}{Math.abs(influencer.erChangeAbsolute).toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground text-xs">ER Change</div>
                  </div>
                )}
              </div>
              
              {/* Bottom row */}
              <div className="grid grid-cols-4 gap-4 text-sm">
                {/* Column 1: Rate */}
                <div className="text-center">
                  <div className="font-semibold text-dashboard-success">${influencer.rate.toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">Rate</div>
                </div>
                {/* Column 2: Current Views */}
                <div className="text-center">
                  <div className="font-semibold text-black">
                    {influencer.avgViews ? formatFollowerCount(influencer.avgViews) : '0'}
                  </div>
                  <div className="text-muted-foreground text-xs">Current Views</div>
                </div>
                {/* Column 3: Predicted Views */}
                {influencer.predictedViews !== undefined && (
                  <div className="text-center">
                    <div className="font-semibold text-dashboard-accent">
                      {formatFollowerCount(influencer.predictedViews)}
                    </div>
                    <div className="text-muted-foreground text-xs">Predicted Views</div>
                  </div>
                )}
                {/* Column 4: Views Change */}
                {influencer.viewsChangeAbsolute !== undefined && influencer.predictedViews !== undefined && (
                  <div className="text-center">
                    <div className={`font-semibold flex items-center justify-center gap-1 ${
                      influencer.viewsChangeAbsolute >= 0 ? 'text-dashboard-success' : 'text-dashboard-destructive'
                    }`}>
                      {influencer.viewsChangeAbsolute >= 0 ? 
                        <TrendingUp className="h-3 w-3" /> : 
                        <TrendingDown className="h-3 w-3" />
                      }
                      {influencer.viewsChangeAbsolute >= 0 ? '+' : ''}
                      {Math.abs(influencer.viewsChangeAbsolute) >= 1000000 ? 
                        `${(Math.abs(influencer.viewsChangeAbsolute) / 1000000).toFixed(1)}M` :
                        Math.abs(influencer.viewsChangeAbsolute) >= 1000 ? 
                        `${(Math.abs(influencer.viewsChangeAbsolute) / 1000).toFixed(0)}K` :
                        Math.abs(influencer.viewsChangeAbsolute).toFixed(0)
                      }
                    </div>
                    <div className="text-muted-foreground text-xs">Views Change</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};