import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Users, MapPin, Instagram, Zap } from 'lucide-react';
import { InfluencerData } from './InfluencerDashboard';

interface InfluencerCardProps {
  influencer: InfluencerData;
  onClick: () => void;
}

const getRankIcon = (rankType: string) => {
  switch (rankType) {
    case 'fastest-growing':
      return <TrendingUp className="h-4 w-4" />;
    case 'highest-potential':
      return <Zap className="h-4 w-4" />;
    case 'top-performer':
      return <Users className="h-4 w-4" />;
    default:
      return <Users className="h-4 w-4" />;
  }
};

const getRankColor = (rankType: string) => {
  switch (rankType) {
    case 'fastest-growing':
      return 'bg-dashboard-success text-white';
    case 'highest-potential':
      return 'bg-dashboard-warning text-white';
    case 'top-performer':
      return 'bg-dashboard-primary text-white';
    default:
      return 'bg-muted text-muted-foreground';
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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            {/* Rank Badge */}
            <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getRankColor(influencer.rankType)}`}>
              {getRankIcon(influencer.rankType)}
              <span>#{influencer.rank}</span>
            </div>

            {/* Influencer Info */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="font-semibold text-foreground text-lg truncate">{influencer.handle}</h3>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {influencer.platform}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground flex-wrap">
                <span className="truncate">{influencer.petParentName}</span>
                <span className="hidden sm:inline">•</span>
                <span className="truncate">Pet: {influencer.petName}</span>
                <span className="hidden md:inline">•</span>
                <div className="flex items-center space-x-1 flex-shrink-0">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{influencer.city}, {influencer.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 text-sm flex-shrink-0">
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
            {influencer.recentGrowth && (
              <div className="text-center">
                <div className="font-semibold text-dashboard-warning">+{influencer.recentGrowth}%</div>
                <div className="text-muted-foreground text-xs">Growth</div>
              </div>
            )}
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