import React from 'react';
import {
  Kanban,
  CalendarClock,
  Archive,
  Plus,
} from 'lucide-react';
import { ViewMode } from '../types/job';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenNewJobModal: () => void;
  urgentFollowUpsCount: number;
  archivedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onOpenNewJobModal,
  urgentFollowUpsCount,
  archivedCount,
}) => {
  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E5E5DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-3">
            {/* Brand Logo & Title */}
            <button
              type="button"
              onClick={() => onViewChange('kanban')}
              className="flex items-center gap-2.5 shrink-0 text-left cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#221F1F] text-white flex items-center justify-center shadow-xs ring-1 ring-[#221F1F]/20 transition-transform group-hover:scale-105">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <rect x="3" y="7" width="18" height="13" rx="2.5" stroke="#F5F5F1" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#F5F5F1" />
                  <path d="M6.5 13.5h3l1.5-3 2 5.5 1.5-2.5h3" stroke="#E50914" strokeWidth="2.4" />
                </svg>
              </div>
              <span className="font-bold text-[#221F1F] text-sm tracking-tight group-hover:text-[#E50914] transition-colors">
                JobPulse
              </span>
            </button>

            {/* Central Segmented View Switcher (Desktop & Tablet) */}
            <nav className="hidden sm:flex items-center p-1 bg-[#EAEAE5] rounded-lg border border-[#DCDCD2] text-xs">
              <button
                type="button"
                onClick={() => onViewChange('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  currentView === 'kanban'
                    ? 'bg-white text-[#221F1F] shadow-xs font-semibold'
                    : 'text-[#221F1F]/70 hover:text-[#221F1F]'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>

              <button
                type="button"
                onClick={() => onViewChange('followup')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  currentView === 'followup'
                    ? 'bg-white text-[#221F1F] shadow-xs font-semibold'
                    : 'text-[#221F1F]/70 hover:text-[#221F1F]'
                }`}
              >
                <CalendarClock className="w-3.5 h-3.5" />
                <span>Follow-up Action List</span>
                {urgentFollowUpsCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#E50914] text-white tabular-nums leading-none">
                    {urgentFollowUpsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => onViewChange('archived')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  currentView === 'archived'
                    ? 'bg-white text-[#221F1F] shadow-xs font-semibold'
                    : 'text-[#221F1F]/70 hover:text-[#221F1F]'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
                {archivedCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-[#DCDCD2] text-[#221F1F] tabular-nums leading-none">
                    {archivedCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Right Action: Add Job Application */}
            <div className="flex items-center shrink-0">
              <button
                type="button"
                onClick={onOpenNewJobModal}
                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#E50914] hover:bg-[#B81D24] active:scale-[0.98] text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-all cursor-pointer min-h-[40px]"
                aria-label="Add Job Application"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Add Job Application</span>
                <span className="sm:hidden">Add Job</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5E5DE] h-16 grid grid-cols-3 items-center px-2 shadow-lg">
        <button
          type="button"
          onClick={() => onViewChange('kanban')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors ${
            currentView === 'kanban'
              ? 'text-[#E50914] font-semibold'
              : 'text-[#221F1F]/60 hover:text-[#221F1F]'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[11px] mt-1">Kanban Board</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange('followup')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
            currentView === 'followup'
              ? 'text-[#E50914] font-semibold'
              : 'text-[#221F1F]/60 hover:text-[#221F1F]'
          }`}
        >
          <div className="relative">
            <CalendarClock className="w-5 h-5" />
            {urgentFollowUpsCount > 0 && (
              <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#E50914] text-white tabular-nums">
                {urgentFollowUpsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Follow-ups</span>
        </button>

        <button
          type="button"
          onClick={() => onViewChange('archived')}
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-colors relative ${
            currentView === 'archived'
              ? 'text-[#E50914] font-semibold'
              : 'text-[#221F1F]/60 hover:text-[#221F1F]'
          }`}
        >
          <div className="relative">
            <Archive className="w-5 h-5" />
            {archivedCount > 0 && (
              <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#221F1F] text-white tabular-nums">
                {archivedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1">Archive</span>
        </button>
      </nav>
    </>
  );
};
