import { loadAllInfluencerData, loadPredictionData } from './loadInfluencerData';

// Interface for raw influencer post data
export interface InfluencerPostData {
  InfluencerID: string;
  username_in_url: string;
  url: string;
  date: string;
  'Platform & post metadata_views': string;
  'Platform & post metadata_likes': string;
  'Platform & post metadata_comments': string;
  'Platform & post metadata_shares': string;
  'Platform & post metadata_engagement_rate': string;
  'Platform & post metadata_comment_ratio': string;
  'Platform & post metadata_share_ratio': string;
  'Platform & post metadata_like_ratio': string;
  'Temporal dynamics_duration_seconds': string;
  video_id: string;
  // Add other fields as needed for analytics
  [key: string]: any;
}

// Processed analytics data interfaces
export interface ProcessedPostMetrics {
  date: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagements: number;
  engagementRate: number;
  duration: number;
  influencerId: string;
}

export interface PerformanceMetrics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  totalEngagements: number;
  avgEngagementRate: number;
  postCount: number;
}

export interface TimeSeriesData {
  date: string;
  views: number;
  engagements: number;
  engagementRate: number;
}

// Utility function to parse numeric values from strings
const parseNumericValue = (value: string | number | null): number => {
  if (typeof value === 'number') return value;
  if (!value || value === null || value === 'null') return 0;
  
  const str = String(value).replace(/[$,\s]/g, '');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
};

// Load and process influencer post data, optionally filtered by influencer
export const loadInfluencerAnalyticsData = (influencerId?: string): ProcessedPostMetrics[] => {
  const rawData = loadAllInfluencerData();
  
  const processedData = rawData.map(post => ({
    date: post.date || '',
    views: parseNumericValue(post['Platform & post metadata_views']),
    likes: parseNumericValue(post['Platform & post metadata_likes']),
    comments: parseNumericValue(post['Platform & post metadata_comments']),
    shares: parseNumericValue(post['Platform & post metadata_shares']),
    engagements: parseNumericValue(post['Platform & post metadata_likes']) + 
                parseNumericValue(post['Platform & post metadata_comments']) + 
                parseNumericValue(post['Platform & post metadata_shares']),
    engagementRate: parseNumericValue(post['Platform & post metadata_engagement_rate']) * 100,
    duration: parseNumericValue(post['Temporal dynamics_duration_seconds']),
    influencerId: post.InfluencerID || ''
  })).filter(post => post.date && post.views > 0); // Filter out invalid posts
  
  // Filter by specific influencer if provided
  if (influencerId) {
    return processedData.filter(post => post.influencerId === influencerId);
  }
  
  return processedData;
};

// Calculate overall performance metrics
export const calculatePerformanceMetrics = (posts: ProcessedPostMetrics[]): PerformanceMetrics => {
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  const totalEngagements = posts.reduce((sum, post) => sum + post.engagements, 0);
  const avgEngagementRate = posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length;

  return {
    totalViews,
    totalLikes,
    totalComments,
    totalShares,
    totalEngagements,
    avgEngagementRate: avgEngagementRate || 0,
    postCount: posts.length
  };
};

// Group posts by date for time series analysis
export const createTimeSeriesData = (posts: ProcessedPostMetrics[]): TimeSeriesData[] => {
  // Group by month for better visualization
  const monthlyData = new Map<string, { views: number; engagements: number; count: number; totalER: number }>();
  
  posts.forEach(post => {
    if (!post.date) return;
    
    const date = new Date(post.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { views: 0, engagements: 0, count: 0, totalER: 0 });
    }
    
    const monthData = monthlyData.get(monthKey)!;
    monthData.views += post.views;
    monthData.engagements += post.engagements;
    monthData.count += 1;
    monthData.totalER += post.engagementRate;
  });
  
  return Array.from(monthlyData.entries()).map(([date, data]) => ({
    date,
    views: Math.round(data.views / 1000), // Convert to thousands for readability
    engagements: data.engagements,
    engagementRate: data.totalER / data.count
  })).sort((a, b) => a.date.localeCompare(b.date));
};

// Calculate engagement breakdown by type
export const calculateEngagementBreakdown = (posts: ProcessedPostMetrics[]) => {
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);

  return [
    { 
      name: 'Views', 
      value: totalViews, 
      trend: '+12%' // This could be calculated by comparing with previous period
    },
    { 
      name: 'Likes', 
      value: totalLikes, 
      trend: '+8%' 
    },
    { 
      name: 'Comments', 
      value: totalComments, 
      trend: '+15%' 
    },
    { 
      name: 'Shares', 
      value: totalShares, 
      trend: '+22%' 
    }
  ];
};

// Filter posts by influencer
export const filterPostsByInfluencer = (posts: ProcessedPostMetrics[], influencerId: string): ProcessedPostMetrics[] => {
  return posts.filter(post => post.influencerId === influencerId);
};

// Get top performing posts
export const getTopPerformingPosts = (posts: ProcessedPostMetrics[], limit = 10): ProcessedPostMetrics[] => {
  return posts
    .sort((a, b) => b.engagementRate - a.engagementRate)
    .slice(0, limit);
};

// Calculate metrics by date range
export const getMetricsByDateRange = (posts: ProcessedPostMetrics[], days = 30): ProcessedPostMetrics[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return posts.filter(post => {
    const postDate = new Date(post.date);
    return postDate >= cutoffDate;
  });
};

// Audio & Prosody Analysis Functions
export interface AudioProsodyData {
  audioToneDistribution: { name: string; value: number; fill: string }[];
  musicTempoDistribution: { tempo: string; count: number }[];
  audioCharacteristics: {
    withMusic: number;
    avgSpeakers: number;
    avgSpeechRate: string;
    asmrContent: number;
  };
}

