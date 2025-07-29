import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PostData } from './InfluencerDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, DollarSign, Eye, TrendingUp, Users, Heart } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Cost Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-dashboard-success" />
            <span>Cost & Performance Breakdown</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-primary/5 rounded-lg">
              <div className="text-lg font-bold text-foreground">{formatCurrency(avgMetrics.cpm)}</div>
              <div className="text-sm text-muted-foreground">Avg CPM</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-secondary/5 rounded-lg">
              <div className="text-lg font-bold text-foreground">{formatCurrency(avgMetrics.cpe)}</div>
              <div className="text-sm text-muted-foreground">Avg CPE</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-warning/5 rounded-lg">
              <div className="text-lg font-bold text-foreground">{formatCurrency(avgMetrics.cpa)}</div>
              <div className="text-sm text-muted-foreground">Avg CPA</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-card to-dashboard-success/5 rounded-lg">
              <div className="text-lg font-bold text-foreground">{avgMetrics.roas.toFixed(2)}x</div>
              <div className="text-sm text-muted-foreground">Avg ROAS</div>
            </div>
          </div>
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