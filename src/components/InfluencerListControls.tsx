import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export interface FilterSortState {
  searchTerm: string;
  tierFilter: string;
  partnerTypeFilter: string;
  platformFilter: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface InfluencerListControlsProps {
  title: string;
  filterSort: FilterSortState;
  onFilterSortChange: (newState: FilterSortState) => void;
}

export const InfluencerListControls = ({ title, filterSort, onFilterSortChange }: InfluencerListControlsProps) => {
  const updateState = (updates: Partial<FilterSortState>) => {
    onFilterSortChange({ ...filterSort, ...updates });
  };

  const toggleSort = (field: string) => {
    if (filterSort.sortBy === field) {
      updateState({ sortOrder: filterSort.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      updateState({ sortBy: field, sortOrder: 'desc' });
    }
  };

  const getSortIcon = (field: string) => {
    if (filterSort.sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return filterSort.sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search influencers..."
          value={filterSort.searchTerm}
          onChange={(e) => updateState({ searchTerm: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Select value={filterSort.tierFilter} onValueChange={(value) => updateState({ tierFilter: value })}>
          <SelectTrigger>
            <SelectValue placeholder="All Tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="MEGA: 1MM+">MEGA: 1MM+</SelectItem>
            <SelectItem value="MACRO: 500K-1MM">MACRO: 500K-1MM</SelectItem>
            <SelectItem value="MID: 100K-500K">MID: 100K-500K</SelectItem>
            <SelectItem value="MICRO: 10K-100K">MICRO: 10K-100K</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSort.partnerTypeFilter} onValueChange={(value) => updateState({ partnerTypeFilter: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Partner Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Partners</SelectItem>
            <SelectItem value="NEW">New</SelectItem>
            <SelectItem value="REPEAT">Repeat</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterSort.platformFilter} onValueChange={(value) => updateState({ platformFilter: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="INSTAGRAM">Instagram</SelectItem>
            <SelectItem value="TIKTOK">TikTok</SelectItem>
            <SelectItem value="YOUTUBE">YouTube</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('followerCount')}
          className={filterSort.sortBy === 'followerCount' ? 'bg-primary/10' : ''}
        >
          Followers {getSortIcon('followerCount')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('engagementRate')}
          className={filterSort.sortBy === 'engagementRate' ? 'bg-primary/10' : ''}
        >
          Engagement {getSortIcon('engagementRate')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('totalRevenue')}
          className={filterSort.sortBy === 'totalRevenue' ? 'bg-primary/10' : ''}
        >
          Revenue {getSortIcon('totalRevenue')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('roas')}
          className={filterSort.sortBy === 'roas' ? 'bg-primary/10' : ''}
        >
          ROAS {getSortIcon('roas')}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => toggleSort('recentGrowth')}
          className={filterSort.sortBy === 'recentGrowth' ? 'bg-primary/10' : ''}
        >
          Growth {getSortIcon('recentGrowth')}
        </Button>
      </div>
    </div>
  );
};