export const calculateAudioProsodyData = (influencerId?: string): AudioProsodyData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;
  
  // Audio tone distribution
  const toneCount = new Map<string, number>();
  rawData.forEach(post => {
    const tone = post['Audio & prosody_tone'];
    if (tone && tone !== 'null') {
      toneCount.set(tone, (toneCount.get(tone) || 0) + 1);
    }
  });
  
  const totalTones = Array.from(toneCount.values()).reduce((sum, count) => sum + count, 0);
  const colors = ['hsl(var(--dashboard-primary))', 'hsl(var(--dashboard-secondary))', 'hsl(var(--dashboard-success))', 'hsl(var(--dashboard-warning))'];
  
  const audioToneDistribution = Array.from(toneCount.entries()).map(([tone, count], index) => ({
    name: tone.charAt(0).toUpperCase() + tone.slice(1),
    value: Math.round((count / totalTones) * 100),
    fill: colors[index % colors.length]
  }));
  
  // Music tempo distribution
  const tempoCount = new Map<string, number>();
  rawData.forEach(post => {
    const tempo = post['Audio & prosody_music_tempo'];
    if (tempo && tempo !== 'null' && tempo !== 'unclear') {
      const tempoKey = tempo.charAt(0).toUpperCase() + tempo.slice(1);
      tempoCount.set(tempoKey, (tempoCount.get(tempoKey) || 0) + 1);
    }
  });
  
  const musicTempoDistribution = Array.from(tempoCount.entries()).map(([tempo, count]) => ({
    tempo,
    count
  }));
  
  // Audio characteristics
  let withMusicCount = 0;
  let totalSpeakers = 0;
  let speakersCount = 0;
  let asmrCount = 0;
  const speechRates = new Map<string, number>();
  
  rawData.forEach(post => {
    // Music presence
    if (post['Audio & prosody_music'] === 'True' || post['Audio & prosody_music'] === true) {
      withMusicCount++;
    }
    
    // Number of speakers
    const speakers = parseNumericValue(post['Audio & prosody_num_speakers']);
    if (speakers > 0) {
      totalSpeakers += speakers;
      speakersCount++;
    }
    
    // ASMR content
    if (post['Audio & prosody_asmr'] === 'True' || post['Audio & prosody_asmr'] === true) {
      asmrCount++;
    }
    
    // Speech rate
    const speechRate = post['Audio & prosody_speech_rate'];
    if (speechRate && speechRate !== 'null') {
      speechRates.set(speechRate, (speechRates.get(speechRate) || 0) + 1);
    }
  });
  
  // Get most common speech rate
  let mostCommonSpeechRate = 'Normal';
  let maxCount = 0;
  speechRates.forEach((count, rate) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommonSpeechRate = rate.charAt(0).toUpperCase() + rate.slice(1);
    }
  });
  
  const audioCharacteristics = {
    withMusic: Math.round((withMusicCount / rawData.length) * 100),
    avgSpeakers: speakersCount > 0 ? Number((totalSpeakers / speakersCount).toFixed(1)) : 1.0,
    avgSpeechRate: mostCommonSpeechRate,
    asmrContent: Math.round((asmrCount / rawData.length) * 100)
  };
  
  return {
    audioToneDistribution,
    musicTempoDistribution,
    audioCharacteristics
  };
};

// Visual Content Semantics Analysis Functions
export interface VisualContentData {
  screenTimeAnalysis: { metric: string; percentage: number }[];
  sceneTypeDistribution: { name: string; value: number; fill: string }[];
  visualElements: {
    closeUpHooks: number;
    actionMovement: number;
    avgPetsPerVideo: number;
    avgCutsPerVideo: number;
  };
}

export const calculateVisualContentData = (influencerId?: string): VisualContentData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      screenTimeAnalysis: [],
      sceneTypeDistribution: [],
      visualElements: {
        closeUpHooks: 0,
        actionMovement: 0,
        avgPetsPerVideo: 0,
        avgCutsPerVideo: 0
      }
    };
  }
  
  // Screen Time Analysis
  let totalAnimalScreenTime = 0;
  let totalHumanScreenTime = 0;
  let animalCount = 0;
  let humanCount = 0;
  
  rawData.forEach(post => {
    const animalScreenTime = parseNumericValue(post['Visual Content Semantics_animal_screen_time_percentage']);
    const humanScreenTime = parseNumericValue(post['Visual Content Semantics_human_screen_time_percentage']);
    
    if (animalScreenTime > 0) {
      totalAnimalScreenTime += animalScreenTime;
      animalCount++;
    }
    
    if (humanScreenTime > 0) {
      totalHumanScreenTime += humanScreenTime;
      humanCount++;
    }
  });
  
  const avgAnimalScreenTime = animalCount > 0 ? totalAnimalScreenTime / animalCount : 0;
  const avgHumanScreenTime = humanCount > 0 ? totalHumanScreenTime / humanCount : 0;
  
  const screenTimeAnalysis = [
    { metric: 'Animal Screen Time', percentage: Math.round(avgAnimalScreenTime) },
    { metric: 'Human Screen Time', percentage: Math.round(avgHumanScreenTime) }
  ];
  
  // Scene Type Distribution
  const sceneCount = new Map<string, number>();
  rawData.forEach(post => {
    const sceneType = post['Visual Content Semantics_primary_scene_type'];
    if (sceneType && sceneType !== 'null') {
      const sceneKey = sceneType.charAt(0).toUpperCase() + sceneType.slice(1);
      sceneCount.set(sceneKey, (sceneCount.get(sceneKey) || 0) + 1);
    }
  });
  
  const totalScenes = Array.from(sceneCount.values()).reduce((sum, count) => sum + count, 0);
  const colors = ['hsl(var(--dashboard-primary))', 'hsl(var(--dashboard-secondary))', 'hsl(var(--dashboard-success))', 'hsl(var(--dashboard-warning))'];
  
  const sceneTypeDistribution = Array.from(sceneCount.entries()).map(([scene, count], index) => ({
    name: scene,
    value: totalScenes > 0 ? Math.round((count / totalScenes) * 100) : 0,
    fill: colors[index % colors.length]
  }));
  
  // Visual Elements & Hooks
  let closeUpHookCount = 0;
  let actionMovementCount = 0;
  let totalPets = 0;
  let totalCuts = 0;
  let petsCount = 0;
  let cutsCount = 0;
  
  rawData.forEach(post => {
    // Close-up hooks
    if (post['Visual Content Semantics_close_up_hook'] === 'True' || post['Visual Content Semantics_close_up_hook'] === true) {
      closeUpHookCount++;
    }
    
    // Action/Movement hooks
    if (post['Visual Content Semantics_action_or_movement_hook'] === 'True' || post['Visual Content Semantics_action_or_movement_hook'] === true) {
      actionMovementCount++;
    }
    
    // Number of pets
    const numPets = parseNumericValue(post['Visual Content Semantics_num_of_pets']);
    if (numPets > 0) {
      totalPets += numPets;
      petsCount++;
    }
    
    // Total cuts
    const totalCutsInPost = parseNumericValue(post['Temporal dynamics_total_cuts']);
    if (totalCutsInPost > 0) {
      totalCuts += totalCutsInPost;
      cutsCount++;
    }
  });
  
  const visualElements = {
    closeUpHooks: Math.round((closeUpHookCount / rawData.length) * 100),
    actionMovement: Math.round((actionMovementCount / rawData.length) * 100),
    avgPetsPerVideo: petsCount > 0 ? Number((totalPets / petsCount).toFixed(1)) : 0,
    avgCutsPerVideo: cutsCount > 0 ? Number((totalCuts / cutsCount).toFixed(1)) : 0
  };
  
  return {
    screenTimeAnalysis,
    sceneTypeDistribution,
    visualElements
  };
};

