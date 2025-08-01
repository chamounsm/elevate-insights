import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PostData } from './InfluencerDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { Calendar, DollarSign, Eye, TrendingUp, Users, Heart, BarChart3, PieChart as PieChartIcon, Activity, Palette, Target, Volume2, Camera, Brain, Music, Mic, Video, Zap, Star, Store, Dog, Type } from 'lucide-react';
import { loadInfluencerAnalyticsData, calculatePerformanceMetrics, createTimeSeriesData, calculateEngagementBreakdown, calculateAudioProsodyData, calculateVisualContentData, calculateEmotionAffectData, calculateContentQualityData, calculateBrandData, calculatePetTypeData, calculateTrustAuthorityData, calculateOnScreenTextData, calculateVisualStyleProductionData, calculatePredictiveModelingData, ProcessedPostMetrics } from '@/utils/analyticsDataTransformation';

interface PostPerformanceProps {
  posts: PostData[];
  influencerId?: string; // Add influencer ID to filter analytics data
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toLocaleString();
};

const formatCurrency = (num: number) => {
  return `$${num.toFixed(2)}`;
};

export const PostPerformance = ({ posts, influencerId }: PostPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

  // Load real analytics data from influencer posts (filtered by specific influencer)
  const analyticsData = loadInfluencerAnalyticsData(influencerId);
  const performanceMetrics = calculatePerformanceMetrics(analyticsData);
  const timeSeriesData = createTimeSeriesData(analyticsData);
  const engagementBreakdown = calculateEngagementBreakdown(analyticsData);
  const audioProsodyData = calculateAudioProsodyData(influencerId);
  const visualContentData = calculateVisualContentData(influencerId);
  const emotionAffectData = calculateEmotionAffectData(influencerId);
  const contentQualityData = calculateContentQualityData(influencerId);
  const brandData = calculateBrandData(influencerId);
  const petTypeData = calculatePetTypeData(influencerId);
  const trustAuthorityData = calculateTrustAuthorityData(influencerId);
  const onScreenTextData = calculateOnScreenTextData(influencerId);
  const visualStyleProductionData = calculateVisualStyleProductionData(influencerId);
  const predictiveModelingData = calculatePredictiveModelingData(influencerId);

  // Get unique campaigns
  const campaigns = Array.from(new Set(posts.map(post => post.campaign)));
  
  // Filter posts by campaign
  const filteredPosts = selectedCampaign === 'all' 
    ? posts 
    : posts.filter(post => post.campaign === selectedCampaign);

  // Calculate aggregate metrics
  const totalMetrics = filteredPosts.reduce((acc, post) => ({
    impressions: acc.impressions + post.impressions,
    reach: acc.reach + post.reach,
    engagements: acc.engagements + post.engagements,
    revenue: acc.revenue + post.revenue,
    conversions: acc.conversions + post.conversions,
    clicks: acc.clicks + post.clicks,
  }), { impressions: 0, reach: 0, engagements: 0, revenue: 0, conversions: 0, clicks: 0 });

  const avgMetrics = {
    cpm: filteredPosts.reduce((acc, post) => acc + post.cpm, 0) / filteredPosts.length,
    cpe: filteredPosts.reduce((acc, post) => acc + post.cpe, 0) / filteredPosts.length,
    cpa: filteredPosts.reduce((acc, post) => acc + post.cpa, 0) / filteredPosts.length,
    roas: filteredPosts.reduce((acc, post) => acc + post.roas, 0) / filteredPosts.length,
    engagementRate: filteredPosts.reduce((acc, post) => acc + post.engagementRate, 0) / filteredPosts.length,
  };

  // Chart data
  const chartData = filteredPosts.map(post => ({
    date: new Date(post.postDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    impressions: post.impressions / 1000, // Convert to thousands for readability
    engagements: post.engagements,
    revenue: post.revenue,
  }));

  // Real performance metrics data from influencer posts
  const performanceMetricsData = engagementBreakdown;

  const contentTypeData = [
    { name: 'Playful', value: 35, fill: 'hsl(var(--dashboard-primary))' },
    { name: 'Educational', value: 25, fill: 'hsl(var(--dashboard-secondary))' },
    { name: 'Serious', value: 20, fill: 'hsl(var(--dashboard-success))' },
    { name: 'Humorous', value: 20, fill: 'hsl(var(--dashboard-warning))' },
  ];

  const narrativeData = [
    { metric: 'Hook Effectiveness', score: 8.5 },
    { metric: 'Narrative Clarity', score: 7.8 },
    { metric: 'Emotional Resonance', score: 9.2 },
    { metric: 'Story Completion', score: 6.9 },
  ];

  const visualStyleData = [
    { attribute: 'Contrast', value: 75 },
    { attribute: 'Brightness', value: 65 },
    { attribute: 'Saturation', value: 80 },
    { attribute: 'Quality', value: 85 },
    { attribute: 'Composition', value: 70 },
  ];

  // Real Audio & Prosody Data from influencer posts
  const audioData = audioProsodyData.audioToneDistribution;
  const musicTempoData = audioProsodyData.musicTempoDistribution;

  // Real Visual Content Analysis from influencer posts
  const screenTimeData = visualContentData.screenTimeAnalysis;
  const sceneTypeData = visualContentData.sceneTypeDistribution;

  // Real Emotion & Affect Data from influencer posts
  const emotionData = emotionAffectData.topViewerEmotions;
  const arousalData = emotionAffectData.arousalLevels;

  // Real Content Quality Scores from influencer posts
  const qualityScores = contentQualityData.qualityScores;

  const COLORS = ['hsl(var(--dashboard-primary))', 'hsl(var(--dashboard-secondary))', 'hsl(var(--dashboard-success))', 'hsl(var(--dashboard-warning))'];

  return (
    <div className="space-y-6">
      {/* Header with Campaign Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Post Performance</h2>
          <p className="text-muted-foreground">Detailed breakdown of all posts and campaigns</p>
        </div>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaigns.map(campaign => (
              <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Impressions</CardTitle>
            <Eye className="h-4 w-4 text-dashboard-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatNumber(totalMetrics.impressions)}</div>
            <p className="text-xs text-dashboard-success">Across {filteredPosts.length} posts</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Engagements</CardTitle>
            <Heart className="h-4 w-4 text-dashboard-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatNumber(totalMetrics.engagements)}</div>
            <p className="text-xs text-dashboard-success">Avg: {avgMetrics.engagementRate.toFixed(1)}% rate</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-success/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-dashboard-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalMetrics.revenue.toLocaleString()}</div>
            <p className="text-xs text-dashboard-success">Avg ROAS: {avgMetrics.roas.toFixed(2)}x</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-warning/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-dashboard-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalMetrics.conversions}</div>
            <p className="text-xs text-dashboard-success">Avg CPA: {formatCurrency(avgMetrics.cpa)}</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-dashboard-info/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg CPM</CardTitle>
            <Target className="h-4 w-4 text-dashboard-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(avgMetrics.cpm)}</div>
            <p className="text-xs text-dashboard-success">Cost per thousand impressions</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart className="h-5 w-5 text-dashboard-primary" />
            <span>Performance Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="impressions" fill="hsl(var(--dashboard-primary))" name="Impressions (K)" />
                <Bar dataKey="engagements" fill="hsl(var(--dashboard-secondary))" name="Engagements" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Sections */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-dashboard-primary" />
            <span>Advanced Analytics</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Deep dive into content performance, engagement patterns, and optimization insights
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Performance Metrics Section */}
            <AccordionItem value="performance-metrics">
              <AccordionTrigger className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-dashboard-primary" />
                <span>📈 Performance Metrics</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Views Over Time */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Views Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip 
                              formatter={(value) => [`${value}K`, 'Views (K)']}
                            />
                            <Line type="monotone" dataKey="views" stroke="hsl(var(--dashboard-primary))" strokeWidth={2} name="views" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Engagement Breakdown */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Engagement Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceMetricsData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--dashboard-primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Engagement Rate Line Chart */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Engagement Rate Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Engagement Rate']} />
                          <Line type="monotone" dataKey="engagementRate" stroke="hsl(var(--dashboard-success))" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Ratios */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Engagement Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {performanceMetricsData.map((metric, index) => (
                        <div key={metric.name} className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                          <div className="text-lg font-bold text-foreground">{formatNumber(metric.value)}</div>
                          <div className="text-sm text-muted-foreground">{metric.name}</div>
                          <div className="text-xs text-dashboard-success font-medium">{metric.trend}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>


            {/* Brand Analysis Section */}
            <AccordionItem value="brand-analysis">
              <AccordionTrigger className="flex items-center space-x-2">
                <Store className="h-4 w-4 text-dashboard-info" />
                <span>🏪 Brand Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Brand Distribution Chart */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Brand Logo Appearances</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={brandData.brandDistribution}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip formatter={(value, name) => [value, name === 'count' ? 'Appearances' : 'Percentage']} />
                            <Bar dataKey="count" fill="hsl(var(--dashboard-info))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Brand Statistics */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Brand Mentions Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-info/5 rounded-lg">
                          <Store className="h-8 w-8 mx-auto mb-2 text-dashboard-info" />
                          <div className="text-2xl font-bold text-foreground">{brandData.totalBrandMentions}</div>
                          <div className="text-sm text-muted-foreground">Total Brand Appearances</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                          <Target className="h-8 w-8 mx-auto mb-2 text-dashboard-primary" />
                          <div className="text-2xl font-bold text-foreground">{brandData.brandDistribution.length}</div>
                          <div className="text-sm text-muted-foreground">Unique Brands Featured</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Brands List */}
                {brandData.brandDistribution.length > 0 && (
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Top Featured Brands</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {brandData.brandDistribution.slice(0, 6).map((brand, index) => (
                          <div key={brand.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-card to-dashboard-info/5 rounded-lg">
                            <span className="text-sm font-medium">{brand.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{brand.count} times</span>
                              <span className="text-sm font-bold text-dashboard-info">{brand.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Pet Type Analysis Section */}
            <AccordionItem value="pet-type-analysis">
              <AccordionTrigger className="flex items-center space-x-2">
                <Dog className="h-4 w-4 text-dashboard-success" />
                <span>🐕 Pet Type Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pet Breed Distribution Chart */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Pet Breed Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={petTypeData.petBreedDistribution.slice(0, 6)}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                dataKey="count"
                              >
                                {petTypeData.petBreedDistribution.slice(0, 6).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [`${value} appearances`, name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-1">
                          {petTypeData.petBreedDistribution.slice(0, 6).map((breed, index) => (
                            <div key={breed.name} className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-xs font-medium flex-1">{breed.name}</span>
                              <span className="text-xs text-muted-foreground">{breed.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pet Statistics */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Pet Breed Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                          <Dog className="h-8 w-8 mx-auto mb-2 text-dashboard-success" />
                          <div className="text-2xl font-bold text-foreground">{petTypeData.totalPets}</div>
                          <div className="text-sm text-muted-foreground">Total Pet Appearances</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                          <Users className="h-8 w-8 mx-auto mb-2 text-dashboard-primary" />
                          <div className="text-2xl font-bold text-foreground">{petTypeData.petBreedDistribution.length}</div>
                          <div className="text-sm text-muted-foreground">Different Breeds Featured</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Breeds List */}
                {petTypeData.petBreedDistribution.length > 0 && (
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Most Featured Pet Breeds</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {petTypeData.petBreedDistribution.slice(0, 6).map((breed, index) => (
                          <div key={breed.name} className="flex items-center justify-between p-3 bg-gradient-to-r from-card to-dashboard-success/5 rounded-lg">
                            <span className="text-sm font-medium">{breed.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">{breed.count} times</span>
                              <span className="text-sm font-bold text-dashboard-success">{breed.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Trust & Authority Section */}
            <AccordionItem value="trust-authority">
              <AccordionTrigger className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-dashboard-warning" />
                <span>🛡️ Trust & Authority</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Trust Cues Chart */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Trust & Authority Cues</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={trustAuthorityData.trustCues}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="cue" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              fontSize={10}
                            />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Presence']} />
                            <Bar dataKey="percentage" fill="hsl(var(--dashboard-warning))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overall Trust Score */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Trust Score Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-6 bg-gradient-to-br from-card to-dashboard-warning/10 rounded-lg">
                          <Star className="h-12 w-12 mx-auto mb-3 text-dashboard-warning" />
                          <div className="text-3xl font-bold text-foreground">{trustAuthorityData.overallTrustScore}/100</div>
                          <div className="text-sm text-muted-foreground">Overall Trust Score</div>
                        </div>
                        
                        {/* Trust Cue Indicators */}
                        <div className="space-y-2">
                          {trustAuthorityData.trustCues.map((cue, index) => (
                            <div key={cue.cue} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-warning/5 rounded">
                              <span className="text-xs font-medium">{cue.cue}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-muted-foreground">{cue.percentage}%</span>
                                <div className={`w-2 h-2 rounded-full ${cue.present ? 'bg-dashboard-success' : 'bg-muted'}`}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </AccordionContent>
            </AccordionItem>

            {/* On-screen Text & Graphics Section */}
            <AccordionItem value="onscreen-text">
              <AccordionTrigger className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-dashboard-info" />
                <span>📝 On-screen Text & Graphics</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Text Elements Chart */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Text Element Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={onScreenTextData.textElements}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="element" 
                              angle={-45}
                              textAnchor="end"
                              height={80}
                              fontSize={8}
                            />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                            <Bar dataKey="percentage" fill="hsl(var(--dashboard-info))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Product Mentions Overview */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Product Mentions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6 bg-gradient-to-br from-card to-dashboard-info/10 rounded-lg">
                        <Store className="h-12 w-12 mx-auto mb-3 text-dashboard-info" />
                        <div className="text-3xl font-bold text-foreground">{onScreenTextData.textCharacteristics.avgProductMentions}</div>
                        <div className="text-sm text-muted-foreground">Avg Products per Post</div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-info/5 rounded">
                          <span className="text-xs font-medium">CTA Present</span>
                          <span className="text-xs font-bold text-dashboard-info">{onScreenTextData.textCharacteristics.ctaPresence}%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-info/5 rounded">
                          <span className="text-xs font-medium">Subtitles</span>
                          <span className="text-xs font-bold text-dashboard-info">{onScreenTextData.textCharacteristics.subtitlesPresence}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Typography & Text Density */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Typography & Density</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Typography Styles */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Typography Styles</div>
                          <div className="space-y-1">
                            {onScreenTextData.typographyDistribution.slice(0, 3).map((typography) => (
                              <div key={typography.style} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-info/5 rounded text-xs">
                                <span>{typography.style}</span>
                                <span className="font-bold text-dashboard-info">{typography.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Text Density */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Text Density</div>
                          <div className="space-y-1">
                            {onScreenTextData.textCharacteristics.textDensityBreakdown.slice(0, 3).map((density) => (
                              <div key={density.density} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-secondary/5 rounded text-xs">
                                <span>{density.density}</span>
                                <span className="font-bold text-dashboard-secondary">{density.count} posts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Visual Style & Production Section */}
            <AccordionItem value="visual-style">
              <AccordionTrigger className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-dashboard-warning" />
                <span>🎨 Visual Style & Production</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Color Palette Distribution */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Color Palette Usage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={visualStyleProductionData.colorPaletteDistribution.slice(0, 6)}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                dataKey="count"
                              >
                                {visualStyleProductionData.colorPaletteDistribution.slice(0, 6).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name, props) => [`${value} uses (${props.payload.percentage}%)`, props.payload.color]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-1">
                          {visualStyleProductionData.colorPaletteDistribution.slice(0, 6).map((color, index) => (
                            <div key={color.color} className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="text-xs font-medium flex-1">{color.color}</span>
                              <span className="text-xs text-muted-foreground">{color.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lighting & Brightness Analysis */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Lighting & Brightness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Brightness Levels */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Brightness Levels</div>
                          <div className="space-y-1">
                            {visualStyleProductionData.lightingAndBrightness.averageBrightness.map((brightness) => (
                              <div key={brightness.level} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-warning/5 rounded text-xs">
                                <span>{brightness.level}</span>
                                <span className="font-bold text-dashboard-warning">{brightness.count} posts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Lighting Types */}
                        <div>
                          <div className="text-xs font-medium text-muted-foreground mb-2">Lighting Types</div>
                          <div className="space-y-1">
                            {visualStyleProductionData.lightingAndBrightness.lightingType.map((lighting) => (
                              <div key={lighting.type} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-secondary/5 rounded text-xs">
                                <span>{lighting.type}</span>
                                <span className="font-bold text-dashboard-secondary">{lighting.count} posts</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Production Techniques */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Production Techniques</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Technique Usage */}
                        <div className="space-y-3">
                          <div className="text-center p-3 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                            <Video className="h-6 w-6 mx-auto mb-1 text-dashboard-success" />
                            <div className="text-lg font-bold text-foreground">{visualStyleProductionData.productionTechniques.brollUsage}%</div>
                            <div className="text-xs text-muted-foreground">B-roll Usage</div>
                          </div>
                          
                          <div className="text-center p-3 bg-gradient-to-br from-card to-dashboard-info/5 rounded-lg">
                            <Camera className="h-6 w-6 mx-auto mb-1 text-dashboard-info" />
                            <div className="text-lg font-bold text-foreground">{visualStyleProductionData.productionTechniques.splitScreenUsage}%</div>
                            <div className="text-xs text-muted-foreground">Split Screen</div>
                          </div>
                          
                          <div className="text-center p-3 bg-gradient-to-br from-card to-dashboard-accent/5 rounded-lg">
                            <Zap className="h-6 w-6 mx-auto mb-1 text-dashboard-accent" />
                            <div className="text-lg font-bold text-foreground">{visualStyleProductionData.productionTechniques.visualMemesUsage}%</div>
                            <div className="text-xs text-muted-foreground">Visual Memes</div>
                          </div>
                        </div>
                        
                        {/* Color Grading */}
                        {visualStyleProductionData.productionTechniques.colorGradingStyles.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Color Grading</div>
                            <div className="space-y-1">
                              {visualStyleProductionData.productionTechniques.colorGradingStyles.map((grading) => (
                                <div key={grading.style} className="flex items-center justify-between p-2 bg-gradient-to-r from-card to-dashboard-primary/5 rounded text-xs">
                                  <span>{grading.style}</span>
                                  <span className="font-bold text-dashboard-primary">{grading.percentage}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Audio & Prosody Analysis Section */}
            <AccordionItem value="audio-prosody">
              <AccordionTrigger className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-dashboard-primary" />
                <span>🎵 Audio & Prosody Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Audio Tone Distribution */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Audio Tone Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={audioData}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                dataKey="value"
                              >
                                {audioData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-1">
                          {audioData.map((tone, index) => (
                            <div key={tone.name} className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: tone.fill }}
                              ></div>
                              <span className="text-xs font-medium flex-1">{tone.name}</span>
                              <span className="text-xs text-muted-foreground">{tone.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Music Tempo Analysis */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Music Tempo Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={musicTempoData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="tempo" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--dashboard-secondary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Audio Characteristics */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Audio Characteristics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                        <Music className="h-6 w-6 mx-auto mb-2 text-dashboard-primary" />
                        <div className="text-lg font-bold text-foreground">{audioProsodyData.audioCharacteristics.withMusic}%</div>
                        <div className="text-sm text-muted-foreground">With Music</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-secondary/5 rounded-lg">
                        <Mic className="h-6 w-6 mx-auto mb-2 text-dashboard-secondary" />
                        <div className="text-lg font-bold text-foreground">{audioProsodyData.audioCharacteristics.avgSpeakers}</div>
                        <div className="text-sm text-muted-foreground">Avg Speakers</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                        <Volume2 className="h-6 w-6 mx-auto mb-2 text-dashboard-success" />
                        <div className="text-lg font-bold text-foreground">{audioProsodyData.audioCharacteristics.avgSpeechRate}</div>
                        <div className="text-sm text-muted-foreground">Speech Rate</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-warning/5 rounded-lg">
                        <Zap className="h-6 w-6 mx-auto mb-2 text-dashboard-warning" />
                        <div className="text-lg font-bold text-foreground">{audioProsodyData.audioCharacteristics.asmrContent}%</div>
                        <div className="text-sm text-muted-foreground">ASMR Content</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Visual Content Semantics Section */}
            <AccordionItem value="visual-semantics">
              <AccordionTrigger className="flex items-center space-x-2">
                <Camera className="h-4 w-4 text-dashboard-secondary" />
                <span>🎥 Visual Content Semantics</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Screen Time Analysis */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Screen Time Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={screenTimeData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="metric" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                            <Bar dataKey="percentage" fill="hsl(var(--dashboard-primary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Scene Type Distribution */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Primary Scene Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-40">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sceneTypeData}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                dataKey="value"
                              >
                                {sceneTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-1">
                          {sceneTypeData.map((scene, index) => (
                            <div key={scene.name} className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: scene.fill }}
                              ></div>
                              <span className="text-xs font-medium flex-1">{scene.name}</span>
                              <span className="text-xs text-muted-foreground">{scene.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Visual Elements */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Visual Elements & Hooks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                        <Eye className="h-6 w-6 mx-auto mb-2 text-dashboard-primary" />
                        <div className="text-lg font-bold text-foreground">{visualContentData.visualElements.closeUpHooks}%</div>
                        <div className="text-sm text-muted-foreground">Close-up Hooks</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-secondary/5 rounded-lg">
                        <Activity className="h-6 w-6 mx-auto mb-2 text-dashboard-secondary" />
                        <div className="text-lg font-bold text-foreground">{visualContentData.visualElements.actionMovement}%</div>
                        <div className="text-sm text-muted-foreground">Action/Movement</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                        <Users className="h-6 w-6 mx-auto mb-2 text-dashboard-success" />
                        <div className="text-lg font-bold text-foreground">{visualContentData.visualElements.avgPetsPerVideo}</div>
                        <div className="text-sm text-muted-foreground">Avg Pets/Video</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-warning/5 rounded-lg">
                        <Video className="h-6 w-6 mx-auto mb-2 text-dashboard-warning" />
                        <div className="text-lg font-bold text-foreground">{visualContentData.visualElements.avgCutsPerVideo}</div>
                        <div className="text-sm text-muted-foreground">Avg Cuts/Video</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Emotion & Affect Analysis Section */}
            <AccordionItem value="emotion-affect">
              <AccordionTrigger className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-dashboard-success" />
                <span>🧠 Emotion & Affect Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Emotional Response */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Top Viewer Emotions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={emotionData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="emotion" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value}%`, 'Response Rate']} />
                            <Bar dataKey="value" fill="hsl(var(--dashboard-success))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arousal Levels */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Emotional Arousal Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={arousalData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="level" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="hsl(var(--dashboard-warning))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emotional Characteristics */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Emotional Characteristics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                        <Heart className="h-6 w-6 mx-auto mb-2 text-dashboard-success" />
                        <div className="text-lg font-bold text-foreground">{emotionAffectData.emotionalCharacteristics.valenceLevel}</div>
                        <div className="text-sm text-muted-foreground">Valence Level</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                        <Target className="h-6 w-6 mx-auto mb-2 text-dashboard-primary" />
                        <div className="text-lg font-bold text-foreground">{emotionAffectData.emotionalCharacteristics.targetAudience}</div>
                        <div className="text-sm text-muted-foreground">Target Audience</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-secondary/5 rounded-lg">
                        <Brain className="h-6 w-6 mx-auto mb-2 text-dashboard-secondary" />
                        <div className="text-lg font-bold text-foreground">{emotionAffectData.emotionalCharacteristics.empathyStrategy}</div>
                        <div className="text-sm text-muted-foreground">Empathy Strategy</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Content Quality Analysis Section */}
            <AccordionItem value="quality-analysis">
              <AccordionTrigger className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-dashboard-warning" />
                <span>⭐ Content Quality Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                {/* Quality Scores */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Quality Metrics (1-5 Scale)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {qualityScores.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{item.metric}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div 
                                className="bg-dashboard-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-foreground min-w-[2rem]">{item.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quality Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
                    <Star className="h-6 w-6 mx-auto mb-2 text-dashboard-success" />
                    <div className="text-lg font-bold text-foreground">{contentQualityData.overallQuality}</div>
                    <div className="text-sm text-muted-foreground">Overall Quality</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
                    <Target className="h-6 w-6 mx-auto mb-2 text-dashboard-primary" />
                    <div className="text-lg font-bold text-foreground">{contentQualityData.brandFit}</div>
                    <div className="text-sm text-muted-foreground">Brand Fit</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-warning/5 rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-dashboard-warning" />
                    <div className="text-lg font-bold text-foreground">
                      {qualityScores.find(s => s.metric === 'Hook Effectiveness')?.score || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Hook Effectiveness</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Predictive Modeling Section */}
            {predictiveModelingData && (
              <AccordionItem value="predictive-modeling">
                <AccordionTrigger className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-dashboard-success" />
                  <span>📈 Predictive Modeling</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Current vs Predicted Metrics */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Performance Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Engagement Rate */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Engagement Rate</div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">Current</span>
                              <span className="text-sm font-bold">{predictiveModelingData.currentMetrics.engagementRate.toFixed(2)}%</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs">Predicted</span>
                              <span className="text-sm font-bold text-dashboard-success">{predictiveModelingData.predictions.engagementRate.toFixed(2)}%</span>
                            </div>
                            <div className="text-xs text-center p-2 bg-gradient-to-r from-card to-dashboard-success/10 rounded">
                              <span className={predictiveModelingData.predictions.engagementGrowth >= 0 ? 'text-dashboard-success' : 'text-dashboard-danger'}>
                                {predictiveModelingData.predictions.engagementGrowth >= 0 ? '+' : ''}{predictiveModelingData.predictions.engagementGrowth.toFixed(1)}% Growth
                              </span>
                            </div>
                          </div>
                          
                          {/* Average Views */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Average Views</div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs">Current</span>
                              <span className="text-sm font-bold">{formatNumber(Math.round(predictiveModelingData.currentMetrics.avgViews))}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs">Predicted</span>
                              <span className="text-sm font-bold text-dashboard-success">{formatNumber(Math.round(predictiveModelingData.predictions.views))}</span>
                            </div>
                            <div className="text-xs text-center p-2 bg-gradient-to-r from-card to-dashboard-success/10 rounded">
                              <span className={predictiveModelingData.predictions.viewsGrowth >= 0 ? 'text-dashboard-success' : 'text-dashboard-danger'}>
                                {predictiveModelingData.predictions.viewsGrowth >= 0 ? '+' : ''}{predictiveModelingData.predictions.viewsGrowth.toFixed(1)}% Growth
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Growth Potential & Confidence */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-sm">Growth Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Growth Potential */}
                          <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/10 rounded-lg">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-dashboard-success" />
                            <div className="text-sm font-medium text-muted-foreground">Growth Percentile</div>
                            <div className="text-2xl font-bold text-foreground">{predictiveModelingData.growthPotential.percentile.toFixed(0)}th</div>
                            <Badge variant="secondary" className="mt-2">{predictiveModelingData.growthPotential.category}</Badge>
                          </div>
                          
                          {/* Prediction Confidence */}
                          <div className="space-y-2">
                            <div className="text-xs font-medium text-muted-foreground">Prediction Confidence</div>
                            <div className={`text-center p-3 rounded-lg ${
                              predictiveModelingData.confidence.level === 'high' ? 'bg-dashboard-success/10' :
                              predictiveModelingData.confidence.level === 'medium' ? 'bg-dashboard-warning/10' :
                              'bg-dashboard-danger/10'
                            }`}>
                              <div className="text-lg font-bold capitalize">{predictiveModelingData.confidence.level}</div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span>Engagement Models</span>
                                <span className={predictiveModelingData.confidence.modelAgreement.engagement ? 'text-dashboard-success' : 'text-dashboard-warning'}>
                                  {predictiveModelingData.confidence.modelAgreement.engagement ? 'Agree' : 'Disagree'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span>Views Models</span>
                                <span className={predictiveModelingData.confidence.modelAgreement.views ? 'text-dashboard-success' : 'text-dashboard-warning'}>
                                  {predictiveModelingData.confidence.modelAgreement.views ? 'Agree' : 'Disagree'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 1-Month Prediction Visualization */}
                    <Card className="border border-border/50">
                      <CardHeader>
                        <CardTitle className="text-sm">1-Month Prediction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Views Prediction Bar */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Views Comparison</div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs w-16">Current</span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div 
                                    className="bg-dashboard-secondary h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: '50%' }}
                                  >
                                    <span className="text-xs font-bold">{formatNumber(Math.round(predictiveModelingData.currentMetrics.avgViews))}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs w-16">1 Month</span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div 
                                    className="bg-dashboard-success h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min(100, 50 * (1 + predictiveModelingData.predictions.viewsGrowth / 100))}%` }}
                                  >
                                    <span className="text-xs font-bold">{formatNumber(Math.round(predictiveModelingData.predictions.views))}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Engagement Rate Prediction Bar */}
                          <div>
                            <div className="text-xs font-medium text-muted-foreground mb-2">Engagement Rate</div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs w-16">Current</span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div 
                                    className="bg-dashboard-secondary h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min(100, predictiveModelingData.currentMetrics.engagementRate * 10)}%` }}
                                  >
                                    <span className="text-xs font-bold">{predictiveModelingData.currentMetrics.engagementRate.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs w-16">1 Month</span>
                                <div className="flex-1 bg-muted rounded-full h-6 relative">
                                  <div 
                                    className="bg-dashboard-success h-6 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${Math.min(100, predictiveModelingData.predictions.engagementRate * 10)}%` }}
                                  >
                                    <span className="text-xs font-bold">{predictiveModelingData.predictions.engagementRate.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Model Details */}
                          <div className="text-xs text-muted-foreground text-center p-2 bg-gradient-to-r from-card to-dashboard-info/5 rounded">
                            Average of LightGBM & Random Forest predictions
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Growth Insights */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Growth Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gradient-to-r from-card to-dashboard-info/5 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Eye className="h-4 w-4 text-dashboard-info" />
                            <span className="text-sm font-medium">Views Trajectory</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {predictiveModelingData.predictions.viewsGrowth > 50 ? 'Exceptional growth expected' :
                             predictiveModelingData.predictions.viewsGrowth > 20 ? 'Strong growth trajectory' :
                             predictiveModelingData.predictions.viewsGrowth > 0 ? 'Steady growth projected' :
                             'Stable performance expected'}
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-card to-dashboard-success/5 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Heart className="h-4 w-4 text-dashboard-success" />
                            <span className="text-sm font-medium">Engagement Outlook</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {predictiveModelingData.predictions.engagementGrowth > 10 ? 'Highly engaging content trend' :
                             predictiveModelingData.predictions.engagementGrowth > 5 ? 'Improving audience connection' :
                             predictiveModelingData.predictions.engagementGrowth > 0 ? 'Maintaining engagement levels' :
                             'Focus on engagement strategies'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </CardContent>
      </Card>

      {/* Detailed Posts Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-dashboard-info" />
            <span>Post Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Content Type</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Engagements</TableHead>
                  <TableHead>ER%</TableHead>
                  <TableHead>Conversions</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>ROAS</TableHead>
                  <TableHead>CPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      {new Date(post.postDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.campaign}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{post.contentType}</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {post.rate ? `$${post.rate.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>{formatNumber(post.impressions)}</TableCell>
                    <TableCell>{formatNumber(post.engagements)}</TableCell>
                    <TableCell className="text-dashboard-primary font-semibold">
                      {post.engagementRate.toFixed(1)}%
                    </TableCell>
                    <TableCell>{post.conversions}</TableCell>
                    <TableCell className="text-dashboard-success font-semibold">
                      ${post.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className={post.roas >= 1 ? "text-dashboard-success" : "text-dashboard-warning"}>
                      {post.roas.toFixed(2)}x
                    </TableCell>
                    <TableCell>{formatCurrency(post.cpa)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
