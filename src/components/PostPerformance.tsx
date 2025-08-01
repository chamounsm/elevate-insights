import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PostData } from './InfluencerDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';
import { Calendar, DollarSign, Eye, TrendingUp, Users, Heart, BarChart3, PieChart as PieChartIcon, Activity, Palette, Target } from 'lucide-react';

interface PostPerformanceProps {
  posts: PostData[];
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

export const PostPerformance = ({ posts }: PostPerformanceProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');

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

  // Sample data for advanced analytics (in real app, this would come from API)
  const performanceMetricsData = [
    { name: 'Views', value: 15600, trend: '+12%' },
    { name: 'Likes', value: 2340, trend: '+8%' },
    { name: 'Comments', value: 456, trend: '+15%' },
    { name: 'Shares', value: 234, trend: '+22%' },
  ];

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
                  {/* Views & Engagement Trends */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Views & Engagement Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="impressions" stroke="hsl(var(--dashboard-primary))" strokeWidth={2} />
                            <Line type="monotone" dataKey="engagements" stroke="hsl(var(--dashboard-secondary))" strokeWidth={2} />
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
                        <LineChart data={filteredPosts.map(post => ({
                          date: new Date(post.postDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                          engagementRate: post.engagementRate
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value}%`, 'Engagement Rate']} />
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

            {/* Content Type & Tone Section */}
            <AccordionItem value="content-tone">
              <AccordionTrigger className="flex items-center space-x-2">
                <PieChartIcon className="h-4 w-4 text-dashboard-secondary" />
                <span>🎭 Content Type, Format & Tone</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tone Distribution */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Content Tone Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={contentTypeData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {contentTypeData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Type Breakdown */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Primary Scene Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Home', value: 45 },
                            { name: 'Outdoor', value: 30 },
                            { name: 'Studio', value: 15 },
                            { name: 'Travel', value: 10 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--dashboard-secondary))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 justify-center">
                  {contentTypeData.map((item, index) => (
                    <div key={item.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-muted-foreground">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Narrative Analysis Section */}
            <AccordionItem value="narrative-analysis">
              <AccordionTrigger className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-dashboard-success" />
                <span>🧠 Narrative Strength & Hook Analysis</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Narrative Scores */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Narrative Performance Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={narrativeData} layout="horizontal">
                            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                            <XAxis type="number" domain={[0, 10]} />
                            <YAxis dataKey="metric" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="score" fill="hsl(var(--dashboard-success))" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hook Effectiveness Heatmap */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Content Quality Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {narrativeData.map((item, index) => (
                          <div key={item.metric} className="flex items-center justify-between p-3 bg-gradient-to-r from-card to-dashboard-success/5 rounded-lg">
                            <span className="text-sm font-medium">{item.metric}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-dashboard-success transition-all"
                                  style={{ width: `${(item.score / 10) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-bold text-dashboard-success">{item.score}/10</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Visual Style Section */}
            <AccordionItem value="visual-style">
              <AccordionTrigger className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-dashboard-warning" />
                <span>🎨 Visual Style & Production</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Radar Chart for Visual Attributes */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Visual Style Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={visualStyleData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="attribute" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar
                              name="Score"
                              dataKey="value"
                              stroke="hsl(var(--dashboard-warning))"
                              fill="hsl(var(--dashboard-warning))"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quality Score Breakdown */}
                  <Card className="border border-border/50">
                    <CardHeader>
                      <CardTitle className="text-sm">Production Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {visualStyleData.map((item, index) => (
                          <div key={item.attribute} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.attribute}</span>
                              <span className="text-dashboard-warning font-semibold">{item.value}/100</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-dashboard-warning transition-all"
                                style={{ width: `${item.value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
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
