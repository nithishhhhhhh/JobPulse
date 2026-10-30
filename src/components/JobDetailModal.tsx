import React from 'react';
import {
  X,
  ExternalLink,
  Calendar,
  Mail,
  Clock,
  Archive,
  ArchiveRestore,
  Trash2,
  Edit,
  CheckCircle2,
} from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';
import { formatDisplayDate, getFollowUpBadgeInfo } from '../utils/dateUtils';
import { getCompanyAvatar } from '../utils/avatarUtils';

interface JobDetailModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onArchiveToggle: (id: string, currentArchived: boolean) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onOpenFollowUpModal: (app: JobApplication) => void;
}

const ALL_STATUSES: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onArchiveToggle,
  onStatusChange,
  onOpenFollowUpModal,
}) => {
  if (!isOpen || !application) return null;

  const followUpBadge = getFollowUpBadgeInfo(application.followUpDate);
  const avatar = getCompanyAvatar(application.company);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#221F1F]/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-[#E5E5DE] overflow-hidden my-auto max-h-[92vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E5DE] flex items-start justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 ${avatar.className}`}
            >
              {avatar.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#221F1F]">
                  {application.company}
                </h3>
                {application.jobLink && (
                  <a
                    href={application.jobLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#221F1F]/40 hover:text-[#E50914] transition-colors p-0.5"
                    title="Open link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
              <p className="text-xs text-[#221F1F]/70 font-medium mt-0.5">{application.jobTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="p-1.5 text-[#221F1F]/40 hover:text-[#221F1F] hover:bg-[#EAEAE5] rounded-md transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#221F1F]/40 hover:text-[#221F1F] hover:bg-[#EAEAE5] rounded-md transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body (Scrollable on mobile) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Status Segmented Picker */}
          <div>
            <span className="text-[11px] font-semibold text-[#221F1F]/50 uppercase tracking-wider block mb-1.5">
              Stage
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#EAEAE5] rounded-lg border border-[#DCDCD2]">
              {ALL_STATUSES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(application.id, st)}
                  className={`py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    application.status === st
                      ? 'bg-white text-[#221F1F] shadow-xs'
                      : 'text-[#221F1F]/60 hover:text-[#221F1F]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-[#F5F5F1] rounded-lg border border-[#E5E5DE]">
              <span className="text-[10px] text-[#221F1F]/50 font-medium block">Applied</span>
              <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-[#221F1F]">
                <Calendar className="w-3.5 h-3.5 text-[#221F1F]/40" />
                <span>{formatDisplayDate(application.applicationDate)}</span>
              </div>
            </div>

            <div className="p-2.5 bg-[#F5F5F1] rounded-lg border border-[#E5E5DE]">
              <span className="text-[10px] text-[#221F1F]/50 font-medium block">Interview</span>
              <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-[#B81D24]">
                <Calendar className="w-3.5 h-3.5 text-[#B81D24]" />
                <span>
                  {application.interviewDate
                    ? formatDisplayDate(application.interviewDate)
                    : 'Not scheduled'}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-[#F5F5F1] rounded-lg border border-[#E5E5DE] col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#221F1F]/50 font-medium block">Follow-up</span>
                  <div className="flex items-center gap-1.5 mt-0.5 font-semibold text-[#221F1F]">
                    <Clock className="w-3.5 h-3.5 text-[#221F1F]/40" />
                    <span>
                      {application.followUpDate
                        ? `${formatDisplayDate(application.followUpDate)} (${followUpBadge.label})`
                        : 'None set'}
                    </span>
                  </div>
                </div>

                {application.followUpDate && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenFollowUpModal(application);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#E50914] hover:bg-[#B81D24] rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Complete</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Recruiter info */}
          {(application.recruiterName || application.recruiterEmail) && (
            <div className="p-3 bg-[#F5F5F1] rounded-lg border border-[#E5E5DE] text-xs">
              <span className="text-[10px] text-[#221F1F]/50 font-medium block mb-1">Recruiter</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#221F1F]">
                  {application.recruiterName || 'Contact'}
                </span>
                {application.recruiterEmail && (
                  <a
                    href={`mailto:${application.recruiterEmail}`}
                    className="flex items-center gap-1 text-[#E50914] hover:underline font-medium"
                  >
                    <Mail className="w-3 h-3" />
                    <span>{application.recruiterEmail}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <span className="text-[11px] font-semibold text-[#221F1F]/50 uppercase tracking-wider block mb-1.5">
              Notes
            </span>
            <div className="p-3 bg-[#F5F5F1] border border-[#E5E5DE] rounded-lg text-xs text-[#221F1F]/80 whitespace-pre-wrap leading-relaxed min-h-[60px]">
              {application.notes || <span className="text-[#221F1F]/40">No notes recorded.</span>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#E5E5DE] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onArchiveToggle(application.id, application.isArchived)}
              className="text-xs font-medium text-[#221F1F]/70 hover:text-[#221F1F] flex items-center gap-1.5 cursor-pointer"
            >
              {application.isArchived ? (
                <>
                  <ArchiveRestore className="w-3.5 h-3.5 text-[#B81D24]" />
                  <span>Restore</span>
                </>
              ) : (
                <>
                  <Archive className="w-3.5 h-3.5 text-[#221F1F]/40" />
                  <span>Archive</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(application.id);
              }}
              className="text-xs font-medium text-[#E50914] hover:text-[#B81D24] flex items-center gap-1.5 ml-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-[#221F1F] hover:text-[#221F1F] bg-[#EAEAE5] hover:bg-[#DFDFD6] rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
