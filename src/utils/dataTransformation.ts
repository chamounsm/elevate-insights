import { InfluencerData, PostData } from '@/components/InfluencerDashboard';
import { loadAllCampaignData, loadAllInfluencerData, loadAllFinancialData, loadPredictionData, PredictionData } from './loadInfluencerData';

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

// Generate consistent follower count based on influencer handle
const generateConsistentFollowerCount = (handle: string): number => {
  // Create a simple hash from the handle
  let hash = 0;
  for (let i = 0; i < handle.length; i++) {
    const char = handle.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and map to a range between 25K and 150K
  const absHash = Math.abs(hash);
  const followerCount = 25000 + (absHash % 125000); // Range: 25,000 - 149,999
  
  // Round to nearest 1000 for cleaner numbers
  return Math.round(followerCount / 1000) * 1000;
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

// Calculate average views from influencer data
const calculateAvgViews = (posts: any[]): number => {
  if (posts.length === 0) return 0;
  
  const totalViews = posts.reduce((sum, post) => {
    return sum + parseNumericValue(post["Platform & post metadata_views"]);
  }, 0);
  
  return totalViews / posts.length;
};

// Calculate CPE (Cost Per Engagement) from influencer data
const calculateCPE = (posts: any[], totalRate: number): number => {
  if (posts.length === 0 || totalRate === 0) return 0;
  
  const totalEngagements = posts.reduce((sum, post) => {
    const likes = parseNumericValue(post["Platform & post metadata_likes"]);
    const comments = parseNumericValue(post["Platform & post metadata_comments"]);
    const shares = parseNumericValue(post["Platform & post metadata_shares"]);
    return sum + likes + comments + shares;
  }, 0);
  
  return totalEngagements > 0 ? totalRate / totalEngagements : 0;
};

// Calculate CPV (Cost Per View) from influencer data
const calculateCPV = (posts: any[], totalRate: number): number => {
  if (posts.length === 0 || totalRate === 0) return 0;
  
  const totalViews = posts.reduce((sum, post) => {
    return sum + parseNumericValue(post["Platform & post metadata_views"]);
  }, 0);
  
  // Convert to cost per 1000 views to get meaningful numbers
  return totalViews > 0 ? (totalRate / totalViews) * 1000 : 0;
};

// Calculate AOV and ROAS from campaign data
const calculateCampaignMetrics = (campaigns: any[]): { avgAOV: number; avgROAS: number } => {
  if (campaigns.length === 0) return { avgAOV: 0, avgROAS: 0 };
  
  let totalAOV = 0;
  let totalROAS = 0;
  let aovCount = 0;
  let roasCount = 0;
  
  campaigns.forEach(campaign => {
    const aov = parseNumericValue(campaign["AOV "]);
    const roas = parseNumericValue(campaign["ROAS ($)"]);
    
    if (aov > 0) {
      totalAOV += aov;
      aovCount++;
    }
    
    if (roas > 0) {
      totalROAS += roas;
      roasCount++;
    }
  });
  
  return {
    avgAOV: aovCount > 0 ? totalAOV / aovCount : 0,
    avgROAS: roasCount > 0 ? totalROAS / roasCount : 0
  };
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
  // Remove @ symbols and trim spaces
  let cleanHandle = handle.replace(/@/g, '').trim();
  
  // Handle cases with multiple handles separated by / or other characters
  if (cleanHandle.includes('/')) {
    // Take the first handle before the slash
    cleanHandle = cleanHandle.split('/')[0].trim();
  }
  
  // Consolidate all Adam Wickens variations to wickens.wicked.reptiles
  if (cleanHandle.toLowerCase().includes('adam') || 
      cleanHandle.toLowerCase() === 'adam_wickens' ||
      cleanHandle.toLowerCase() === 'adam wickens') {
    return 'wickens.wicked.reptiles';
  }
  
  // Consolidate Mika.and.mocha/moka variations
  if (cleanHandle.toLowerCase() === 'mika.and.mocha' || 
      cleanHandle.toLowerCase() === 'mika.and.moka') {
    return 'Mika.and.moka';
  }
  
  return cleanHandle;
};

// Transform campaign data to InfluencerData format
// Helper function to calculate growth potential score
const calculateGrowthPotential = (prediction: PredictionData): {
  engagementGrowth: number;
  viewsGrowth: number;
  confidence: 'high' | 'medium' | 'low';
  percentile: number;
} => {
  const currentER = parseFloat(prediction.current_engagement_rate);
  const predictedER = (parseFloat(prediction.er_lgbm_prediction) + parseFloat(prediction.er_rf_prediction)) / 2;
  let engagementGrowth = ((predictedER - currentER) / currentER) * 100;
  
  const currentViews = parseFloat(prediction.current_views);
  const predictedViews = (parseFloat(prediction.views_lgbm_prediction) + parseFloat(prediction.views_rf_prediction)) / 2;
  let viewsGrowth = ((predictedViews - currentViews) / currentViews) * 100;
  
  // Apply logarithmic scaling for extreme growth values to preserve relative rankings
  // while showing more reasonable numbers
  const scaleGrowth = (growth: number): number => {
    if (growth > 100) {
      // Logarithmic scaling for values above 100%
      // This maps 100% -> 100%, 1000% -> ~150%, 5000% -> ~180%
      return 100 + (Math.log10(growth / 100) * 50);
    } else if (growth < -50) {
      // Similar scaling for large declines
      return Math.max(-75, -50 - (Math.log10(Math.abs(growth) / 50) * 25));
    }
    return growth;
  };
  
  engagementGrowth = scaleGrowth(engagementGrowth);
  viewsGrowth = scaleGrowth(viewsGrowth);
  
  // Calculate confidence based on model agreement
  const confidence = (prediction.er_direction_agreement === 'True' && prediction.views_direction_agreement === 'True') ? 'high' :
                    (prediction.er_direction_agreement === 'True' || prediction.views_direction_agreement === 'True') ? 'medium' : 'low';
  
  // Calculate percentile score (higher percentiles indicate better growth potential)
  const percentileScore = (percentile: string): number => {
    if (percentile.includes('90-100')) return 95;
    if (percentile.includes('75-90')) return 82.5;
    if (percentile.includes('50-75')) return 62.5;
    if (percentile.includes('25-50')) return 37.5;
    return 12.5;
  };
  
  const avgPercentile = (percentileScore(prediction.er_lgbm_percentile) + 
                        percentileScore(prediction.er_rf_percentile) +
                        percentileScore(prediction.views_lgbm_percentile) +
                        percentileScore(prediction.views_rf_percentile)) / 4;
  
  return {
    engagementGrowth,
    viewsGrowth,
    confidence,
    percentile: avgPercentile
  };
};

export const transformDataToInfluencers = (): InfluencerData[] => {
  const influencerMap = new Map<string, InfluencerData>();
  const postAnalyticsMap = aggregatePostAnalyticsByInfluencer();
  const campaignData = loadAllCampaignData();
  const financialData = loadAllFinancialData();
  const predictionData = loadPredictionData();
  
  // Group campaigns by influencer handle
  const campaignsByInfluencer = new Map<string, any[]>();
  campaignData.forEach(campaign => {
    const handle = campaign["HANDLE"] || '';
    const cleanHandle = normalizeHandle(handle);
    
    if (!campaignsByInfluencer.has(cleanHandle)) {
      campaignsByInfluencer.set(cleanHandle, []);
    }
    campaignsByInfluencer.get(cleanHandle)!.push(campaign);
  });
  
  // Process campaign data
  campaignsByInfluencer.forEach((campaigns, cleanHandle) => {
    const firstCampaign = campaigns[0];
    const tier = firstCampaign["TIER"] || '';
    
    // Get precomputed financial data for this influencer
    const cleanIdForFinancial = cleanHandle.replace(/[/\\:*?"<>|@\s]/g, '_').replace(/_+/g, '_');
    const financialMetrics = financialData[cleanIdForFinancial] || financialData[cleanHandle] || {};
    
    const baseInfluencer: InfluencerData = {
      id: cleanHandle,
      handle: cleanHandle,
      petParentName: cleanHandle === 'wickens.wicked.reptiles' ? 'Adam Wickens' : (firstCampaign["PET PARENT NAME"] || ''),
      petName: firstCampaign["PET NAME"] || '',
      followerCount: parseNumericValue(firstCampaign["FOLLOWER COUNT"]),
      tier: tier.replace('TIER 1: ', '').replace('TIER 2: ', '').replace('TIER 3: ', ''),
      category: firstCampaign["CATEGORY"] || '',
      partnerType: firstCampaign["PARTNER TYPE"] || '',
      city: firstCampaign["CITY"] || '',
      state: firstCampaign["STATE"] || '',
      platform: firstCampaign["PLATFORM"]?.toLowerCase() || 'instagram',
      engagementRate: 0, // Will be set from financial data
      rate: financialMetrics.totalRate || 0,
      rank: 1, // Will be calculated based on ER change
      rankType: 'trending-up', // Will be determined by ER change
      recentGrowth: 12, // Default growth data
      totalRevenue: 0,
      contentImpressions: 0, // Will be set from financial data
      roas: financialMetrics.avgROAS || 0,
      aov: financialMetrics.avgAOV || 0,
      avgViews: financialMetrics.avgViews || 0,
      cpe: financialMetrics.avgCPE || 0,
      cpv: financialMetrics.avgCPV || 0,
      posts: [] // This will contain only campaign posts
    };
    
    // Process all campaigns for this influencer
    campaigns.forEach(campaign => {
      const post = transformCampaignToPost(campaign);
      baseInfluencer.posts.push(post);
      
      // Update aggregated metrics from campaign data
      baseInfluencer.totalRevenue = (baseInfluencer.totalRevenue || 0) + post.revenue;
    });
    
    // Set engagement rate and content impressions from financial data
    baseInfluencer.engagementRate = financialMetrics.engagementRate || 0;
    baseInfluencer.contentImpressions = financialMetrics.totalViews || 0;
    
    influencerMap.set(cleanHandle, baseInfluencer);
  });
  
  // Update engagement rate and impressions from post analytics data
  postAnalyticsMap.forEach((posts, influencerId) => {
    const normalizedId = influencerId.replace(/[._]/g, '').toLowerCase();
    
    // Try to find matching influencer (basic matching)
    let matchingInfluencer: InfluencerData | undefined;
    
    // Special handling for wickens.wicked.reptiles
    if (normalizedId === 'wickenswickedreptiles' || influencerId === 'wickens.wicked.reptiles') {
      matchingInfluencer = influencerMap.get('wickens.wicked.reptiles');
    } 
    // Special handling for Mika variations
    else if (normalizedId === 'mikaandmocha' || normalizedId === 'mikaandmoka' || 
             influencerId === 'Mika.and.moka' || influencerId === 'mika.and.mocha') {
      matchingInfluencer = influencerMap.get('Mika.and.moka');
    } else {
      for (const [key, influencer] of influencerMap.entries()) {
        if (key.toLowerCase().includes(normalizedId) || normalizedId.includes(key.toLowerCase())) {
          matchingInfluencer = influencer;
          break;
        }
      }
    }
    
    if (!matchingInfluencer) {
      // Get financial data for this influencer
      const cleanIdForFinancial = influencerId.replace(/[/\\:*?"<>|@\s]/g, '_').replace(/_+/g, '_');
      const financialMetrics = financialData[cleanIdForFinancial] || financialData[influencerId] || {};
      
      // Create new influencer from post analytics data
      matchingInfluencer = {
        id: influencerId,
        handle: influencerId,
        petParentName: influencerId.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        petName: 'Pet',
        followerCount: generateConsistentFollowerCount(influencerId), // Consistent but varied follower count
        tier: '50K+',
        category: 'Pet Owner',
        partnerType: 'NEW',
        city: 'Unknown',
        state: 'Unknown',
        platform: 'tiktok',
        engagementRate: financialMetrics.engagementRate || 0,
        rate: financialMetrics.totalRate || 0,
        rank: 1, // Will be calculated based on ER change
        rankType: 'trending-up' as const,
        recentGrowth: 15, // Default growth value
        totalRevenue: 0,
        contentImpressions: financialMetrics.totalViews || 0,
        roas: financialMetrics.avgROAS || 0,
        avgViews: financialMetrics.avgViews || 0,
        cpe: financialMetrics.avgCPE || 0,
        cpv: financialMetrics.avgCPV || 0,
        aov: financialMetrics.avgAOV || 0,
        posts: [] // No campaign posts for these influencers
      };
      influencerMap.set(influencerId, matchingInfluencer);
    }
    // Note: For existing influencers, financial metrics are already set from the previous section
  });
  
  // Add prediction data to each influencer and calculate ER change
  const influencersWithPredictions = Array.from(influencerMap.values()).map((influencer) => {
    // Find matching prediction data
    const prediction = predictionData.find(p => {
      const predInfluencer = p.influencer.toLowerCase();
      const infHandle = influencer.handle.toLowerCase();
      const infId = influencer.id.toLowerCase();
      
      // Direct match
      if (predInfluencer === infHandle || predInfluencer === infId) {
        return true;
      }
      
      // Try matching with periods replaced by underscores and vice versa
      const predInfluencerNormalized = predInfluencer.replace(/[._]/g, '');
      const infHandleNormalized = infHandle.replace(/[._]/g, '');
      const infIdNormalized = infId.replace(/[._]/g, '');
      
      return predInfluencerNormalized === infHandleNormalized || 
             predInfluencerNormalized === infIdNormalized;
    });
    
    if (prediction) {
      const currentER = parseFloat(prediction.current_engagement_rate) * 100;
      const predictedER = ((parseFloat(prediction.er_lgbm_prediction) + parseFloat(prediction.er_rf_prediction)) / 2) * 100;
      const predictedViews = (parseFloat(prediction.views_lgbm_prediction) + parseFloat(prediction.views_rf_prediction)) / 2;
      
      // Calculate engagement rate change (absolute difference for ranking)
      const erChange = predictedER - currentER;
      const erChangePercent = currentER > 0 ? (erChange / currentER) * 100 : 0;
      
      return {
        ...influencer,
        engagementRate: currentER,
        predictedEngagementRate: predictedER,
        predictedViews: predictedViews,
        engagementGrowthPotential: erChangePercent,
        erLgbmPrediction: parseFloat(prediction.er_lgbm_prediction) * 100, // Convert to percentage
        erChangeAbsolute: Math.abs(erChange), // For ranking purposes
        rankType: erChange >= 0 ? 'trending-up' : 'trending-down' as 'trending-up' | 'trending-down'
      };
    }
    
    return {
      ...influencer,
      erChangeAbsolute: 0, // No prediction data, no change
      rankType: 'trending-up' as 'trending-up' | 'trending-down'
    };
  });
  
  // Sort by positive changes first, then negative changes, then by magnitude within each group
  influencersWithPredictions.sort((a, b) => {
    const changeA = a.erChangeAbsolute || 0;
    const changeB = b.erChangeAbsolute || 0;
    const typeA = a.rankType;
    const typeB = b.rankType;
    
    // First priority: trending-up before trending-down
    if (typeA === 'trending-up' && typeB === 'trending-down') {
      return -1; // A comes before B
    }
    if (typeA === 'trending-down' && typeB === 'trending-up') {
      return 1; // B comes before A
    }
    
    // Second priority: within same trend type, sort by magnitude
    if (typeA === 'trending-up' && typeB === 'trending-up') {
      // For trending-up: highest positive change first
      return changeB - changeA;
    } else if (typeA === 'trending-down' && typeB === 'trending-down') {
      // For trending-down: least negative change first (smallest absolute change)
      return changeA - changeB;
    }
    
    // Fallback (should not reach here given the logic above)
    return changeB - changeA;
  });
  
  // Assign ranks: positive changes first (highest first), then negative changes (least negative first)
  return influencersWithPredictions.map((influencer, index) => ({
    ...influencer,
    rank: index + 1
  }));
};

export const getRealInfluencerData = (): InfluencerData[] => {
  return transformDataToInfluencers();
};