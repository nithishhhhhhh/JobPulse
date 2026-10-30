import React, { useState } from 'react';
import {
  ExternalLink,
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  Edit2,
  Trash2,
  Archive,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';
import { formatDisplayDate, getFollowUpBadgeInfo } from '../utils/dateUtils';
import { getCompanyAvatar } from '../utils/avatarUtils';

interface JobCardProps {
  application: JobApplication;
  onView: (app: JobApplication) => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, currentArchived: boolean) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onCompleteFollowUp: (app: JobApplication) => void;
}

const ALL_STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const JobCard: React.FC<JobCardProps> = ({
  application,
  onView,
  onEdit,
  onDelete,
  onArchive,
  onStatusChange,
  onCompleteFollowUp,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const followUpBadge = getFollowUpBadgeInfo(application.followUpDate);
  const avatar = getCompanyAvatar(application.company);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('text/plain', application.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const isOverdue = followUpBadge.status === 'overdue';
  const isToday = followUpBadge.status === 'today';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onView(application)}
      className={`group relative bg-white rounded-xl border p-3.5 transition-all duration-150 cursor-pointer sm:cursor-grab active:cursor-grabbing hover:border-[#D0D0C8] hover:shadow-md select-none touch-manipulation ${
        isDragging
          ? 'opacity-30 scale-95 border-dashed border-[#E50914] shadow-none'
          : 'border-[#E5E5DE] shadow-2xs'
      } ${
        isOverdue
          ? 'border-[#E50914]/40 bg-gradient-to-b from-[#E50914]/5 to-white ring-1 ring-[#E50914]/20'
          : isToday
          ? 'border-[#B81D24]/40 bg-gradient-to-b from-[#B81D24]/5 to-white ring-1 ring-[#B81D24]/20'
          : ''
      }`}
    >
      {/* Top Header: Company Avatar + Name & Options */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.className}`}
          >
            {avatar.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h4 className="text-xs font-bold text-[#221F1F] truncate group-hover:text-[#E50914] transition-colors">
                {application.company}
              </h4>
              {application.jobLink && (
                <a
                  href={application.jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-[#221F1F]/40 hover:text-[#221F1F] transition-colors p-1 -m-1"
                  title="Open job link"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[11px] text-[#221F1F]/70 font-medium truncate mt-0.5">
              {application.jobTitle}
            </p>
          </div>
        </div>

        {/* Options & Quick Actions */}
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Quick Stage Dropdown for Mobile / Touch screens (since drag-and-drop doesn't exist on phones) */}
          <div className="sm:hidden relative">
            <select
              value={application.status}
              onChange={(e) => {
                e.stopPropagation();
                onStatusChange(application.id, e.target.value as ApplicationStatus);
              }}
              className="text-[10px] font-bold bg-[#EAEAE5] border border-[#DCDCD2] rounded-md px-1.5 py-1 text-[#221F1F] cursor-pointer focus:outline-none"
              title="Move stage"
            >
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  Move: {st}
                </option>
              ))}
            </select>
          </div>

          {/* 3-Dots Menu Button (expanded hitbox for touch) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 flex items-center justify-center text-[#221F1F]/40 hover:text-[#221F1F] hover:bg-[#EAEAE5] rounded-md transition-colors cursor-pointer"
              aria-label="Options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setMenuOpen(false)}
                />
                <div
                  className="absolute right-0 top-full mt-1 w-44 bg-white border border-[#E5E5DE] rounded-lg shadow-lg z-40 py-1 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onView(application);
                    }}
                    className="w-full px-3 py-2 text-left text-[#221F1F] hover:bg-[#F5F5F1] flex items-center gap-2 cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(application);
                    }}
                    className="w-full px-3 py-2 text-left text-[#221F1F] hover:bg-[#F5F5F1] flex items-center gap-2 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#221F1F]/40" />
                    Edit
                  </button>
                  {application.followUpDate && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onCompleteFollowUp(application);
                      }}
                      className="w-full px-3 py-2 text-left text-[#E50914] hover:bg-[#E50914]/5 flex items-center gap-2 cursor-pointer font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E50914]" />
                      Complete Follow-up
                    </button>
                  )}
                  <div className="my-1 border-t border-[#E5E5DE]" />
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#221F1F]/40 uppercase tracking-wider">
                    Move stage to
                  </div>
                  {ALL_STATUSES.filter((s) => s !== application.status).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onStatusChange(application.id, s);
                      }}
                      className="w-full px-3 py-2 text-left text-[#221F1F]/70 hover:bg-[#F5F5F1] flex items-center gap-1.5 cursor-pointer text-[11px]"
                    >
                      <ArrowRight className="w-3 h-3 text-[#221F1F]/40" />
                      {s}
                    </button>
                  ))}
                  <div className="my-1 border-t border-[#E5E5DE]" />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onArchive(application.id, application.isArchived);
                    }}
                    className="w-full px-3 py-2 text-left text-[#221F1F] hover:bg-[#F5F5F1] flex items-center gap-2 cursor-pointer"
                  >
                    <Archive className="w-3.5 h-3.5 text-[#221F1F]/40" />
                    Archive
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(application.id);
                    }}
                    className="w-full px-3 py-2 text-left text-[#E50914] hover:bg-[#E50914]/5 flex items-center gap-2 cursor-pointer font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Center Details: Recruiter or Interview */}
      {application.interviewDate ? (
        <div className="mt-2.5 px-2 py-1 rounded bg-[#EAEAE5] border border-[#DCDCD2] text-[11px] text-[#221F1F] font-medium flex items-center justify-between">
          <span className="flex items-center gap-1 font-semibold text-[#B81D24]">
            <Calendar className="w-3 h-3" />
            Interview
          </span>
          <span className="tabular-nums font-bold">
            {formatDisplayDate(application.interviewDate)}
          </span>
        </div>
      ) : application.recruiterName ? (
        <div className="mt-2 text-[11px] text-[#221F1F]/60 truncate">
          Contact: <span className="text-[#221F1F] font-semibold">{application.recruiterName}</span>
        </div>
      ) : null}

      {/* Card Footer: Timeline Date & Follow-up Status */}
      <div className="mt-3 pt-2.5 border-t border-[#E5E5DE] flex items-center justify-between gap-2 text-[11px]">
        {application.followUpDate ? (
          <div
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium ${
              isOverdue
                ? 'bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/30 font-semibold'
                : isToday
                ? 'bg-[#B81D24]/10 text-[#B81D24] border border-[#B81D24]/30 font-semibold'
                : 'bg-[#EAEAE5] text-[#221F1F]'
            }`}
          >
            <Clock className="w-3 h-3 shrink-0" />
            <span>{followUpBadge.label}</span>
          </div>
        ) : (
          <span className="text-[#221F1F]/40 font-medium">
            Applied: {formatDisplayDate(application.applicationDate)}
          </span>
        )}

        {/* Quick Follow-up Action shortcut if date set */}
        {application.followUpDate && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCompleteFollowUp(application);
            }}
            title="Mark follow-up done"
            className="text-[#221F1F]/40 hover:text-[#E50914] transition-colors p-1.5 -m-1 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
          >
            <CheckCircle2 className="w-4 h-4 text-[#E50914]" />
          </button>
        )}
      </div>
    </div>
  );
};
