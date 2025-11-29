"use client";

export function ShimmerCard() {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="shimmer w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-5 w-3/4 rounded-lg" />
          <div className="shimmer h-4 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="shimmer h-4 w-full rounded-lg" />
      <div className="shimmer h-4 w-2/3 rounded-lg" />
    </div>
  );
}

export function ShimmerWorkerCard() {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-4">
        <div className="shimmer w-16 h-16 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="shimmer h-5 w-2/3 rounded-lg" />
          <div className="shimmer h-4 w-1/3 rounded-lg" />
          <div className="shimmer h-3 w-1/2 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="shimmer h-6 w-16 rounded-full" />
        <div className="shimmer h-6 w-20 rounded-full" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="shimmer h-6 w-24 rounded-lg" />
        <div className="shimmer h-8 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function ShimmerCategoryCard() {
  return (
    <div className="bg-white rounded-xl p-4 space-y-3">
      <div className="shimmer w-14 h-14 rounded-xl" />
      <div className="shimmer h-4 w-20 rounded-lg" />
      <div className="shimmer h-3 w-16 rounded-lg" />
    </div>
  );
}

export function ShimmerList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerCard key={i} />
      ))}
    </div>
  );
}

export function ShimmerWorkerList({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerWorkerCard key={i} />
      ))}
    </div>
  );
}

