// Dynamically import all influencer JSON files
const influencerFiles = import.meta.glob('@/data/influencers/*.json', { eager: true });
const campaignFiles = import.meta.glob('@/data/campaigns/*.json', { eager: true });
const financialFiles = import.meta.glob('@/data/financial/*.json', { eager: true });
const predictionFiles = import.meta.glob('@/data/predictions/*.json', { eager: true });

export interface RawCampaignData {
  [key: string]: any;
}

export interface RawPostAnalyticsData {
  [key: string]: any;
}

export function loadAllInfluencerData(): RawPostAnalyticsData[] {
  const allData: RawPostAnalyticsData[] = [];
  
  Object.values(influencerFiles).forEach((module: any) => {
    if (Array.isArray(module.default)) {
      allData.push(...module.default);
    }
  });
  
  return allData;
}

export function loadAllCampaignData(): RawCampaignData[] {
  const allData: RawCampaignData[] = [];
  
  Object.values(campaignFiles).forEach((module: any) => {
    if (Array.isArray(module.default)) {
      allData.push(...module.default);
    }
  });
  
  return allData;
}

// Get data for specific influencer
export function getInfluencerData(influencerId: string): RawPostAnalyticsData[] {
  const filename = `@/data/influencers/${influencerId}.json`;
  const module = influencerFiles[filename] as any;
  return module?.default || [];
}

// Get campaign data for specific handle
export function getCampaignData(handle: string): RawCampaignData[] {
  const cleanHandle = handle.replace('@', '').replace(' ', '_').replace('/', '_');
  const filename = `@/data/campaigns/${cleanHandle}.json`;
  const module = campaignFiles[filename] as any;
  return module?.default || [];
}

// Load all financial data for influencers
export function loadAllFinancialData(): Record<string, any> {
  const financialData: Record<string, any> = {};

  Object.entries(financialFiles).forEach(([path, module]) => {
    // Extract influencer ID from filename
    const filename = path.split('/').pop()?.replace('_financial.json', '');
    if (filename) {
      const data = (module as { default: any }).default;
      financialData[filename] = data;
    }
  });

  return financialData;
}

// Get financial data for specific influencer
export function getFinancialData(influencerId: string): any {
  // Clean the influencer ID to match the filename pattern
  const cleanId = influencerId.replace(/[/\\:*?"<>|@\s]/g, '_').replace(/_+/g, '_');
  const filename = `@/data/financial/${cleanId}_financial.json`;
  const module = financialFiles[filename] as any;
  return module?.default || {};
}

// Prediction data interface
export interface PredictionData {
  influencer: string;
  current_engagement_rate: string;
  er_lgbm_prediction: string;
  er_rf_prediction: string;
  er_direction_agreement: string;
  er_lgbm_percentile: string;
  er_rf_percentile: string;
  current_views: string;
  views_lgbm_prediction: string;
  views_rf_prediction: string;
  views_direction_agreement: string;
  views_lgbm_percentile: string;
  views_rf_percentile: string;
}

// Load all prediction data
export function loadPredictionData(): PredictionData[] {
  const allData: PredictionData[] = [];
  
  Object.entries(predictionFiles).forEach(([path, module]) => {
    if (path.includes('predictive_rankings.json')) {
      const jsonData = (module as any).default || module;
      if (Array.isArray(jsonData)) {
        allData.push(...jsonData);
      }
    }
  });
  
  return allData;
}

// Get prediction data for specific influencer
export function getPredictionData(influencerHandle: string): PredictionData | null {
  const predictions = loadPredictionData();
  return predictions.find(p => p.influencer.toLowerCase() === influencerHandle.toLowerCase()) || null;
}