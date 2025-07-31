import { InfluencerData, PostData } from '@/components/InfluencerDashboard';
import campaignData from '@/data/campaignData.json';
import postAnalyticsData from '@/data/postAnalyticsData.json';

// Utility function to parse numeric values from strings
const parseNumericValue = (value: string | number | null): number => {
  if (typeof value === 'number') return value;
  if (!value || value === null) return 0;
  
  const str = String(value).replace(/[$,\s]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

// Utility function to parse percentage values
const parsePercentage = (value: string | number | null): number => {
  if (typeof value === 'number') return value;
  if (!value || value === null) return 0;
  
  const str = String(value).replace(/[%\s]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

// Transform campaign data to PostData format
const transformCampaignToPost = (campaign: any): PostData => {
  const impressions = parseNumericValue(campaign["TOTAL IMPRESSIONS"]);
  const engagements = parseNumericValue(campaign["TOTAL ENGAGEMENTS"]);
  
  return {
    id: campaign["CAMPAIGN POST NUMBER"] || `post-${Math.random()}`,
    campaign: campaign["CAMPAIGN"] || '',
    postDate: campaign["POST DATE"] || '',
    platform: campaign["PLATFORM"]?.toLowerCase() || 'instagram',
    contentType: campaign["CONTENT TYPE"] || '',
    impressions,
    reach: parseNumericValue(campaign["ACCOUNTS REACHED"]) || impressions,
    engagements,
    likes: parseNumericValue(campaign["TOTAL LIKES "]),
    comments: parseNumericValue(campaign["TOTAL COMMENTS "]),
    shares: parseNumericValue(campaign["TOTAL SHARES "]),
    saves: parseNumericValue(campaign["TOTAL SAVES "]),
    clicks: parseNumericValue(campaign["TOTAL CLICKS "]),
    revenue: parseNumericValue(campaign["TOTAL REVENUE"]),
    conversions: parseNumericValue(campaign["TOTAL CONVERSIONS"]),
    roas: parseNumericValue(campaign["ROAS ($)"]),
    cpm: parseNumericValue(campaign["CPM"]),
    cpe: parseNumericValue(campaign["CPE "]),
    cpa: parseNumericValue(campaign["CPA"]),
    engagementRate: parsePercentage(campaign["ER"]),
  };
};

// Transform post analytics data to PostData format
const transformPostAnalyticsToPost = (post: any): PostData => {
  const views = parseNumericValue(post["Platform & post metadata_views"]);
  const likes = parseNumericValue(post["Platform & post metadata_likes"]);
  const comments = parseNumericValue(post["Platform & post metadata_comments"]);
  const shares = parseNumericValue(post["Platform & post metadata_shares"]);
  const engagements = likes + comments + shares;
  
  return {
    id: post["video_id"] || `post-${Math.random()}`,
    campaign: 'Organic Content',
    postDate: post["date"] || '',
    platform: 'tiktok',
    contentType: 'video',
    impressions: views,
    reach: views, // Using views as reach for TikTok
    engagements,
    likes,
    comments,
    shares,
    saves: 0, // Not available in this dataset
    clicks: 0, // Not available in this dataset
    revenue: 0, // Not available in this dataset
    conversions: 0, // Not available in this dataset
    roas: 0, // Not available in this dataset
    cpm: 0, // Not available in this dataset
    cpe: views > 0 ? engagements / views * 1000 : 0, // Cost per engagement estimate
    cpa: 0, // Not available in this dataset
    engagementRate: parsePercentage(post["Platform & post metadata_engagement_rate"]) * 100,
  };
};

// Aggregate post analytics by influencer
const aggregatePostAnalyticsByInfluencer = () => {
  const influencerMap = new Map<string, any[]>();
  
  postAnalyticsData.forEach(post => {
    const influencerId = post.InfluencerID;
    if (!influencerMap.has(influencerId)) {
      influencerMap.set(influencerId, []);
    }
    influencerMap.get(influencerId)!.push(post);
  });
  
  return influencerMap;
};

// Transform campaign data to InfluencerData format
export const transformDataToInfluencers = (): InfluencerData[] => {
  const influencerMap = new Map<string, InfluencerData>();
  const postAnalyticsMap = aggregatePostAnalyticsByInfluencer();
  
  // Process campaign data
  campaignData.forEach(campaign => {
    const handle = campaign["HANDLE"] || '';
    const cleanHandle = handle.replace('@', '');
    
    if (!influencerMap.has(cleanHandle)) {
      const tier = campaign["TIER"] || '';
      let rankType: 'fastest-growing' | 'highest-potential' | 'top-performer' = 'top-performer';
      if (tier.includes('250K+')) rankType = 'top-performer';
      else if (parsePercentage(campaign["ER"]) > 5) rankType = 'highest-potential';
      else rankType = 'fastest-growing';
      
      const baseInfluencer: InfluencerData = {
        id: cleanHandle,
        handle: cleanHandle,
        petParentName: campaign["PET PARENT NAME"] || '',
        petName: campaign["PET NAME"] || '',
        followerCount: parseNumericValue(campaign["FOLLOWER COUNT"]),
        tier: tier.replace('TIER 1: ', '').replace('TIER 2: ', '').replace('TIER 3: ', ''),
        category: campaign["CATEGORY"] || '',
        partnerType: campaign["PARTNER TYPE"] || '',
        city: campaign["CITY"] || '',
        state: campaign["STATE"] || '',
        platform: campaign["PLATFORM"]?.toLowerCase() || 'instagram',
        engagementRate: parsePercentage(campaign["ER"]),
        rate: parseNumericValue(campaign["RATE"]),
        rank: Math.floor(Math.random() * 100) + 1,
        rankType,
        recentGrowth: Math.random() * 20 + 5, // Mock growth data
        totalRevenue: 0,
        contentImpressions: 0,
        roas: 0,
        posts: []
      };
      
      influencerMap.set(cleanHandle, baseInfluencer);
    }
    
    const influencer = influencerMap.get(cleanHandle)!;
    const post = transformCampaignToPost(campaign);
    influencer.posts.push(post);
    
    // Update aggregated metrics
    influencer.totalRevenue = (influencer.totalRevenue || 0) + post.revenue;
    influencer.contentImpressions = (influencer.contentImpressions || 0) + post.impressions;
    if (post.revenue > 0 && (influencer.contentImpressions || 0) > 0) {
      influencer.roas = (influencer.totalRevenue || 0) / ((influencer.contentImpressions || 0) / 1000 * 10); // Rough ROAS calculation
    }
  });
  
  // Add post analytics data for matching influencers
  postAnalyticsMap.forEach((posts, influencerId) => {
    const normalizedId = influencerId.replace(/[._]/g, '').toLowerCase();
    
    // Try to find matching influencer (basic matching)
    let matchingInfluencer: InfluencerData | undefined;
    for (const [key, influencer] of influencerMap.entries()) {
      if (key.toLowerCase().includes(normalizedId) || normalizedId.includes(key.toLowerCase())) {
        matchingInfluencer = influencer;
        break;
      }
    }
    
    if (!matchingInfluencer) {
      // Create new influencer from post analytics data
      const firstPost = posts[0];
      matchingInfluencer = {
        id: influencerId,
        handle: influencerId,
        petParentName: influencerId.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        petName: 'Pet',
        followerCount: Math.floor(Math.random() * 100000) + 50000, // Mock follower count
        tier: '50K+',
        category: 'Pet Owner',
        partnerType: 'NEW',
        city: 'Unknown',
        state: 'Unknown',
        platform: 'tiktok',
        engagementRate: 0,
        rate: Math.floor(Math.random() * 1000) + 200,
        rank: Math.floor(Math.random() * 100) + 1,
        rankType: 'fastest-growing' as const,
        recentGrowth: Math.random() * 30 + 10,
        totalRevenue: 0,
        contentImpressions: 0,
        roas: 0,
        posts: []
      };
      influencerMap.set(influencerId, matchingInfluencer);
    }
    
    // Add transformed posts and calculate averages
    const transformedPosts = posts.map(transformPostAnalyticsToPost);
    matchingInfluencer.posts.push(...transformedPosts);
    
    // Calculate average engagement rate from post analytics
    const avgEngagement = transformedPosts.reduce((sum, post) => sum + post.engagementRate, 0) / transformedPosts.length;
    if (avgEngagement > 0) {
      matchingInfluencer.engagementRate = Math.max(matchingInfluencer.engagementRate || 0, avgEngagement);
    }
    
    // Update impressions
    matchingInfluencer.contentImpressions = (matchingInfluencer.contentImpressions || 0) + transformedPosts.reduce((sum, post) => sum + post.impressions, 0);
  });
  
  return Array.from(influencerMap.values()).map((influencer, index) => ({
    ...influencer,
    rank: index + 1
  }));
};

export const getRealInfluencerData = (): InfluencerData[] => {
  return transformDataToInfluencers();
};