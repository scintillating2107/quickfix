"use client";

import { useState } from 'react';
import { Star, MapPin, IndianRupee, Clock, X } from 'lucide-react';

interface FilterChipsProps {
  onSortChange: (sort: string) => void;
  onPriceChange: (range: { min: number; max: number }) => void;
  onAvailabilityChange: (available: boolean) => void;
  currentSort: string;
  availableOnly: boolean;
}

export function FilterChips({
  onSortChange,
  onPriceChange,
  onAvailabilityChange,
  currentSort,
  availableOnly,
}: FilterChipsProps) {
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  const sortOptions = [
    { value: 'rating', label: 'Top Rated', icon: Star },
    { value: 'distance', label: 'Nearest', icon: MapPin },
    { value: 'price', label: 'Price: Low to High', icon: IndianRupee },
  ];

  return (
    <div className="space-y-3">
      {/* Sort Options */}
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onSortChange(option.value)}
            className={`filter-chip ${currentSort === option.value ? 'active' : ''}`}
          >
            <option.icon className="w-4 h-4" />
            {option.label}
          </button>
        ))}
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onAvailabilityChange(!availableOnly)}
          className={`filter-chip ${availableOnly ? 'active' : ''}`}
        >
          <Clock className="w-4 h-4" />
          Available Now
          {availableOnly && <X className="w-3 h-3 ml-1" />}
        </button>

        <button
          onClick={() => setShowPriceModal(true)}
          className="filter-chip"
        >
          <IndianRupee className="w-4 h-4" />
          Price Range
        </button>
      </div>

      {/* Price Range Modal */}
      {showPriceModal && (
        <div className="modal-overlay" onClick={() => setShowPriceModal(false)}>
          <div className="modal p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Set Price Range</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                  Minimum: ₹{priceRange.min}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm text-[var(--text-secondary)] mb-2 block">
                  Maximum: ₹{priceRange.max}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="100"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPriceModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPriceChange(priceRange);
                  setShowPriceModal(false);
                }}
                className="btn btn-primary flex-1"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

