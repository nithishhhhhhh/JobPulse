import React from 'react';
import { JobApplication, ViewMode, ApplicationStatus } from '../types/job';

interface StatSummaryProps {
  applications: JobApplication[];
  onSelectView: (view: ViewMode) => void;
  onFilterStatus: (status: 'ALL' | ApplicationStatus) => void;
  currentView: ViewMode;
  currentStatusFilter: 'ALL' | ApplicationStatus;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  applications,
  onSelectView,
  onFilterStatus,
  currentView,
  currentStatusFilter,
}) => {
  const activeApps = applications.filter((a) => !a.isArchived);

  const appliedCount = activeApps.filter((a) => a.status === 'Applied').length;
  const interviewingCount = activeApps.filter((a) => a.status === 'Interviewing').length;
  const offerCount = activeApps.filter((a) => a.status === 'Offer').length;

  const handleTotalActiveClick = () => {
    onSelectView('kanban');
    onFilterStatus('ALL');
  };

  const handleAppliedClick = () => {
    onSelectView('kanban');
    onFilterStatus('Applied');
  };

  const handleInterviewingClick = () => {
    onSelectView('kanban');
    onFilterStatus('Interviewing');
  };

  const handleOffersClick = () => {
    onSelectView('kanban');
    onFilterStatus('Offer');
  };

  const isTotalActiveSelected = currentView === 'kanban' && currentStatusFilter === 'ALL';
  const isAppliedSelected = currentView === 'kanban' && currentStatusFilter === 'Applied';
  const isInterviewingSelected = currentView === 'kanban' && currentStatusFilter === 'Interviewing';
  const isOfferSelected = currentView === 'kanban' && currentStatusFilter === 'Offer';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-6">
      {/* 1. Total Active */}
      <button
        type="button"
        onClick={handleTotalActiveClick}
        className={`text-left rounded-xl border p-3 sm:p-3.5 transition-all shadow-2xs cursor-pointer group ${
          isTotalActiveSelected
            ? 'bg-white border-[#221F1F] ring-1 ring-[#221F1F]'
            : 'bg-white border-[#E5E5DE] hover:border-[#221F1F]/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#221F1F]/60 uppercase tracking-wider block group-hover:text-[#221F1F] transition-colors">
            Total Active
          </span>
          <span className="text-[10px] text-[#221F1F]/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
            All →
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#221F1F] tabular-nums">
            {activeApps.length}
          </span>
          <span className="text-xs text-[#221F1F]/50">applications</span>
        </div>
      </button>

      {/* 2. Applied Stage */}
      <button
        type="button"
        onClick={handleAppliedClick}
        className={`text-left rounded-xl border p-3 sm:p-3.5 transition-all shadow-2xs cursor-pointer group ${
          isAppliedSelected
            ? 'bg-white border-[#221F1F] ring-1 ring-[#221F1F]'
            : 'bg-white border-[#E5E5DE] hover:border-[#221F1F]/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#221F1F]/60 uppercase tracking-wider block group-hover:text-[#221F1F] transition-colors">
            Applied
          </span>
          <span className="text-[10px] text-[#221F1F]/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
            Filter →
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#221F1F] tabular-nums">
            {appliedCount}
          </span>
          <span className="text-xs text-[#221F1F]/50">awaiting</span>
        </div>
      </button>

      {/* 3. Interviewing */}
      <button
        type="button"
        onClick={handleInterviewingClick}
        className={`text-left rounded-xl border p-3 sm:p-3.5 transition-all shadow-2xs cursor-pointer group ${
          isInterviewingSelected
            ? 'bg-white border-[#B81D24] ring-1 ring-[#B81D24]'
            : 'bg-white border-[#E5E5DE] hover:border-[#B81D24]/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#221F1F]/60 uppercase tracking-wider block group-hover:text-[#B81D24] transition-colors">
            Interviewing
          </span>
          <span className="text-[10px] text-[#B81D24] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
            Filter →
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#B81D24] tabular-nums">
            {interviewingCount}
          </span>
          <span className="text-xs text-[#221F1F]/50">in process</span>
        </div>
      </button>

      {/* 4. Offers */}
      <button
        type="button"
        onClick={handleOffersClick}
        className={`text-left rounded-xl border p-3 sm:p-3.5 transition-all shadow-2xs cursor-pointer group ${
          isOfferSelected
            ? 'bg-white border-[#E50914] ring-1 ring-[#E50914]'
            : 'bg-white border-[#E5E5DE] hover:border-[#E50914]/50'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#221F1F]/60 uppercase tracking-wider block group-hover:text-[#E50914] transition-colors">
            Offers
          </span>
          <span className="text-[10px] text-[#E50914] opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline">
            Filter →
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl font-bold text-[#E50914] tabular-nums">
            {offerCount}
          </span>
          <span className="text-xs text-[#221F1F]/50">received</span>
        </div>
      </button>
    </div>
  );
};
