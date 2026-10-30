import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Check,
  X,
  Plus,
  CalendarClock,
  ArrowRight,
} from 'lucide-react';
import { JobApplication, JobApplicationInput, ApplicationStatus, ViewMode } from './types/job';
import { jobRepository } from './services/jobRepository';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { StatSummary } from './components/StatSummary';
import { KanbanBoard } from './components/KanbanBoard';
import { FollowUpActionList } from './components/FollowUpActionList';
import { ArchivedView } from './components/ArchivedView';
import { JobModal } from './components/JobModal';
import { JobDetailModal } from './components/JobDetailModal';
import { FollowUpCompletionModal } from './components/FollowUpCompletionModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { getDaysDifference } from './utils/dateUtils';

export default function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<ViewMode>('kanban');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApplicationStatus>('ALL');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<ApplicationStatus>('Applied');

  const [detailJob, setDetailJob] = useState<JobApplication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [followUpJob, setFollowUpJob] = useState<JobApplication | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);

  const [jobIdToDelete, setJobIdToDelete] = useState<string | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await jobRepository.getAll();
      setApplications(data);
    } catch {
      // Graceful fallback
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const handleOpenAddModal = (status?: ApplicationStatus) => {
    setEditingJob(null);
    setDefaultModalStatus(status || 'Applied');
    setIsJobModalOpen(true);
  };

  const handleOpenEditModal = (app: JobApplication) => {
    setEditingJob(app);
    setDefaultModalStatus(app.status);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (input: JobApplicationInput) => {
    try {
      if (editingJob) {
        const updated = await jobRepository.update(editingJob.id, input);
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        if (detailJob?.id === updated.id) {
          setDetailJob(updated);
        }
        showToast(`Updated ${input.company}`);
      } else {
        const created = await jobRepository.create(input);
        setApplications((prev) => [created, ...prev]);
        showToast(`Added ${input.company}`);
      }
    } catch (e) {
      console.error('Error saving application', e);
    }
  };

  const handleViewJob = (app: JobApplication) => {
    setDetailJob(app);
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    try {
      const updated = await jobRepository.updateStatus(id, newStatus);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (detailJob?.id === id) {
        setDetailJob(updated);
      }
      showToast(`${updated.company} moved to ${newStatus}`);
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleArchiveToggle = async (id: string, currentArchived: boolean) => {
    try {
      const nextArchived = !currentArchived;
      const updated = await jobRepository.setArchived(id, nextArchived);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (detailJob?.id === id) {
        setDetailJob(updated);
      }
      showToast(nextArchived ? `Archived ${updated.company}` : `Restored ${updated.company}`);
    } catch (e) {
      console.error('Failed to toggle archive', e);
    }
  };

  const handlePromptDelete = (id: string) => {
    setJobIdToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobIdToDelete) return;
    try {
      await jobRepository.delete(jobIdToDelete);
      setApplications((prev) => prev.filter((a) => a.id !== jobIdToDelete));
      if (detailJob?.id === jobIdToDelete) {
        setIsDetailModalOpen(false);
        setDetailJob(null);
      }
      showToast('Application deleted');
    } catch (e) {
      console.error('Failed to delete application', e);
    } finally {
      setIsConfirmDeleteOpen(false);
      setJobIdToDelete(null);
    }
  };

  const handleUpdateFollowUpDate = async (id: string, newDate: string | undefined) => {
    try {
      const updated = await jobRepository.setFollowUp(id, newDate);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      if (detailJob?.id === id) {
        setDetailJob(updated);
      }
      showToast(newDate ? `Follow-up set to ${newDate}` : 'Follow-up cleared');
    } catch (e) {
      console.error('Failed to update follow-up date', e);
    }
  };

  const handleOpenFollowUpModal = (app: JobApplication) => {
    setFollowUpJob(app);
    setIsFollowUpModalOpen(true);
  };

  const handleCompleteFollowUp = async (appId: string, newDate: string | undefined, note?: string) => {
    try {
      const updated = await jobRepository.setFollowUp(appId, newDate, note);
      setApplications((prev) => prev.map((a) => (a.id === appId ? updated : a)));
      if (detailJob?.id === appId) {
        setDetailJob(updated);
      }
      showToast(newDate ? `Follow-up updated for ${newDate}` : 'Follow-up completed');
    } catch (e) {
      console.error('Failed to complete follow-up', e);
    }
  };

  const filteredActiveApplications = useMemo(() => {
    return applications.filter((app) => {
      if (app.isArchived) return false;
      if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCompany = app.company.toLowerCase().includes(q);
        const matchRole = app.jobTitle.toLowerCase().includes(q);
        const matchRecruiter = (app.recruiterName || '').toLowerCase().includes(q);
        const matchNotes = (app.notes || '').toLowerCase().includes(q);
        return matchCompany || matchRole || matchRecruiter || matchNotes;
      }

      return true;
    });
  }, [applications, searchQuery, statusFilter]);

  const urgentFollowUpsCount = useMemo(() => {
    return applications.filter(
      (a) => !a.isArchived && a.followUpDate && getDaysDifference(a.followUpDate) <= 0
    ).length;
  }, [applications]);

  const archivedCount = useMemo(() => {
    return applications.filter((a) => a.isArchived).length;
  }, [applications]);

  return (
    <div className="min-h-screen bg-[#F5F5F1] flex flex-col text-[#221F1F] font-sans">
      {/* Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewJobModal={() => handleOpenAddModal('Applied')}
        urgentFollowUpsCount={urgentFollowUpsCount}
        archivedCount={archivedCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-5 pb-24 sm:pb-8">
        {/* Welcome Message for First-Time Users */}
        <WelcomeBanner
          onOpenAddModal={() => handleOpenAddModal('Applied')}
          hasApplications={applications.length > 0}
        />

        {/* Pipeline Metrics */}
        <StatSummary
          applications={applications}
          onSelectView={setCurrentView}
          onFilterStatus={setStatusFilter}
          currentView={currentView}
          currentStatusFilter={statusFilter}
        />

        {/* Quick-Access Follow-up Action List Banner on Main Screen */}
        {currentView === 'kanban' && (
          <div className="mb-4 bg-white border border-[#E5E5DE] rounded-xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  urgentFollowUpsCount > 0
                    ? 'bg-[#E50914] text-white'
                    : 'bg-[#221F1F]/5 text-[#221F1F]'
                }`}
              >
                <CalendarClock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-bold text-[#221F1F]">
                    Follow-up Action List
                  </h3>
                  {urgentFollowUpsCount > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E50914] text-white tabular-nums">
                      {urgentFollowUpsCount} need action
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#EAEAE5] text-[#221F1F]/70">
                      All up to date
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs text-[#221F1F]/60 mt-0.5">
                  {urgentFollowUpsCount > 0
                    ? `${urgentFollowUpsCount} job application${urgentFollowUpsCount > 1 ? 's have' : ' has'} follow-ups due today or overdue.`
                    : 'Organize recruiter check-ins, interview preparations, and upcoming follow-up dates.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentView('followup')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-[#221F1F] hover:bg-black text-[#F5F5F1] text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <span>Open Follow-up Action List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Kanban Filter & Search Bar */}
        {currentView === 'kanban' && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 mb-4 sm:mb-5">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-[#221F1F]/40 absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F] shadow-xs text-[#221F1F]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[#221F1F]/40 hover:text-[#221F1F] p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Stages & Main Add Job Application Button */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Single Unified Stage Selector Bar */}
              <div className="flex items-center gap-1 overflow-x-auto text-xs bg-[#EAEAE5] p-1 rounded-lg border border-[#DCDCD2]">
                {(['ALL', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const).map((st) => {
                  const count =
                    st === 'ALL'
                      ? applications.filter((a) => !a.isArchived).length
                      : applications.filter((a) => a.status === st && !a.isArchived).length;
                  const isActive = statusFilter === st;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#221F1F] text-[#F5F5F1] shadow-xs'
                          : 'text-[#221F1F]/70 hover:text-[#221F1F]'
                      }`}
                    >
                      <span>{st === 'ALL' ? 'All (4 Columns)' : st}</span>
                      <span
                        className={`text-[10px] px-1 rounded tabular-nums ${
                          isActive ? 'bg-white/20 text-white' : 'bg-black/5 text-[#221F1F]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Direct Add Job Application Button next to Board */}
              <button
                type="button"
                onClick={() => handleOpenAddModal('Applied')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E50914] hover:bg-[#B81D24] active:scale-[0.98] text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Job Application</span>
              </button>
            </div>
          </div>
        )}

        {/* Viewport */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-[#221F1F]/50 font-medium">Loading...</p>
          </div>
        ) : (
          <>
            {currentView === 'kanban' && (
              <KanbanBoard
                applications={filteredActiveApplications}
                selectedStatus={statusFilter}
                onAddApplication={handleOpenAddModal}
                onViewApplication={handleViewJob}
                onEditApplication={handleOpenEditModal}
                onDeleteApplication={handlePromptDelete}
                onArchiveApplication={handleArchiveToggle}
                onStatusChange={handleStatusChange}
                onCompleteFollowUp={handleOpenFollowUpModal}
              />
            )}

            {currentView === 'followup' && (
              <FollowUpActionList
                applications={applications}
                onViewApplication={handleViewJob}
                onEditApplication={handleOpenEditModal}
                onUpdateFollowUpDate={handleUpdateFollowUpDate}
                onCompleteFollowUp={handleOpenFollowUpModal}
                onAddApplication={() => handleOpenAddModal('Applied')}
              />
            )}

            {currentView === 'archived' && (
              <ArchivedView
                applications={applications}
                onRestore={(id) => handleArchiveToggle(id, true)}
                onDelete={handlePromptDelete}
                onView={handleViewJob}
              />
            )}
          </>
        )}
      </main>

      {/* Discreet Footer */}
      <footer className="hidden sm:block border-t border-[#E5E5DE] bg-white py-3 text-xs text-[#221F1F]/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <span className="font-bold text-[#221F1F] text-[11px]">JobPulse</span>
          <span className="text-[11px]">Job Application Tracker</span>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <JobModal
        isOpen={isJobModalOpen}
        initialData={editingJob}
        defaultStatus={defaultModalStatus}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
      />

      <JobDetailModal
        application={detailJob}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setDetailJob(null);
        }}
        onEdit={handleOpenEditModal}
        onDelete={handlePromptDelete}
        onArchiveToggle={handleArchiveToggle}
        onStatusChange={handleStatusChange}
        onOpenFollowUpModal={handleOpenFollowUpModal}
      />

      <FollowUpCompletionModal
        application={followUpJob}
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setFollowUpJob(null);
        }}
        onComplete={handleCompleteFollowUp}
      />

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Delete Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteOpen(false);
          setJobIdToDelete(null);
        }}
      />

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-4 right-4 z-50 bg-[#221F1F] text-[#F5F5F1] text-xs font-semibold px-3.5 py-2 rounded-lg shadow-lg border border-[#E50914]/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-3.5 h-3.5 text-[#E50914]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