// Emotion & Affect Analysis Functions
export interface EmotionAffectData {
  topViewerEmotions: { emotion: string; value: number }[];
  arousalLevels: { level: string; count: number }[];
  emotionalCharacteristics: {
    valenceLevel: string;
    targetAudience: string;
    empathyStrategy: string;
  };
}

export const calculateEmotionAffectData = (influencerId?: string): EmotionAffectData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      topViewerEmotions: [],
      arousalLevels: [],
      emotionalCharacteristics: {
        valenceLevel: 'Unknown',
        targetAudience: 'Unknown',
        empathyStrategy: 'Unknown'
      }
    };
  }
  
  // Top Viewer Emotions - parse array strings and count occurrences
  const emotionCount = new Map<string, number>();
  rawData.forEach(post => {
    const emotions = post['Emotion & affect_top_viewer_emotions'];
    if (emotions && emotions !== 'null') {
      try {
        // Parse the array string like "['joy', 'amusement', 'comfort']"
        const emotionArray = emotions.replace(/[\[\]']/g, '').split(',').map((e: string) => e.trim());
        emotionArray.forEach((emotion: string) => {
          if (emotion && emotion !== '') {
            const cleanEmotion = emotion.charAt(0).toUpperCase() + emotion.slice(1);
            emotionCount.set(cleanEmotion, (emotionCount.get(cleanEmotion) || 0) + 1);
          }
        });
      } catch (e) {
        // If parsing fails, treat as single emotion
        if (typeof emotions === 'string' && emotions !== 'null') {
          const cleanEmotion = emotions.charAt(0).toUpperCase() + emotions.slice(1);
          emotionCount.set(cleanEmotion, (emotionCount.get(cleanEmotion) || 0) + 1);
        }
      }
    }
  });
  
  // Convert to percentage and take top emotions
  const totalEmotions = Array.from(emotionCount.values()).reduce((sum, count) => sum + count, 0);
  const topViewerEmotions = Array.from(emotionCount.entries())
    .map(([emotion, count]) => ({
      emotion,
      value: totalEmotions > 0 ? Math.round((count / totalEmotions) * 100) : 0
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 4); // Take top 4 emotions
  
  // Arousal Levels
  const arousalCount = new Map<string, number>();
  rawData.forEach(post => {
    const arousal = post['Emotion & affect_arousal_level'];
    if (arousal && arousal !== 'null') {
      const arousalKey = arousal.charAt(0).toUpperCase() + arousal.slice(1);
      arousalCount.set(arousalKey, (arousalCount.get(arousalKey) || 0) + 1);
    }
  });
  
  const arousalLevels = Array.from(arousalCount.entries()).map(([level, count]) => ({
    level,
    count
  }));
  
  // Emotional Characteristics - find most common values
  const valenceLevels = new Map<string, number>();
  const targetAudiences = new Map<string, number>();
  const empathyStrategies = new Map<string, number>();
  
  rawData.forEach(post => {
    // Valence Level
    const valence = post['Emotion & affect_valence_level'];
    if (valence && valence !== 'null') {
      const valenceKey = valence.charAt(0).toUpperCase() + valence.slice(1);
      valenceLevels.set(valenceKey, (valenceLevels.get(valenceKey) || 0) + 1);
    }
    
    // Target Audience - parse array strings
    const audience = post['Emotion & affect_emotional_target_audience'];
    if (audience && audience !== 'null') {
      try {
        // Parse array like "['pet owners', 'animal lovers', 'prospective pet owners']"
        const audienceArray = audience.replace(/[\[\]']/g, '').split(',').map((a: string) => a.trim());
        // Use the first/primary audience
        if (audienceArray.length > 0 && audienceArray[0] !== '') {
          const primaryAudience = audienceArray[0].charAt(0).toUpperCase() + audienceArray[0].slice(1);
          targetAudiences.set(primaryAudience, (targetAudiences.get(primaryAudience) || 0) + 1);
        }
      } catch (e) {
        // If parsing fails, treat as single value
        if (typeof audience === 'string' && audience !== 'null') {
          const cleanAudience = audience.charAt(0).toUpperCase() + audience.slice(1);
          targetAudiences.set(cleanAudience, (targetAudiences.get(cleanAudience) || 0) + 1);
        }
      }
    }
    
    // Empathy Strategy
    const strategy = post['Emotion & affect_empathy_evocation_strategy'];
    if (strategy && strategy !== 'null') {
      const strategyKey = strategy.charAt(0).toUpperCase() + strategy.slice(1);
      empathyStrategies.set(strategyKey, (empathyStrategies.get(strategyKey) || 0) + 1);
    }
  });
  
  // Find most common values
  const getMostCommon = (map: Map<string, number>, defaultValue: string = 'Unknown'): string => {
    if (map.size === 0) return defaultValue;
    return Array.from(map.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };
  
  const emotionalCharacteristics = {
    valenceLevel: getMostCommon(valenceLevels, 'Neutral'),
    targetAudience: getMostCommon(targetAudiences, 'General audience'),
    empathyStrategy: getMostCommon(empathyStrategies, 'Relatable content')
  };
  
  return {
    topViewerEmotions,
    arousalLevels,
    emotionalCharacteristics
  };
};

// Content Quality Analysis Functions
export interface ContentQualityData {
  qualityScores: { metric: string; score: number; maxScore: number }[];
  overallQuality: number;
  brandFit: string;
}

export const calculateContentQualityData = (influencerId?: string): ContentQualityData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      qualityScores: [],
      overallQuality: 0,
      brandFit: 'Unknown'
    };
  }
  
  // Collect all scores
  let totalHookEffectiveness = 0;
  let totalEmotionalResonance = 0;
  let totalOverallQuality = 0;
  let totalNarrativeClarity = 0;
  let totalBrandFit = 0;
  
  let hookCount = 0;
  let emotionCount = 0;
  let qualityCount = 0;
  let narrativeCount = 0;
  let brandFitCount = 0;
  
  const brandFitLevels = new Map<string, number>();
  
  rawData.forEach(post => {
    // Hook Effectiveness Score
    const hookScore = parseNumericValue(post['Narrative & topic_hook_effectiveness_score']);
    if (hookScore > 0) {
      totalHookEffectiveness += hookScore;
      hookCount++;
    }
    
    // Emotional Resonance Score
    const emotionScore = parseNumericValue(post['Emotion & affect_emotional_resonance_score']);
    if (emotionScore > 0) {
      totalEmotionalResonance += emotionScore;
      emotionCount++;
    }
    
    // Overall Quality Score
    const qualityScore = parseNumericValue(post['Visual Style & Production_overall_quality_score']);
    if (qualityScore > 0) {
      totalOverallQuality += qualityScore;
      qualityCount++;
    }
    
    // Narrative Clarity Score
    const narrativeScore = parseNumericValue(post['Narrative & topic_narrative_clarity_score']);
    if (narrativeScore > 0) {
      totalNarrativeClarity += narrativeScore;
      narrativeCount++;
    }
    
    // Brand Fit Score
    const brandFitScore = parseNumericValue(post['Narrative & topic_audience_brand_fit_score']);
    if (brandFitScore > 0) {
      totalBrandFit += brandFitScore;
      brandFitCount++;
    }
    
    // Brand Fit Level (qualitative)
    const brandFitLevel = post['Narrative & topic_audience_brand_fit_fit_level'];
    if (brandFitLevel && brandFitLevel !== 'null') {
      const fitKey = brandFitLevel.charAt(0).toUpperCase() + brandFitLevel.slice(1);
      brandFitLevels.set(fitKey, (brandFitLevels.get(fitKey) || 0) + 1);
    }
  });
  
  // Calculate averages
  const avgHookEffectiveness = hookCount > 0 ? totalHookEffectiveness / hookCount : 0;
  const avgEmotionalResonance = emotionCount > 0 ? totalEmotionalResonance / emotionCount : 0;
  const avgProductionQuality = qualityCount > 0 ? totalOverallQuality / qualityCount : 0;
  const avgNarrativeClarity = narrativeCount > 0 ? totalNarrativeClarity / narrativeCount : 0;
  const avgBrandFit = brandFitCount > 0 ? totalBrandFit / brandFitCount : 0;
  
  // Create quality scores array
  const qualityScores = [
    { metric: 'Hook Effectiveness', score: Number(avgHookEffectiveness.toFixed(1)), maxScore: 5 },
    { metric: 'Emotional Resonance', score: Number(avgEmotionalResonance.toFixed(1)), maxScore: 5 },
    { metric: 'Production Quality', score: Number(avgProductionQuality.toFixed(1)), maxScore: 5 },
    { metric: 'Narrative Clarity', score: Number(avgNarrativeClarity.toFixed(1)), maxScore: 5 },
    { metric: 'Brand Fit', score: Number(avgBrandFit.toFixed(1)), maxScore: 5 }
  ].filter(score => score.score > 0); // Only include scores that have data
  
  // Calculate overall quality by averaging all available scores
  const overallQuality = qualityScores.length > 0 
    ? Number((qualityScores.reduce((sum, score) => sum + score.score, 0) / qualityScores.length).toFixed(1))
    : 0;
  
  // Get most common brand fit level
  const getMostCommonBrandFit = (): string => {
    if (brandFitLevels.size === 0) return 'Unknown';
    return Array.from(brandFitLevels.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };
  
  const brandFit = getMostCommonBrandFit();
  
  return {
    qualityScores,
    overallQuality,
    brandFit
  };
};

// Brand Analysis Functions
export interface BrandData {
  brandDistribution: { name: string; count: number; percentage: number }[];
  totalBrandMentions: number;
}

export const calculateBrandData = (influencerId?: string): BrandData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      brandDistribution: [],
      totalBrandMentions: 0
    };
  }
  
  const brandCount = new Map<string, number>();
  let totalMentions = 0;
  
  rawData.forEach(post => {
    const brands = post['Visual Content Semantics_detected_brand_logos'];
    if (brands && brands !== 'null' && brands !== '[]') {
      try {
        // Parse the array string like "['Nike', 'Adidas']"
        const brandArray = brands.replace(/[\[\]']/g, '').split(',').map((b: string) => b.trim());
        brandArray.forEach((brand: string) => {
          if (brand && brand !== '' && brand !== 'null') {
            brandCount.set(brand, (brandCount.get(brand) || 0) + 1);
            totalMentions++;
          }
        });
      } catch (e) {
        // If parsing fails, treat as single brand
        if (typeof brands === 'string' && brands !== 'null' && brands !== '[]') {
          const cleanBrand = brands.replace(/[\[\]']/g, '').trim();
          if (cleanBrand !== '') {
            brandCount.set(cleanBrand, (brandCount.get(cleanBrand) || 0) + 1);
            totalMentions++;
          }
        }
      }
    }
  });
  
  // Convert to array with percentages
  const brandDistribution = Array.from(brandCount.entries())
    .map(([brand, count]) => ({
      name: brand,
      count,
      percentage: totalMentions > 0 ? Math.round((count / totalMentions) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Take top 10 brands
  
  return {
    brandDistribution,
    totalBrandMentions: totalMentions
  };
};

// Pet Type Analysis Functions
export interface PetTypeData {
  petBreedDistribution: { name: string; count: number; percentage: number }[];
  totalPets: number;
}

export const calculatePetTypeData = (influencerId?: string): PetTypeData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      petBreedDistribution: [],
      totalPets: 0
    };
  }
  
  const breedCount = new Map<string, number>();
  let totalPets = 0;
  
  rawData.forEach(post => {
    const breeds = post['Visual Content Semantics_pet_breed'];
    if (breeds && breeds !== 'null' && breeds !== '[]') {
      try {
        // Parse the array string like "['golden retriever', 'mixed breed']"
        const breedArray = breeds.replace(/[\[\]']/g, '').split(',').map((b: string) => b.trim());
        breedArray.forEach((breed: string) => {
          if (breed && breed !== '' && breed !== 'null') {
            // Capitalize first letter of each word
            const cleanBreed = breed.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breedCount.set(cleanBreed, (breedCount.get(cleanBreed) || 0) + 1);
            totalPets++;
          }
        });
      } catch (e) {
        // If parsing fails, treat as single breed
        if (typeof breeds === 'string' && breeds !== 'null' && breeds !== '[]') {
          const cleanBreed = breeds.replace(/[\[\]']/g, '').trim();
          if (cleanBreed !== '') {
            const formattedBreed = cleanBreed.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            breedCount.set(formattedBreed, (breedCount.get(formattedBreed) || 0) + 1);
            totalPets++;
          }
        }
      }
    }
  });
  
  // Convert to array with percentages
  const petBreedDistribution = Array.from(breedCount.entries())
    .map(([breed, count]) => ({
      name: breed,
      count,
      percentage: totalPets > 0 ? Math.round((count / totalPets) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Take top 10 breeds
  
  return {
    petBreedDistribution,
    totalPets
  };
};

// Trust & Authority Analysis Functions
export interface TrustAuthorityData {
  trustCues: { cue: string; percentage: number; present: boolean }[];
  authenticityMarkers: { marker: string; count: number; percentage: number }[];
  overallTrustScore: number;
}

export const calculateTrustAuthorityData = (influencerId?: string): TrustAuthorityData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      trustCues: [],
      authenticityMarkers: [],
      overallTrustScore: 0
    };
  }
  
  // Count trust and authority cues
  let expertTitlesCount = 0;
  let scientificRefsCount = 0;
  let brandCollabCount = 0;
  let faceVisibleCount = 0;
  let eyeContactCount = 0;
  
  const authenticityCount = new Map<string, number>();
  
  rawData.forEach(post => {
    // Expert titles visible
    if (post['Trust & authority cues_expert_titles_visible'] === 'True' || post['Trust & authority cues_expert_titles_visible'] === true) {
      expertTitlesCount++;
    }
    
    // Scientific references spoken
    if (post['Trust & authority cues_scientific_refs_spoken'] === 'True' || post['Trust & authority cues_scientific_refs_spoken'] === true) {
      scientificRefsCount++;
    }
    
    // Brand collaboration disclosed
    if (post['Trust & authority cues_brand_collab_disclosed'] === 'True' || post['Trust & authority cues_brand_collab_disclosed'] === true) {
      brandCollabCount++;
    }
    
    // Influencer face visible
    if (post['Trust & authority cues_influencer_face_visible'] === 'True' || post['Trust & authority cues_influencer_face_visible'] === true) {
      faceVisibleCount++;
    }
    
    // Eye contact with camera
    if (post['Trust & authority cues_eye_contact_with_camera'] === 'True' || post['Trust & authority cues_eye_contact_with_camera'] === true) {
      eyeContactCount++;
    }
    
    // Authenticity markers - parse array strings
    const markers = post['Trust & authority cues_authenticity_markers'];
    if (markers && markers !== 'null' && markers !== '[]') {
      try {
        // Parse the array string like "['showing personal environments (e.g., home, car)', 'engaging with pets or family naturally']"
        const markerArray = markers.replace(/[\[\]']/g, '').split(',').map((m: string) => m.trim());
        markerArray.forEach((marker: string) => {
          if (marker && marker !== '' && marker !== 'null') {
            // Clean up and capitalize the marker
            const cleanMarker = marker.charAt(0).toUpperCase() + marker.slice(1);
            authenticityCount.set(cleanMarker, (authenticityCount.get(cleanMarker) || 0) + 1);
          }
        });
      } catch (e) {
        // If parsing fails, treat as single marker
        if (typeof markers === 'string' && markers !== 'null' && markers !== '[]') {
          const cleanMarker = markers.replace(/[\[\]']/g, '').trim();
          if (cleanMarker !== '') {
            const formattedMarker = cleanMarker.charAt(0).toUpperCase() + cleanMarker.slice(1);
            authenticityCount.set(formattedMarker, (authenticityCount.get(formattedMarker) || 0) + 1);
          }
        }
      }
    }
  });
  
  // Calculate percentages for trust cues
  const trustCues = [
    {
      cue: 'Expert Titles Visible',
      percentage: Math.round((expertTitlesCount / rawData.length) * 100),
      present: expertTitlesCount > 0
    },
    {
      cue: 'Scientific References',
      percentage: Math.round((scientificRefsCount / rawData.length) * 100),
      present: scientificRefsCount > 0
    },
    {
      cue: 'Brand Collaboration Disclosed',
      percentage: Math.round((brandCollabCount / rawData.length) * 100),
      present: brandCollabCount > 0
    },
    {
      cue: 'Face Visible',
      percentage: Math.round((faceVisibleCount / rawData.length) * 100),
      present: faceVisibleCount > 0
    },
    {
      cue: 'Eye Contact with Camera',
      percentage: Math.round((eyeContactCount / rawData.length) * 100),
      present: eyeContactCount > 0
    }
  ];
  
  // Process authenticity markers
  const totalMarkers = Array.from(authenticityCount.values()).reduce((sum, count) => sum + count, 0);
  const authenticityMarkers = Array.from(authenticityCount.entries())
    .map(([marker, count]) => ({
      marker,
      count,
      percentage: totalMarkers > 0 ? Math.round((count / totalMarkers) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Take top 5 markers
  
  // Calculate overall trust score (weighted average)
  const weights = {
    expertTitles: 0.25,
    scientificRefs: 0.25,
    brandCollab: 0.15,
    faceVisible: 0.20,
    eyeContact: 0.15
  };
  
  const overallTrustScore = Math.round(
    (expertTitlesCount / rawData.length) * weights.expertTitles * 100 +
    (scientificRefsCount / rawData.length) * weights.scientificRefs * 100 +
    (brandCollabCount / rawData.length) * weights.brandCollab * 100 +
    (faceVisibleCount / rawData.length) * weights.faceVisible * 100 +
    (eyeContactCount / rawData.length) * weights.eyeContact * 100
  );
  
  return {
    trustCues,
    authenticityMarkers,
    overallTrustScore
  };
};

// On-screen Text & Graphics Analysis Functions
export interface OnScreenTextData {
  textElements: { element: string; percentage: number; present: boolean }[];
  typographyDistribution: { style: string; count: number; percentage: number }[];
  textCharacteristics: {
    avgProductMentions: number;
    ctaPresence: number;
    subtitlesPresence: number;
    textDensityBreakdown: { density: string; count: number }[];
  };
}

export const calculateOnScreenTextData = (influencerId?: string): OnScreenTextData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      textElements: [],
      typographyDistribution: [],
      textCharacteristics: {
        avgProductMentions: 0,
        ctaPresence: 0,
        subtitlesPresence: 0,
        textDensityBreakdown: []
      }
    };
  }
  
  // Count text elements presence
  let ctaCount = 0;
  let subtitlesCount = 0;
  let onScreenPresenceCount = 0;
  let introTextCount = 0;
  
  const typographyCount = new Map<string, number>();
  const textDensityCount = new Map<string, number>();
  let totalProductMentions = 0;
  let productMentionsCount = 0;
  
  rawData.forEach(post => {
    // Explicit CTA text
    if (post['On-screen text & graphics_explicit_cta_text'] === 'True' || post['On-screen text & graphics_explicit_cta_text'] === true) {
      ctaCount++;
    }
    
    // Subtitles presence
    if (post['On-screen text & graphics_subtitles_presence'] === 'True' || post['On-screen text & graphics_subtitles_presence'] === true) {
      subtitlesCount++;
    }
    
    // On-screen presence
    if (post['On-screen text & graphics_on_screen_presence'] === 'True' || post['On-screen text & graphics_on_screen_presence'] === true) {
      onScreenPresenceCount++;
    }
    
    // Introduction text
    if (post['On-screen text & graphics_introduct_text'] === 'True' || post['On-screen text & graphics_introduct_text'] === true) {
      introTextCount++;
    }
    
    // Typography style
    const typography = post['On-screen text & graphics_typography_style'];
    if (typography && typography !== 'null') {
      const styleKey = typography.charAt(0).toUpperCase() + typography.slice(1);
      typographyCount.set(styleKey, (typographyCount.get(styleKey) || 0) + 1);
    }
    
    // Text density
    const density = post['On-screen text & graphics_text_density'];
    if (density && density !== 'null') {
      const densityKey = density.charAt(0).toUpperCase() + density.slice(1);
      textDensityCount.set(densityKey, (textDensityCount.get(densityKey) || 0) + 1);
    }
    
    // Product name mentions - count array items
    const productMentions = post['On-screen text & graphics_product_name_mentions'];
    if (productMentions && productMentions !== 'null' && productMentions !== '[]') {
      try {
        // Parse the array string like "['Product A', 'Product B']"
        const mentionArray = productMentions.replace(/[\[\]']/g, '').split(',').map((m: string) => m.trim());
        const validMentions = mentionArray.filter(mention => mention && mention !== '' && mention !== 'null');
        if (validMentions.length > 0) {
          totalProductMentions += validMentions.length;
          productMentionsCount++;
        }
      } catch (e) {
        // If parsing fails, count as 1 if not empty
        if (typeof productMentions === 'string' && productMentions !== 'null' && productMentions !== '[]') {
          totalProductMentions += 1;
          productMentionsCount++;
        }
      }
    }
  });
  
  // Calculate text elements percentages
  const textElements = [
    {
      element: 'Explicit CTA Text',
      percentage: Math.round((ctaCount / rawData.length) * 100),
      present: ctaCount > 0
    },
    {
      element: 'Subtitles Present',
      percentage: Math.round((subtitlesCount / rawData.length) * 100),
      present: subtitlesCount > 0
    },
    {
      element: 'On-screen Text',
      percentage: Math.round((onScreenPresenceCount / rawData.length) * 100),
      present: onScreenPresenceCount > 0
    },
    {
      element: 'Introduction Text',
      percentage: Math.round((introTextCount / rawData.length) * 100),
      present: introTextCount > 0
    }
  ];
  
  // Typography distribution
  const totalTypography = Array.from(typographyCount.values()).reduce((sum, count) => sum + count, 0);
  const typographyDistribution = Array.from(typographyCount.entries()).map(([style, count]) => ({
    style,
    count,
    percentage: totalTypography > 0 ? Math.round((count / totalTypography) * 100) : 0
  }));
  
  // Text density breakdown
  const textDensityBreakdown = Array.from(textDensityCount.entries()).map(([density, count]) => ({
    density,
    count
  }));
  
  // Text characteristics
  const textCharacteristics = {
    avgProductMentions: productMentionsCount > 0 ? Number((totalProductMentions / productMentionsCount).toFixed(1)) : 0,
    ctaPresence: Math.round((ctaCount / rawData.length) * 100),
    subtitlesPresence: Math.round((subtitlesCount / rawData.length) * 100),
    textDensityBreakdown
  };
  
  return {
    textElements,
    typographyDistribution,
    textCharacteristics
  };
};

// Visual Style & Production Analysis Functions
export interface VisualStyleProductionData {
  colorPaletteDistribution: { color: string; count: number; percentage: number }[];
  lightingAndBrightness: {
    averageBrightness: { level: string; count: number }[];
    lightingType: { type: string; count: number }[];
    contrastLevel: { level: string; count: number }[];
  };
  productionTechniques: {
    brollUsage: number;
    splitScreenUsage: number;
    visualMemesUsage: number;
    colorGradingStyles: { style: string; count: number; percentage: number }[];
  };
}

export const calculateVisualStyleProductionData = (influencerId?: string): VisualStyleProductionData => {
  const allRawData = loadAllInfluencerData();
  
  // Filter by specific influencer if provided
  const rawData = influencerId 
    ? allRawData.filter(post => post.InfluencerID === influencerId)
    : allRawData;

  if (rawData.length === 0) {
    return {
      colorPaletteDistribution: [],
      lightingAndBrightness: {
        averageBrightness: [],
        lightingType: [],
        contrastLevel: []
      },
      productionTechniques: {
        brollUsage: 0,
        splitScreenUsage: 0,
        visualMemesUsage: 0,
        colorGradingStyles: []
      }
    };
  }
  
  // Color Palette Analysis
  const colorCount = new Map<string, number>();
  rawData.forEach(post => {
    const colorPalette = post['Visual Style & Production_color_palette'];
    if (colorPalette && colorPalette !== 'null') {
      try {
        // Parse colors like "green, brown, gray, black, orange"
        const colors = colorPalette.split(',').map((c: string) => c.trim());
        colors.forEach((color: string) => {
          if (color && color !== '' && color !== 'null') {
            const cleanColor = color.charAt(0).toUpperCase() + color.slice(1);
            colorCount.set(cleanColor, (colorCount.get(cleanColor) || 0) + 1);
          }
        });
      } catch (e) {
        // If parsing fails, treat as single color
        if (typeof colorPalette === 'string' && colorPalette !== 'null') {
          const cleanColor = colorPalette.charAt(0).toUpperCase() + colorPalette.slice(1);
          colorCount.set(cleanColor, (colorCount.get(cleanColor) || 0) + 1);
        }
      }
    }
  });
  
  const totalColors = Array.from(colorCount.values()).reduce((sum, count) => sum + count, 0);
  const colorPaletteDistribution = Array.from(colorCount.entries())
    .map(([color, count]) => ({
      color,
      count,
      percentage: totalColors > 0 ? Math.round((count / totalColors) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8); // Top 8 colors
  
  // Lighting and Brightness Analysis
  const brightnessCount = new Map<string, number>();
  const lightingCount = new Map<string, number>();
  const contrastCount = new Map<string, number>();
  
  rawData.forEach(post => {
    // Average brightness
    const brightness = post['Visual Style & Production_average_brightness'];
    if (brightness && brightness !== 'null') {
      const brightnessKey = brightness.charAt(0).toUpperCase() + brightness.slice(1);
      brightnessCount.set(brightnessKey, (brightnessCount.get(brightnessKey) || 0) + 1);
    }
    
    // Lighting type
    const lighting = post['Visual Style & Production_lighting_type'];
    if (lighting && lighting !== 'null') {
      const lightingKey = lighting.charAt(0).toUpperCase() + lighting.slice(1);
      lightingCount.set(lightingKey, (lightingCount.get(lightingKey) || 0) + 1);
    }
    
    // Contrast level
    const contrast = post['Visual Style & Production_contrast_level'];
    if (contrast && contrast !== 'null') {
      const contrastKey = contrast.charAt(0).toUpperCase() + contrast.slice(1);
      contrastCount.set(contrastKey, (contrastCount.get(contrastKey) || 0) + 1);
    }
  });
  
  const lightingAndBrightness = {
    averageBrightness: Array.from(brightnessCount.entries()).map(([level, count]) => ({ level, count })),
    lightingType: Array.from(lightingCount.entries()).map(([type, count]) => ({ type, count })),
    contrastLevel: Array.from(contrastCount.entries()).map(([level, count]) => ({ level, count }))
  };
  
  // Production Techniques Analysis
  let brollCount = 0;
  let splitScreenCount = 0;
  let visualMemesCount = 0;
  const colorGradingCount = new Map<string, number>();
  
  rawData.forEach(post => {
    // B-roll usage
    if (post['Visual Style & Production_use_of_broll'] === 'True' || post['Visual Style & Production_use_of_broll'] === true) {
      brollCount++;
    }
    
    // Split screen usage
    if (post['Visual Style & Production_split_screen_or_picture_in_picture'] === 'True' || post['Visual Style & Production_split_screen_or_picture_in_picture'] === true) {
      splitScreenCount++;
    }
    
    // Visual memes usage
    if (post['Visual Style & Production_presence_of_visual_memes_stickers_trends'] === 'True' || post['Visual Style & Production_presence_of_visual_memes_stickers_trends'] === true) {
      visualMemesCount++;
    }
    
    // Color grading styles
    const colorGrading = post['Visual Style & Production_color_grading_style'];
    if (colorGrading && colorGrading !== 'null') {
      const gradingKey = colorGrading.charAt(0).toUpperCase() + colorGrading.slice(1);
      colorGradingCount.set(gradingKey, (colorGradingCount.get(gradingKey) || 0) + 1);
    }
  });
  
  const totalGrading = Array.from(colorGradingCount.values()).reduce((sum, count) => sum + count, 0);
  const colorGradingStyles = Array.from(colorGradingCount.entries()).map(([style, count]) => ({
    style,
    count,
    percentage: totalGrading > 0 ? Math.round((count / totalGrading) * 100) : 0
  }));
  
  const productionTechniques = {
    brollUsage: Math.round((brollCount / rawData.length) * 100),
    splitScreenUsage: Math.round((splitScreenCount / rawData.length) * 100),
    visualMemesUsage: Math.round((visualMemesCount / rawData.length) * 100),
    colorGradingStyles
  };
  
  return {
    colorPaletteDistribution,
    lightingAndBrightness,
    productionTechniques
  };
};

// Predictive Modeling Analysis Functions
export interface PredictiveModelingData {
  currentMetrics: {
    engagementRate: number;
    avgViews: number;
  };
  predictions: {
    engagementRate: number;
    views: number;
    engagementGrowth: number;
    viewsGrowth: number;
  };
  confidence: {
    level: 'high' | 'medium' | 'low';
    modelAgreement: {
      engagement: boolean;
      views: boolean;
    };
  };
  growthPotential: {
    percentile: number;
    category: string;
  };
}

export const calculatePredictiveModelingData = (influencerId?: string): PredictiveModelingData | null => {
  if (!influencerId) return null;
  
  // Load prediction data
  const predictionData = loadPredictionData();
  
  // Find prediction for this influencer
  const prediction = predictionData.find(p => 
    p.influencer.toLowerCase() === influencerId.toLowerCase() ||
    p.influencer.toLowerCase().replace(/[_\s]/g, '') === influencerId.toLowerCase().replace(/[_\s]/g, '')
  );
  
  if (!prediction) {
    return null;
  }
  
  // Parse current metrics
  const currentER = parseFloat(prediction.current_engagement_rate) * 100;
  const currentViews = parseFloat(prediction.current_views);
  
  // Calculate average predictions from both models
  const predictedER = ((parseFloat(prediction.er_lgbm_prediction) + parseFloat(prediction.er_rf_prediction)) / 2) * 100;
  const predictedViews = (parseFloat(prediction.views_lgbm_prediction) + parseFloat(prediction.views_rf_prediction)) / 2;
  
  // Calculate growth percentages
  let engagementGrowth = ((predictedER - currentER) / currentER) * 100;
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
  
  // Determine confidence level
  const modelAgreement = {
    engagement: prediction.er_direction_agreement === 'True',
    views: prediction.views_direction_agreement === 'True'
  };
  
  const confidenceLevel = (modelAgreement.engagement && modelAgreement.views) ? 'high' :
                         (modelAgreement.engagement || modelAgreement.views) ? 'medium' : 'low';
  
  // Calculate growth percentile
  const percentileScore = (percentile: string): number => {
    if (percentile.includes('90-100')) return 95;
    if (percentile.includes('75-90')) return 82.5;
    if (percentile.includes('50-75')) return 62.5;
    if (percentile.includes('25-50')) return 37.5;
    return 12.5;
  };
  
  const avgPercentile = (
    percentileScore(prediction.er_lgbm_percentile) + 
    percentileScore(prediction.er_rf_percentile) +
    percentileScore(prediction.views_lgbm_percentile) +
    percentileScore(prediction.views_rf_percentile)
  ) / 4;
  
  // Determine growth category
  const growthCategory = avgPercentile >= 75 ? 'High Growth Potential' :
                        avgPercentile >= 50 ? 'Moderate Growth Potential' :
                        avgPercentile >= 25 ? 'Steady Growth' : 'Stable Performance';
  
  return {
    currentMetrics: {
      engagementRate: currentER,
      avgViews: currentViews
    },
    predictions: {
      engagementRate: predictedER,
      views: predictedViews,
      engagementGrowth,
      viewsGrowth
    },
    confidence: {
      level: confidenceLevel,
      modelAgreement
    },
    growthPotential: {
      percentile: avgPercentile,
      category: growthCategory
    }
  };
};