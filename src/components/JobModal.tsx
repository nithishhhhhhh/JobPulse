import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { JobApplication, JobApplicationInput, ApplicationStatus } from '../types/job';
import { getTodayString } from '../utils/dateUtils';

interface JobModalProps {
  isOpen: boolean;
  initialData?: JobApplication | null;
  defaultStatus?: ApplicationStatus;
  onClose: () => void;
  onSave: (data: JobApplicationInput) => void;
}

const STATUS_OPTIONS: ApplicationStatus[] = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  initialData,
  defaultStatus = 'Applied',
  onClose,
  onSave,
}) => {
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [applicationDate, setApplicationDate] = useState(getTodayString());
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>(defaultStatus);
  const [interviewDate, setInterviewDate] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isArchived, setIsArchived] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setJobTitle(initialData.jobTitle || '');
      setJobLink(initialData.jobLink || '');
      setApplicationDate(initialData.applicationDate || getTodayString());
      setRecruiterName(initialData.recruiterName || '');
      setRecruiterEmail(initialData.recruiterEmail || '');
      setStatus(initialData.status || defaultStatus);
      setInterviewDate(initialData.interviewDate || '');
      setFollowUpDate(initialData.followUpDate || '');
      setNotes(initialData.notes || '');
      setIsArchived(initialData.isArchived || false);
    } else {
      setCompany('');
      setJobTitle('');
      setJobLink('');
      setApplicationDate(getTodayString());
      setRecruiterName('');
      setRecruiterEmail('');
      setStatus(defaultStatus);
      setInterviewDate('');
      setFollowUpDate('');
      setNotes('');
      setIsArchived(false);
    }
    setValidationError('');
  }, [initialData, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim()) {
      setValidationError('Please enter a company name.');
      return;
    }
    if (!jobTitle.trim()) {
      setValidationError('Please enter a job title.');
      return;
    }

    let formattedLink = jobLink.trim();
    if (formattedLink && !/^https?:\/\//i.test(formattedLink)) {
      formattedLink = 'https://' + formattedLink;
    }

    onSave({
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      jobLink: formattedLink || undefined,
      applicationDate: applicationDate || getTodayString(),
      recruiterName: recruiterName.trim() || undefined,
      recruiterEmail: recruiterEmail.trim() || undefined,
      status,
      interviewDate: interviewDate || undefined,
      followUpDate: followUpDate || undefined,
      notes: notes.trim() || undefined,
      isArchived,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#221F1F]/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="w-full max-w-xl bg-white rounded-xl shadow-xl border border-[#E5E5DE] overflow-hidden my-auto max-h-[92vh] flex flex-col transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E5E5DE] flex items-center justify-between shrink-0">
          <h2 className="text-sm font-bold text-[#221F1F]">
            {initialData ? 'Edit Application' : 'New Application'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#221F1F]/40 hover:text-[#221F1F] p-2 rounded-md transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Scrollable on small screens) */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {validationError && (
            <div className="p-2.5 bg-[#E50914]/10 border border-[#E50914]/30 rounded-lg text-xs font-semibold text-[#E50914]">
              {validationError}
            </div>
          )}

          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Company <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Company name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Job Title <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Frontend Engineer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>
          </div>

          {/* Status & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F] cursor-pointer"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Job Posting URL
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Applied Date
              </label>
              <input
                type="date"
                required
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Follow-up Date
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>
          </div>

          {/* Recruiter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Recruiter Name
              </label>
              <input
                type="text"
                placeholder="Name"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#221F1F] mb-1">
                Recruiter Email
              </label>
              <input
                type="email"
                placeholder="recruiter@company.com"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#221F1F] mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              placeholder="Key notes, interview rounds, prep questions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-[#E5E5DE] rounded-lg text-[#221F1F] placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F] resize-none"
            />
          </div>

          {/* Archive option */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="archiveCheckbox"
              checked={isArchived}
              onChange={(e) => setIsArchived(e.target.checked)}
              className="rounded border-[#E5E5DE] text-[#E50914] focus:ring-[#E50914] cursor-pointer"
            />
            <label htmlFor="archiveCheckbox" className="text-xs text-[#221F1F]/70 cursor-pointer">
              Archive this application (hide from active board)
            </label>
          </div>

          {/* Footer buttons */}
          <div className="pt-3 border-t border-[#E5E5DE] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#221F1F]/70 hover:text-[#221F1F] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#E50914] hover:bg-[#B81D24] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {initialData ? 'Save Changes' : 'Create Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
