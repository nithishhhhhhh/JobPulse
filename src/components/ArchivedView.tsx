import React from 'react';
import { Archive, ArchiveRestore, Trash2, ExternalLink } from 'lucide-react';
import { JobApplication } from '../types/job';
import { formatDisplayDate } from '../utils/dateUtils';
import { getCompanyAvatar } from '../utils/avatarUtils';

interface ArchivedViewProps {
  applications: JobApplication[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (app: JobApplication) => void;
}

export const ArchivedView: React.FC<ArchivedViewProps> = ({
  applications,
  onRestore,
  onDelete,
  onView,
}) => {
  const archivedApps = applications.filter((app) => app.isArchived);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E5E5DE] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#221F1F]">
          <Archive className="w-4 h-4 text-[#221F1F]/50" />
          <span>Archived Applications</span>
        </div>
        <span className="text-xs font-semibold text-[#221F1F]/60 tabular-nums">
          {archivedApps.length} total
        </span>
      </div>

      {archivedApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E5DE] p-16 text-center shadow-xs">
          <Archive className="w-8 h-8 text-[#221F1F]/30 mx-auto stroke-[1.5] mb-2" />
          <p className="text-xs font-semibold text-[#221F1F]">No archived applications</p>
          <p className="text-[11px] text-[#221F1F]/50 mt-0.5">
            Applications archived from the board will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {archivedApps.map((app) => {
            const avatar = getCompanyAvatar(app.company);

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-[#E5E5DE] p-3.5 shadow-xs flex flex-col justify-between hover:border-[#D0D0C8] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 ${avatar.className}`}
                      >
                        {avatar.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4
                            onClick={() => onView(app)}
                            className="text-xs font-bold text-[#221F1F] truncate hover:text-[#E50914] cursor-pointer"
                          >
                            {app.company}
                          </h4>
                          {app.jobLink && (
                            <a
                              href={app.jobLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#221F1F]/40 hover:text-[#221F1F] p-0.5"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-[#221F1F]/70 font-medium truncate mt-0.5">
                          {app.jobTitle}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#EAEAE5] text-[#221F1F]/70 shrink-0">
                      {app.status}
                    </span>
                  </div>

                  <div className="mt-3 text-[11px] text-[#221F1F]/50 flex items-center gap-2">
                    <span>Applied: {formatDisplayDate(app.applicationDate)}</span>
                    {app.recruiterName && (
                      <>
                        <span>·</span>
                        <span className="truncate">{app.recruiterName}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E5E5DE] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onView(app)}
                    className="text-xs font-semibold text-[#221F1F]/70 hover:text-[#221F1F] cursor-pointer"
                  >
                    View
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onRestore(app.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#221F1F] hover:bg-[#E50914] rounded-md transition-colors cursor-pointer"
                    >
                      <ArchiveRestore className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(app.id)}
                      className="p-1 text-[#221F1F]/40 hover:text-[#E50914] rounded-md transition-colors cursor-pointer"
                      title="Delete permanently"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
