import { InfluencerData, PostData } from '@/components/InfluencerDashboard';
import { loadAllCampaignData, loadAllInfluencerData } from './loadInfluencerData';

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
    rate: parseNumericValue(campaign["RATE"]), // Add rate for each post
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

// Calculate engagement rate from influencer data
const calculateInfluencerEngagementRate = (posts: any[]): number => {
  if (posts.length === 0) return 0;
  
  let totalViews = 0;
  let totalEngagements = 0;
  
  posts.forEach(post => {
    const views = parseNumericValue(post["Platform & post metadata_views"]);
    const likes = parseNumericValue(post["Platform & post metadata_likes"]);
    const comments = parseNumericValue(post["Platform & post metadata_comments"]);
    const shares = parseNumericValue(post["Platform & post metadata_shares"]);
    
    totalViews += views;
    totalEngagements += (likes + comments + shares);
  });
  
  return totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0;
};

// Calculate total impressions from influencer data
const calculateInfluencerImpressions = (posts: any[]): number => {
  return posts.reduce((sum, post) => {
    return sum + parseNumericValue(post["Platform & post metadata_views"]);
  }, 0);
};

// Aggregate post analytics by influencer
const aggregatePostAnalyticsByInfluencer = () => {
  const influencerMap = new Map<string, any[]>();
  const postAnalyticsData = loadAllInfluencerData();
  
  postAnalyticsData.forEach(post => {
    const influencerId = post.InfluencerID;
    if (!influencerMap.has(influencerId)) {
      influencerMap.set(influencerId, []);
    }
    influencerMap.get(influencerId)!.push(post);
  });
  
  return influencerMap;
};

// Function to normalize handle names for Adam Wickens consolidation
const normalizeHandle = (handle: string): string => {
  const cleanHandle = handle.replace('@', '');
  
  // Consolidate all Adam Wickens variations to wickens.wicked.reptiles
  if (cleanHandle.toLowerCase().includes('adam') || 
      cleanHandle.toLowerCase() === 'adam_wickens' ||
      cleanHandle.toLowerCase() === 'adam wickens') {
    return 'wickens.wicked.reptiles';
  }
  
  return cleanHandle;
};

// Transform campaign data to InfluencerData format
export const transformDataToInfluencers = (): InfluencerData[] => {
  const influencerMap = new Map<string, InfluencerData>();
  const postAnalyticsMap = aggregatePostAnalyticsByInfluencer();
  const campaignData = loadAllCampaignData();
  
  // Process campaign data
  campaignData.forEach(campaign => {
    const handle = campaign["HANDLE"] || '';
    const cleanHandle = normalizeHandle(handle);
    
    if (!influencerMap.has(cleanHandle)) {
      const tier = campaign["TIER"] || '';
      let rankType: 'fastest-growing' | 'highest-potential' | 'top-performer' = 'top-performer';
      if (tier.includes('250K+')) rankType = 'top-performer';
      else if (parsePercentage(campaign["ER"]) > 5) rankType = 'highest-potential';
      else rankType = 'fastest-growing';
      
      const baseInfluencer: InfluencerData = {
        id: cleanHandle,
        handle: cleanHandle,
        petParentName: cleanHandle === 'wickens.wicked.reptiles' ? 'Adam Wickens' : (campaign["PET PARENT NAME"] || ''),
        petName: campaign["PET NAME"] || '',
        followerCount: parseNumericValue(campaign["FOLLOWER COUNT"]),
        tier: tier.replace('TIER 1: ', '').replace('TIER 2: ', '').replace('TIER 3: ', ''),
        category: campaign["CATEGORY"] || '',
        partnerType: campaign["PARTNER TYPE"] || '',
        city: campaign["CITY"] || '',
        state: campaign["STATE"] || '',
        platform: campaign["PLATFORM"]?.toLowerCase() || 'instagram',
        engagementRate: 0, // Will be calculated from influencer data
        rate: 0, // Will be sum of all post rates
        rank: Math.floor(Math.random() * 100) + 1,
        rankType,
        recentGrowth: Math.random() * 20 + 5, // Mock growth data
        totalRevenue: 0,
        contentImpressions: 0, // Will be calculated from influencer data
        roas: 0,
        posts: [] // This will contain only campaign posts
      };
      
      influencerMap.set(cleanHandle, baseInfluencer);
    }
    
    const influencer = influencerMap.get(cleanHandle)!;
    const post = transformCampaignToPost(campaign);
    influencer.posts.push(post);
    
    // Update aggregated metrics from campaign data
    influencer.rate += parseNumericValue(campaign["RATE"]); // Sum of all post rates
    influencer.totalRevenue = (influencer.totalRevenue || 0) + post.revenue;
    if (post.revenue > 0 && post.impressions > 0) {
      influencer.roas = (influencer.totalRevenue || 0) / (post.impressions / 1000 * 10); // Rough ROAS calculation
    }
  });
  
  // Update engagement rate and impressions from post analytics data
  postAnalyticsMap.forEach((posts, influencerId) => {
    const normalizedId = influencerId.replace(/[._]/g, '').toLowerCase();
    
    // Try to find matching influencer (basic matching)
    let matchingInfluencer: InfluencerData | undefined;
    
    // Special handling for wickens.wicked.reptiles
    if (normalizedId === 'wickenswickedreptiles' || influencerId === 'wickens.wicked.reptiles') {
      matchingInfluencer = influencerMap.get('wickens.wicked.reptiles');
    } else {
      for (const [key, influencer] of influencerMap.entries()) {
        if (key.toLowerCase().includes(normalizedId) || normalizedId.includes(key.toLowerCase())) {
          matchingInfluencer = influencer;
          break;
        }
      }
    }
    
    if (!matchingInfluencer) {
      // Create new influencer from post analytics data
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
        engagementRate: calculateInfluencerEngagementRate(posts),
        rate: 0, // No campaign data, so no rate
        rank: Math.floor(Math.random() * 100) + 1,
        rankType: 'fastest-growing' as const,
        recentGrowth: Math.random() * 30 + 10,
        totalRevenue: 0,
        contentImpressions: calculateInfluencerImpressions(posts),
        roas: 0,
        posts: [] // No campaign posts for these influencers
      };
      influencerMap.set(influencerId, matchingInfluencer);
    } else {
      // Update existing influencer's engagement rate and impressions from influencer data
      matchingInfluencer.engagementRate = calculateInfluencerEngagementRate(posts);
      matchingInfluencer.contentImpressions = calculateInfluencerImpressions(posts);
    }
  });
  
  return Array.from(influencerMap.values()).map((influencer, index) => ({
    ...influencer,
    rank: index + 1
  }));
};

export const getRealInfluencerData = (): InfluencerData[] => {
  return transformDataToInfluencers();
};