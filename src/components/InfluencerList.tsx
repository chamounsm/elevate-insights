import { InfluencerData } from './InfluencerDashboard';
import { InfluencerCard } from './InfluencerCard';
import { FilterSortState } from './InfluencerListControls';

interface InfluencerListProps {
  influencers: InfluencerData[];
  filterSort: FilterSortState;
  onInfluencerClick: (influencer: InfluencerData) => void;
}

export const InfluencerList = ({ influencers, filterSort, onInfluencerClick }: InfluencerListProps) => {
  const filteredAndSortedInfluencers = influencers
    .filter(influencer => {
      // Search filter
      const searchMatch = 
        influencer.handle.toLowerCase().includes(filterSort.searchTerm.toLowerCase()) ||
        influencer.petParentName.toLowerCase().includes(filterSort.searchTerm.toLowerCase()) ||
        influencer.petName.toLowerCase().includes(filterSort.searchTerm.toLowerCase());

      // Tier filter
      const tierMatch = filterSort.tierFilter === 'all' || influencer.tier === filterSort.tierFilter;

      // Partner type filter
      const partnerMatch = filterSort.partnerTypeFilter === 'all' || influencer.partnerType === filterSort.partnerTypeFilter;

      // Platform filter (case insensitive)
      const platformMatch = filterSort.platformFilter === 'all' || 
                           influencer.platform?.toLowerCase() === filterSort.platformFilter.toLowerCase();

      return searchMatch && tierMatch && partnerMatch && platformMatch;
    })
    .sort((a, b) => {
      const { sortBy, sortOrder } = filterSort;
      let aValue: number = 0;
      let bValue: number = 0;

      switch (sortBy) {
        case 'followerCount':
          aValue = a.followerCount || 0;
          bValue = b.followerCount || 0;
          break;
        case 'engagementRate':
          aValue = a.engagementRate || 0;
          bValue = b.engagementRate || 0;
          break;
        case 'totalRevenue':
          aValue = a.totalRevenue || 0;
          bValue = b.totalRevenue || 0;
          break;
        case 'roas':
          aValue = a.roas || 0;
          bValue = b.roas || 0;
          break;
        case 'recentGrowth':
          // Use predictive growth if available, fallback to recentGrowth
          aValue = a.viewsGrowthPotential ?? a.recentGrowth ?? 0;
          bValue = b.viewsGrowthPotential ?? b.recentGrowth ?? 0;
          break;
        default:
          aValue = a.rank || 0;
          bValue = b.rank || 0;
      }

      // Handle null/undefined values consistently
      if (aValue === null || aValue === undefined) aValue = 0;
      if (bValue === null || bValue === undefined) bValue = 0;

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

  return (
    <div className="space-y-4">
      {filteredAndSortedInfluencers.map((influencer) => (
        <InfluencerCard
          key={influencer.id}
          influencer={influencer}
          onClick={() => onInfluencerClick(influencer)}
        />
      ))}
      {filteredAndSortedInfluencers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No influencers match the current filters
        </div>
      )}
    </div>
  );
};