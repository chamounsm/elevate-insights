import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { InfluencerDetail } from './InfluencerDetail';
import { InfluencerListControls, FilterSortState } from './InfluencerListControls';
import { InfluencerList } from './InfluencerList';
import { ChatBot } from './ChatBot';

export interface PostData {
  id: string;
  campaign: string;
  postDate: string;
  contentType: string;
  platform: string;
  impressions: number;
  reach: number;
  engagements: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpm: number;
  cpe: number;
  cpa: number;
  roas: number;
  engagementRate: number;
}

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
  posts: PostData[];
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
    recentGrowth: 15.2,
    posts: [
      {
        id: 'p1',
        campaign: 'Chewpanions',
        postDate: '2025-02-22',
        contentType: 'IG REEL',
        platform: 'INSTAGRAM',
        impressions: 2200000,
        reach: 1303407,
        engagements: 109749,
        likes: 104000,
        comments: 783,
        shares: 1970,
        saves: 2996,
        clicks: 0,
        conversions: 75,
        revenue: 3219,
        cpm: 5.0,
        cpe: 0.09,
        cpa: 133.33,
        roas: 0.32,
        engagementRate: 4.99
      }
    ]
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
    recentGrowth: 22.8,
    posts: [
      {
        id: 'p2',
        campaign: 'Summer Campaign',
        postDate: '2025-02-15',
        contentType: 'TIKTOK VIDEO',
        platform: 'TIKTOK',
        impressions: 1800000,
        reach: 950000,
        engagements: 95000,
        likes: 89000,
        comments: 3200,
        shares: 1800,
        saves: 1000,
        clicks: 450,
        conversions: 44,
        revenue: 4200,
        cpm: 4.7,
        cpe: 0.18,
        cpa: 95.45,
        roas: 0.49,
        engagementRate: 6.2
      }
    ]
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
    recentGrowth: 8.5,
    posts: [
      {
        id: 'p3',
        campaign: 'Chewpanions',
        postDate: '2025-02-10',
        contentType: 'IG STORY',
        platform: 'INSTAGRAM',
        impressions: 800000,
        reach: 450000,
        engagements: 52000,
        likes: 48000,
        comments: 2100,
        shares: 890,
        saves: 1010,
        clicks: 320,
        conversions: 71,
        revenue: 5500,
        cpm: 7.5,
        cpe: 0.15,
        cpa: 76.92,
        roas: 0.92,
        engagementRate: 7.8
      },
      {
        id: 'p4',
        campaign: 'Holiday Promo',
        postDate: '2025-01-28',
        contentType: 'IG REEL',
        platform: 'INSTAGRAM',
        impressions: 400000,
        reach: 230000,
        engagements: 26000,
        likes: 24500,
        comments: 890,
        shares: 410,
        saves: 200,
        clicks: 180,
        conversions: 15,
        revenue: 900,
        cpm: 6.0,
        cpe: 0.12,
        cpa: 60.0,
        roas: 1.15,
        engagementRate: 6.5
      }
    ]
  }
];

export const InfluencerDashboard = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [leftListFilter, setLeftListFilter] = useState<FilterSortState>({
    searchTerm: '',
    tierFilter: 'all',
    partnerTypeFilter: 'all',
    platformFilter: 'all',
    sortBy: 'rank',
    sortOrder: 'asc'
  });

  const [rightListFilter, setRightListFilter] = useState<FilterSortState>({
    searchTerm: '',
    tierFilter: 'all',
    partnerTypeFilter: 'all',
    platformFilter: 'all',
    sortBy: 'rank',
    sortOrder: 'asc'
  });

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
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Influencer Dashboard</h1>
            <p className="text-muted-foreground">Manage and track your influencer partnerships</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="chatbot">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="mt-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

            {/* Dual Influencer Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left List */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <InfluencerListControls
                    title="Influencer List A"
                    filterSort={leftListFilter}
                    onFilterSortChange={setLeftListFilter}
                  />
                </CardHeader>
                <CardContent>
                  <InfluencerList
                    influencers={mockInfluencers}
                    filterSort={leftListFilter}
                    onInfluencerClick={setSelectedInfluencer}
                  />
                </CardContent>
              </Card>

              {/* Right List */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <InfluencerListControls
                    title="Influencer List B"
                    filterSort={rightListFilter}
                    onFilterSortChange={setRightListFilter}
                  />
                </CardHeader>
                <CardContent>
                  <InfluencerList
                    influencers={mockInfluencers}
                    filterSort={rightListFilter}
                    onInfluencerClick={setSelectedInfluencer}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="chatbot" className="mt-6">
            <ChatBot />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};