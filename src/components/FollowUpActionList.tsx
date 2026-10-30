import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Mail,
  Search,
  ArrowUpDown,
  User,
} from 'lucide-react';
import { JobApplication } from '../types/job';
import { formatDisplayDate, getFollowUpBadgeInfo, getDaysDifference } from '../utils/dateUtils';
import { getCompanyAvatar } from '../utils/avatarUtils';

interface FollowUpActionListProps {
  applications: JobApplication[];
  onViewApplication: (app: JobApplication) => void;
  onEditApplication: (app: JobApplication) => void;
  onUpdateFollowUpDate: (id: string, newDate: string | undefined) => void;
  onCompleteFollowUp: (app: JobApplication) => void;
  onAddApplication: () => void;
}

type FollowUpFilter = 'all' | 'urgent' | 'upcoming';

export const FollowUpActionList: React.FC<FollowUpActionListProps> = ({
  applications,
  onViewApplication,
  onEditApplication,
  onUpdateFollowUpDate,
  onCompleteFollowUp,
  onAddApplication,
}) => {
  const [filter, setFilter] = useState<FollowUpFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const activeApps = applications.filter((app) => !app.isArchived);
  const followUpApps = activeApps.filter((app) => !!app.followUpDate);

  const filteredApps = followUpApps.filter((app) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = app.company.toLowerCase().includes(q);
      const matchRole = app.jobTitle.toLowerCase().includes(q);
      const matchRecruiter = (app.recruiterName || '').toLowerCase().includes(q);
      if (!matchCompany && !matchRole && !matchRecruiter) return false;
    }

    const diff = getDaysDifference(app.followUpDate!);
    if (filter === 'urgent') return diff <= 0;
    if (filter === 'upcoming') return diff > 0;
    return true;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    const diff = a.followUpDate!.localeCompare(b.followUpDate!);
    return sortAsc ? diff : -diff;
  });

  const urgentCount = followUpApps.filter(
    (app) => getDaysDifference(app.followUpDate!) <= 0
  ).length;

  return (
    <div className="space-y-4">
      {/* Sleek Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[#E5E5DE] shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-[#221F1F] text-[#F5F5F1] shadow-xs'
                : 'bg-[#EAEAE5] text-[#221F1F]/70 hover:text-[#221F1F]'
            }`}
          >
            All ({followUpApps.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('urgent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'urgent'
                ? 'bg-[#E50914] text-white shadow-xs'
                : 'bg-[#E50914]/10 text-[#E50914] hover:bg-[#E50914]/20 border border-[#E50914]/30'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Overdue & Today ({urgentCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('upcoming')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filter === 'upcoming'
                ? 'bg-[#221F1F] text-[#F5F5F1] shadow-xs'
                : 'bg-[#EAEAE5] text-[#221F1F]/70 hover:text-[#221F1F]'
            }`}
          >
            Upcoming
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-[#221F1F]/40 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search follow-ups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 pl-8 pr-3 py-1.5 text-xs bg-[#F5F5F1] border border-[#E5E5DE] rounded-lg placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F] focus:bg-white text-[#221F1F]"
            />
          </div>

          <button
            type="button"
            onClick={() => setSortAsc(!sortAsc)}
            title="Toggle sort direction"
            className="p-2 text-[#221F1F]/60 hover:text-[#221F1F] bg-[#EAEAE5] hover:bg-[#DFDFD6] rounded-lg transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {sortedApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E5DE] py-16 text-center px-4 shadow-xs">
          <Clock className="w-8 h-8 text-[#221F1F]/30 mx-auto stroke-[1.5] mb-2" />
          <p className="text-xs font-semibold text-[#221F1F]">No follow-ups found</p>
          <p className="text-[11px] text-[#221F1F]/50 mt-0.5">
            {filter === 'urgent'
              ? 'All caught up! No urgent follow-up items right now.'
              : 'Add a follow-up date to an application to track it here.'}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW: Touch-friendly Card List (sm:hidden) */}
          <div className="sm:hidden space-y-3">
            {sortedApps.map((app) => {
              const badge = getFollowUpBadgeInfo(app.followUpDate);
              const isOverdue = badge.status === 'overdue';
              const isToday = badge.status === 'today';
              const avatar = getCompanyAvatar(app.company);

              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl border p-4 shadow-xs space-y-3 transition-colors ${
                    isOverdue
                      ? 'border-[#E50914]/40 bg-gradient-to-b from-[#E50914]/5 to-white'
                      : isToday
                      ? 'border-[#B81D24]/40 bg-gradient-to-b from-[#B81D24]/5 to-white'
                      : 'border-[#E5E5DE]'
                  }`}
                >
                  {/* Company & Role Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.className}`}
                      >
                        {avatar.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => onViewApplication(app)}
                          className="font-bold text-[#221F1F] hover:text-[#E50914] text-xs truncate text-left cursor-pointer"
                        >
                          {app.company}
                        </button>
                        <p className="text-[11px] text-[#221F1F]/70 truncate">{app.jobTitle}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        app.status === 'Applied'
                          ? 'bg-[#221F1F]/10 text-[#221F1F]'
                          : app.status === 'Interviewing'
                          ? 'bg-[#E50914]/10 text-[#E50914]'
                          : app.status === 'Offer'
                          ? 'bg-[#B81D24]/10 text-[#B81D24]'
                          : 'bg-[#EAEAE5] text-[#221F1F]/60'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {/* Recruiter info if available */}
                  {app.recruiterName && (
                    <div className="text-xs text-[#221F1F]/70 flex items-center justify-between pt-1 border-t border-[#E5E5DE]/60">
                      <span className="text-[11px] text-[#221F1F]/50">Recruiter:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#221F1F] text-xs">{app.recruiterName}</span>
                        {app.recruiterEmail && (
                          <a
                            href={`mailto:${app.recruiterEmail}`}
                            className="text-[#E50914] hover:underline p-1"
                            title="Email recruiter"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date & Urgency Row */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E5E5DE]/60">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                        isOverdue
                          ? 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30'
                          : isToday
                          ? 'bg-[#B81D24]/10 text-[#B81D24] border border-[#B81D24]/30'
                          : 'bg-[#EAEAE5] text-[#221F1F]'
                      }`}
                    >
                      {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-[#E50914]" />}
                      {isToday && <Clock className="w-3.5 h-3.5 text-[#B81D24]" />}
                      <span>{badge.label}</span>
                    </span>

                    <input
                      type="date"
                      value={app.followUpDate || ''}
                      onChange={(e) => onUpdateFollowUpDate(app.id, e.target.value || undefined)}
                      className="px-2.5 py-1 text-xs border border-[#E5E5DE] rounded-md bg-[#F5F5F1] text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F] cursor-pointer"
                    />
                  </div>

                  {/* Bottom Action: Big Touch-friendly "Mark Done" Button */}
                  <button
                    type="button"
                    onClick={() => onCompleteFollowUp(app)}
                    className="w-full min-h-[44px] flex items-center justify-center gap-2 px-3 py-2 bg-[#221F1F] hover:bg-[#E50914] active:scale-[0.98] text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Follow-up Completed</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* DESKTOP/TABLET VIEW: Modern Data Table (hidden sm:block) */}
          <div className="hidden sm:block bg-white rounded-xl border border-[#E5E5DE] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E5E5DE] bg-[#ECECE6]/60 text-[#221F1F]/60 font-semibold text-[11px]">
                    <th className="py-2.5 px-4">Company</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Stage</th>
                    <th className="py-2.5 px-3">Recruiter</th>
                    <th className="py-2.5 px-3">Follow-up Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAE5]">
                  {sortedApps.map((app) => {
                    const badge = getFollowUpBadgeInfo(app.followUpDate);
                    const isOverdue = badge.status === 'overdue';
                    const isToday = badge.status === 'today';
                    const avatar = getCompanyAvatar(app.company);

                    return (
                      <tr
                        key={app.id}
                        className={`group transition-colors ${
                          isOverdue
                            ? 'bg-[#E50914]/5 hover:bg-[#E50914]/10'
                            : isToday
                            ? 'bg-[#B81D24]/5 hover:bg-[#B81D24]/10'
                            : 'hover:bg-[#F5F5F1]'
                        }`}
                      >
                        {/* Company */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-7 h-7 rounded-md border flex items-center justify-center font-bold text-[11px] shrink-0 ${avatar.className}`}
                            >
                              {avatar.initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onViewApplication(app)}
                                  className="font-bold text-[#221F1F] hover:text-[#E50914] transition-colors cursor-pointer text-xs truncate"
                                >
                                  {app.company}
                                </button>
                                {app.jobLink && (
                                  <a
                                    href={app.jobLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#221F1F]/40 hover:text-[#221F1F] transition-colors p-0.5"
                                    title="Job posting"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-3 px-3 text-[#221F1F]/80 font-medium whitespace-nowrap">
                          {app.jobTitle}
                        </td>

                        {/* Stage */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              app.status === 'Applied'
                                ? 'bg-[#221F1F]/10 text-[#221F1F]'
                                : app.status === 'Interviewing'
                                ? 'bg-[#E50914]/10 text-[#E50914]'
                                : app.status === 'Offer'
                                ? 'bg-[#B81D24]/10 text-[#B81D24]'
                                : 'bg-[#EAEAE5] text-[#221F1F]/60'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>

                        {/* Recruiter */}
                        <td className="py-3 px-3 whitespace-nowrap text-[#221F1F]/70">
                          {app.recruiterName ? (
                            <div className="flex items-center gap-1.5">
                              <span>{app.recruiterName}</span>
                              {app.recruiterEmail && (
                                <a
                                  href={`mailto:${app.recruiterEmail}`}
                                  className="text-[#221F1F]/40 hover:text-[#E50914]"
                                  title={app.recruiterEmail}
                                >
                                  <Mail className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="text-[#221F1F]/30">—</span>
                          )}
                        </td>

                        {/* Calendar Picker */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={app.followUpDate || ''}
                            onChange={(e) => onUpdateFollowUpDate(app.id, e.target.value || undefined)}
                            title="Change follow-up date"
                            className="px-2 py-1 text-xs border border-[#E5E5DE] rounded-md bg-white text-[#221F1F] shadow-2xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
                          />
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isOverdue
                                ? 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30'
                                : isToday
                                ? 'bg-[#B81D24]/10 text-[#B81D24] border border-[#B81D24]/30'
                                : 'bg-[#EAEAE5] text-[#221F1F]'
                            }`}
                          >
                            {isOverdue && <AlertCircle className="w-3 h-3 text-[#E50914]" />}
                            {isToday && <Clock className="w-3 h-3 text-[#B81D24]" />}
                            <span>{badge.label}</span>
                          </span>
                        </td>

                        {/* Action: Follow-up Completed */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onCompleteFollowUp(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#221F1F] hover:bg-[#E50914] rounded-lg transition-colors cursor-pointer shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>Done</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
