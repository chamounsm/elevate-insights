// Dynamically import all influencer JSON files
const influencerFiles = import.meta.glob('@/data/influencers/*.json', { eager: true });
const campaignFiles = import.meta.glob('@/data/campaigns/*.json', { eager: true });

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