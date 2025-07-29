import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Users, DollarSign } from 'lucide-react';
import { InfluencerCard } from './InfluencerCard';
import { InfluencerDetail } from './InfluencerDetail';

export interface InfluencerData {
  id: string;
  handle: string;
  petParentName: string;
  petName: string;
  followerCount: number;
  tier: string;
  category: string;
  partnerType: string;
  rate: number;
  city: string;
  state: string;
  platform: string;
  rank: number;
  rankType: 'fastest-growing' | 'highest-potential' | 'top-performer';
  // Metrics
  contentImpressions?: number;
  accountsReached?: number;
  totalEngagements?: number;
  totalRevenue?: number;
  engagementRate?: number;
  roas?: number;
  cpa?: number;
  recentGrowth?: number;
}

// Mock data for demonstration
const mockInfluencers: InfluencerData[] = [
  {
    id: '1',
    handle: '@girlandadoodle',
    petParentName: 'Kat Braden',
    petName: 'Oliver',
    followerCount: 1000000,
    tier: 'MEGA: 1MM+',
    category: 'Pet Parent',
    partnerType: 'REPEAT',
    rate: 10000,
    city: 'Orem',
    state: 'UT',
    platform: 'INSTAGRAM',
    rank: 1,
    rankType: 'fastest-growing',
    contentImpressions: 2200000,
    accountsReached: 1303407,
    totalEngagements: 109749,
    totalRevenue: 3219,
    engagementRate: 4.99,
    roas: 0.32,
    cpa: 133.33,
    recentGrowth: 15.2
  },
  {
    id: '2',
    handle: '@pawsomepup',
    petParentName: 'Sarah Johnson',
    petName: 'Max',
    followerCount: 750000,
    tier: 'MACRO: 500K-1MM',
    category: 'Pet Parent',
    partnerType: 'NEW',
    rate: 8500,
    city: 'Austin',
    state: 'TX',
    platform: 'TIKTOK',
    rank: 2,
    rankType: 'highest-potential',
    contentImpressions: 1800000,
    accountsReached: 950000,
    totalEngagements: 95000,
    totalRevenue: 4200,
    engagementRate: 6.2,
    roas: 0.49,
    cpa: 95.45,
    recentGrowth: 22.8
  },
  {
    id: '3',
    handle: '@dogdaysofjoy',
    petParentName: 'Mike Chen',
    petName: 'Luna',
    followerCount: 500000,
    tier: 'MACRO: 500K-1MM',
    category: 'Pet Parent',
    partnerType: 'REPEAT',
    rate: 6000,
    city: 'Los Angeles',
    state: 'CA',
    platform: 'INSTAGRAM',
    rank: 3,
    rankType: 'top-performer',
    contentImpressions: 1200000,
    accountsReached: 680000,
    totalEngagements: 78000,
    totalRevenue: 5500,
    engagementRate: 7.8,
    roas: 0.92,
    cpa: 76.92,
    recentGrowth: 8.5
  }
];

export const InfluencerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null);

  const filteredInfluencers = mockInfluencers.filter(
    influencer =>
      influencer.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.petParentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      influencer.petName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalInfluencers = mockInfluencers.length;
  const totalFollowers = mockInfluencers.reduce((sum, inf) => sum + inf.followerCount, 0);
  const totalRevenue = mockInfluencers.reduce((sum, inf) => sum + (inf.totalRevenue || 0), 0);
  const avgEngagement = mockInfluencers.reduce((sum, inf) => sum + (inf.engagementRate || 0), 0) / mockInfluencers.length;

  if (selectedInfluencer) {
    return (
      <InfluencerDetail 
        influencer={selectedInfluencer} 
        onBack={() => setSelectedInfluencer(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Influencer Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your influencer partnerships</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-card to-secondary/20 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Influencers</CardTitle>
              <Users className="h-4 w-4 text-dashboard-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalInfluencers}</div>
              <p className="text-xs text-dashboard-success">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary/20 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
              <TrendingUp className="h-4 w-4 text-dashboard-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{(totalFollowers / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-dashboard-success">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary/20 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-dashboard-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-dashboard-success">+24% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-secondary/20 border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Engagement</CardTitle>
              <TrendingUp className="h-4 w-4 text-dashboard-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgEngagement.toFixed(1)}%</div>
              <p className="text-xs text-dashboard-success">+3.2% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Influencer List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Top Ranked Influencers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInfluencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onClick={() => setSelectedInfluencer(influencer)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};