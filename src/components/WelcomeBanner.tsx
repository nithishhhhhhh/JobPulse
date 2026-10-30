import React, { useState, useEffect } from 'react';
import { Plus, X, Sparkles, CheckCircle } from 'lucide-react';

interface WelcomeBannerProps {
  onOpenAddModal: () => void;
  hasApplications: boolean;
}

const STORAGE_KEY = 'jobpulse_welcome_dismissed';

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  onOpenAddModal,
  hasApplications,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      if (dismissed === 'true' && hasApplications) {
        setIsDismissed(true);
      }
    } catch {
      // ignore
    }
  }, [hasApplications]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5DE] p-5 sm:p-6 mb-6 shadow-xs relative overflow-hidden">
      {/* Decorative subtle pulse accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#B81D24] to-[#221F1F]" />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E50914]" />
            <h2 className="text-base sm:text-lg font-bold text-[#221F1F] tracking-tight">
              Welcome to JobPulse
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#221F1F]/80 leading-relaxed">
            This app helps you track your job applications, application status, interview dates, recruiter details, and follow-up dates in one clean, organized dashboard.
          </p>

          <p className="text-xs sm:text-sm font-medium text-[#221F1F]/90">
            Start by clicking <strong className="font-semibold text-[#E50914]">“Add Job Application”</strong> to record your first role.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#E50914] hover:bg-[#B81D24] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Job Application</span>
            </button>

            {hasApplications && (
              <button
                type="button"
                onClick={handleDismiss}
                className="text-xs font-semibold text-[#221F1F]/60 hover:text-[#221F1F] px-3 py-2 cursor-pointer transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {hasApplications && (
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1.5 text-[#221F1F]/40 hover:text-[#221F1F] hover:bg-[#EAEAE5] rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss welcome banner"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
