"use client";

import { CheckCircle, Clock, Truck, Wrench, Star } from 'lucide-react';
import { TimelineEvent } from '@/types';

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: 'var(--warning)', label: 'Request Sent' },
  accepted: { icon: CheckCircle, color: 'var(--primary)', label: 'Worker Accepted' },
  enroute: { icon: Truck, color: 'var(--info)', label: 'Worker En Route' },
  ongoing: { icon: Wrench, color: 'var(--accent)', label: 'Work In Progress' },
  completed: { icon: Star, color: 'var(--success)', label: 'Completed' },
  cancelled: { icon: Clock, color: 'var(--error)', label: 'Cancelled' },
  rejected: { icon: Clock, color: 'var(--error)', label: 'Rejected' },
};

interface TimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

export function BookingTimeline({ events, currentStatus }: TimelineProps) {
  return (
    <div className="timeline">
      {events.map((event, index) => {
        const config = statusConfig[event.status] || statusConfig.pending;
        const Icon = config.icon;
        const isCompleted = index < events.length - 1 || currentStatus === 'completed';
        const isActive = index === events.length - 1 && currentStatus !== 'completed';

        return (
          <div
            key={index}
            className={`timeline-item ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div
              className="absolute -left-5 top-1 w-4 h-4 rounded-full flex items-center justify-center"
              style={{
                background: isCompleted || isActive ? config.color : 'var(--bg-primary)',
                borderColor: config.color,
              }}
            >
              {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
            
            <div className="ml-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color: config.color }} />
                <span className="font-medium text-[var(--text-primary)]">{config.label}</span>
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">{event.note}</p>
              <p className="text-xs text-[var(--text-light)] mt-1">
                {new Date(event.time).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Animated status tracker
export function StatusTracker({ currentStatus }: { currentStatus: string }) {
  const statuses = ['pending', 'accepted', 'ongoing', 'completed'];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between px-4 py-6 bg-white rounded-2xl">
      {statuses.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={status} className="flex flex-col items-center relative">
            {/* Connector line */}
            {index < statuses.length - 1 && (
              <div
                className="absolute top-5 left-1/2 w-full h-0.5"
                style={{
                  background: index < currentIndex ? 'var(--success)' : 'var(--border-color)',
                }}
              />
            )}

            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                isActive ? 'animate-pulse-ring' : ''
              }`}
              style={{
                background: isCompleted || isActive ? config.color : 'var(--bg-secondary)',
                color: isCompleted || isActive ? 'white' : 'var(--text-tertiary)',
              }}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Label */}
            <span
              className="text-xs mt-2 font-medium text-center"
              style={{
                color: isCompleted || isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
              }}
            >
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

