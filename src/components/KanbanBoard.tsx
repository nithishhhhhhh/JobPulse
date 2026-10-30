import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { JobApplication, ApplicationStatus } from '../types/job';
import { JobCard } from './JobCard';

interface KanbanBoardProps {
  applications: JobApplication[];
  selectedStatus?: 'ALL' | ApplicationStatus;
  onAddApplication: (status?: ApplicationStatus) => void;
  onViewApplication: (app: JobApplication) => void;
  onEditApplication: (app: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
  onArchiveApplication: (id: string, currentArchived: boolean) => void;
  onStatusChange: (id: string, newStatus: ApplicationStatus) => void;
  onCompleteFollowUp: (app: JobApplication) => void;
}

interface ColumnConfig {
  status: ApplicationStatus;
  title: string;
  dotColor: string;
  countBg: string;
  topBorderColor: string;
  description: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'Applied',
    title: 'Applied',
    dotColor: 'bg-[#221F1F]',
    countBg: 'bg-[#221F1F] text-white',
    topBorderColor: 'border-t-[#221F1F]',
    description: 'Submitted',
  },
  {
    status: 'Interviewing',
    title: 'Interviewing',
    dotColor: 'bg-[#E50914]',
    countBg: 'bg-[#E50914] text-white',
    topBorderColor: 'border-t-[#E50914]',
    description: 'In Process',
  },
  {
    status: 'Offer',
    title: 'Offer',
    dotColor: 'bg-[#B81D24]',
    countBg: 'bg-[#B81D24] text-white',
    topBorderColor: 'border-t-[#B81D24]',
    description: 'Offers Received',
  },
  {
    status: 'Rejected',
    title: 'Rejected',
    dotColor: 'bg-[#71716D]',
    countBg: 'bg-[#71716D] text-white',
    topBorderColor: 'border-t-[#71716D]',
    description: 'Archived',
  },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  applications,
  selectedStatus = 'ALL',
  onAddApplication,
  onViewApplication,
  onEditApplication,
  onDeleteApplication,
  onArchiveApplication,
  onStatusChange,
  onCompleteFollowUp,
}) => {
  const [dragOverColumn, setDragOverColumn] = useState<ApplicationStatus | null>(null);

  const handleDragOver = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = (e: React.DragEvent, status: ApplicationStatus) => {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverColumn === status) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: ApplicationStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const appId = e.dataTransfer.getData('text/plain');
    if (appId) {
      onStatusChange(appId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        // If a specific stage is filtered, on mobile hide the other columns
        const isHiddenOnMobile = selectedStatus !== 'ALL' && selectedStatus !== col.status;
        const columnApps = applications.filter((app) => app.status === col.status && !app.isArchived);
        const isHovered = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={(e) => handleDragLeave(e, col.status)}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`flex flex-col bg-[#ECECE6]/70 rounded-2xl border border-t-[3px] transition-all duration-150 p-3 ${
              col.topBorderColor
            } ${
              isHiddenOnMobile ? 'hidden sm:flex' : 'flex'
            } min-h-[460px] sm:min-h-[600px] shadow-2xs ${
              isHovered
                ? 'border-[#E50914] bg-[#E50914]/5 ring-2 ring-[#E50914]/20 shadow-xs'
                : 'border-[#DFDFD6]'
            }`}
          >
            {/* Column Header Card */}
            <div className="bg-white rounded-xl border border-[#E5E5DE] px-3 py-2.5 flex items-center justify-between mb-3 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <div>
                  <h3 className="text-xs font-bold text-[#221F1F] tracking-tight leading-none">
                    {col.title}
                  </h3>
                  <span className="text-[10px] text-[#221F1F]/50 font-medium">
                    {col.description}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums shadow-2xs ${col.countBg}`}
                  title={`${columnApps.length} applications in ${col.title}`}
                >
                  {columnApps.length}
                </span>

                <button
                  type="button"
                  onClick={() => onAddApplication(col.status)}
                  title={`Add application to ${col.title}`}
                  className="w-7 h-7 flex items-center justify-center text-[#221F1F]/70 hover:text-white hover:bg-[#E50914] rounded-lg transition-colors cursor-pointer"
                  aria-label={`Add application to ${col.title}`}
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Cards List / Drop Target */}
            <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-270px)] pr-0.5">
              {columnApps.length === 0 ? (
                <div
                  className={`flex flex-col items-center justify-center p-8 rounded-xl border border-dashed text-center my-auto transition-colors ${
                    isHovered
                      ? 'border-[#E50914] bg-white/90'
                      : 'border-[#D4D4CA] bg-white/40'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mb-1.5 ${col.dotColor}`} />
                  <p className="text-xs font-bold text-[#221F1F]">{col.title}</p>
                  <p className="text-[11px] text-[#221F1F]/50 mt-0.5">No applications in this stage</p>
                  <button
                    type="button"
                    onClick={() => onAddApplication(col.status)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#221F1F] hover:text-white hover:bg-[#E50914] font-semibold cursor-pointer py-1.5 px-3 rounded-lg bg-white border border-[#E5E5DE] shadow-2xs transition-all"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add {col.title}</span>
                  </button>
                </div>
              ) : (
                columnApps.map((app) => (
                  <JobCard
                    key={app.id}
                    application={app}
                    onView={onViewApplication}
                    onEdit={onEditApplication}
                    onDelete={onDeleteApplication}
                    onArchive={onArchiveApplication}
                    onStatusChange={onStatusChange}
                    onCompleteFollowUp={onCompleteFollowUp}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
