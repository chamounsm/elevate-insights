import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Users, DollarSign } from 'lucide-react';
import { InfluencerDetail } from './InfluencerDetail';
import { InfluencerListControls, FilterSortState } from './InfluencerListControls';
import { InfluencerList } from './InfluencerList';
import { ChatBot } from './ChatBot';
import { getRealInfluencerData } from '@/utils/dataTransformation';

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
  rate?: number;
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
  rankType: 'trending-up' | 'trending-down';
  // Metrics
  contentImpressions?: number;
  accountsReached?: number;
  totalEngagements?: number;
  totalRevenue?: number;
  engagementRate?: number;
  roas?: number;
  cpa?: number;
  recentGrowth?: number;
  avgViews?: number;
  cpe?: number;
  cpv?: number;
  aov?: number;
  posts: PostData[];
  // Predictive metrics
  predictedEngagementRate?: number;
  predictedViews?: number;
  engagementGrowthPotential?: number;
  viewsGrowthPotential?: number;
  predictionConfidence?: 'high' | 'medium' | 'low';
  growthPercentile?: number;
  erLgbmPrediction?: number;
  erChangeAbsolute?: number;
}

// Real data is now loaded from JSON files via getRealInfluencerData()

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
    sortBy: 'erLgbmPrediction',
    sortOrder: 'desc'
  });

  // Get real influencer data
  const realInfluencerData = getRealInfluencerData();

  const totalInfluencers = realInfluencerData.length;
  const totalFollowers = realInfluencerData.reduce((sum, inf) => sum + inf.followerCount, 0);
  const totalRevenue = realInfluencerData.reduce((sum, inf) => sum + (inf.totalRevenue || 0), 0);
  const avgEngagement = realInfluencerData.reduce((sum, inf) => sum + (inf.engagementRate || 0), 0) / realInfluencerData.length;

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
                    influencers={realInfluencerData}
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
                    influencers={realInfluencerData}
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