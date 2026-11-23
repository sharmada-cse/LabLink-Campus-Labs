import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid3X3, List, X, SlidersHorizontal } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import EquipmentCard from '../components/EquipmentCard';
import { equipment } from '../data/mockData';
import type { Equipment, FilterOptions } from '../types';
import clsx from 'clsx';

const categories = ['All', 'microcontroller', 'computing', 'iot', 'robotics', 'measurement', 'fabrication', 'networking', 'sensors'];
const deptOptions = ['All', 'CSE', 'ECE', 'MECH', 'CHEM', 'BIO', 'PHY'];
const statusOptions = ['All', 'available', 'booked', 'maintenance'];

export default function EquipmentPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    department: 'All',
    status: 'All',
    sortBy: 'availability',
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...equipment];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(eq =>
        eq.name.toLowerCase().includes(q) ||
        eq.description.toLowerCase().includes(q) ||
        eq.tags.some(t => t.includes(q)) ||
        eq.department.toLowerCase().includes(q) ||
        eq.lab.toLowerCase().includes(q)
      );
    }

    if (filters.category !== 'All') {
      result = result.filter(eq => eq.category === filters.category);
    }

    if (filters.department !== 'All') {
      result = result.filter(eq => eq.department === filters.department);
    }

    if (filters.status !== 'All') {
      result = result.filter(eq => eq.status === filters.status);
    }

    switch (filters.sortBy) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'availability': result.sort((a, b) => b.availableCount - a.availableCount); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'bookings': result.sort((a, b) => b.totalBookings - a.totalBookings); break;
    }

    return result;
  }, [filters]);

  const handleBook = (eq: Equipment) => {
    navigate('/booking', { state: { equipment: eq } });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: 'All', department: 'All', status: 'All', sortBy: 'availability' });
  };

  const hasActiveFilters = filters.category !== 'All' || filters.department !== 'All' || filters.status !== 'All' || filters.search;

  return (
    <DashboardLayout
      title="Explore Equipment"
      subtitle={`${filtered.length} items found across all departments`}
    >
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search equipment, labs, keywords..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="input-field pl-11"
          />
          {filters.search && (
            <button onClick={() => setFilters(f => ({ ...f, search: '' }))}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={clsx('btn-secondary flex items-center gap-2 text-sm py-2 px-4',
              showFilters && 'border-cyan-500/60 text-cyan-300')}
          >
            <SlidersHorizontal size={16} /> Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
          </button>
          <div className="flex glass rounded-xl border border-white/10 overflow-hidden">
            <button onClick={() => setViewMode('grid')}
              className={clsx('p-2.5 transition-all', viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white')}>
              <Grid3X3 size={18} />
            </button>
            <button onClick={() => setViewMode('list')}
              className={clsx('p-2.5 transition-all', viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white')}>
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="glass rounded-2xl p-6 mb-6 border border-cyan-500/10 animate-slide-up">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="input-field text-sm"
              >
                {categories.map(c => <option key={c} value={c} className="bg-navy-800">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Department</label>
              <select
                value={filters.department}
                onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                className="input-field text-sm"
              >
                {deptOptions.map(d => <option key={d} value={d} className="bg-navy-800">{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Status</label>
              <select
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="input-field text-sm"
              >
                {statusOptions.map(s => <option key={s} value={s} className="bg-navy-800">{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-2 block">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value as FilterOptions['sortBy'] }))}
                className="input-field text-sm"
              >
                <option value="availability" className="bg-navy-800">Availability</option>
                <option value="rating" className="bg-navy-800">Rating</option>
                <option value="name" className="bg-navy-800">Name</option>
                <option value="bookings" className="bg-navy-800">Popularity</option>
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters}
              className="mt-4 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilters(f => ({ ...f, category: cat }))}
            className={clsx(
              'flex-shrink-0 text-xs font-medium px-4 py-2 rounded-full border transition-all',
              filters.category === cat
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : 'glass text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
            )}
          >
            {cat === 'All' ? 'All Equipment' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Filter size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No equipment found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search terms.</p>
          <button onClick={clearFilters} className="btn-secondary text-sm">Clear Filters</button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(eq => (
            <EquipmentCard key={eq.id} equipment={eq} onBook={handleBook} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(eq => (
            <EquipmentCard key={eq.id} equipment={eq} onBook={handleBook} compact />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
