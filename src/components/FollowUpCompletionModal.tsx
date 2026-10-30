import React, { useState } from 'react';
import { X, CheckCircle2, Clock } from 'lucide-react';
import { JobApplication } from '../types/job';
import { addDaysFromToday, getTodayString } from '../utils/dateUtils';

interface FollowUpCompletionModalProps {
  application: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (appId: string, newDate: string | undefined, note?: string) => void;
}

export const FollowUpCompletionModal: React.FC<FollowUpCompletionModalProps> = ({
  application,
  isOpen,
  onClose,
  onComplete,
}) => {
  if (!isOpen || !application) return null;

  const [actionType, setActionType] = useState<'clear' | 'reschedule'>('clear');
  const [newDate, setNewDate] = useState<string>(addDaysFromToday(7));
  const [followUpNote, setFollowUpNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'clear') {
      onComplete(application.id, undefined, followUpNote);
    } else {
      onComplete(application.id, newDate || undefined, followUpNote);
    }
    onClose();
  };

  const handleQuickPreset = (days: number) => {
    setActionType('reschedule');
    setNewDate(addDaysFromToday(days));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221F1F]/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E5E5DE] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-3.5 border-b border-[#E5E5DE] flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#221F1F]">
            Complete Follow-up · {application.company}
          </h3>
          <button
            onClick={onClose}
            className="text-[#221F1F]/40 hover:text-[#221F1F] p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Action Choice */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionType('clear')}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                actionType === 'clear'
                  ? 'border-[#221F1F] bg-[#221F1F] text-white shadow-xs'
                  : 'border-[#E5E5DE] text-[#221F1F]/70 hover:bg-[#F5F5F1]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Done (Clear date)</span>
            </button>

            <button
              type="button"
              onClick={() => setActionType('reschedule')}
              className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                actionType === 'reschedule'
                  ? 'border-[#E50914] bg-[#E50914] text-white shadow-xs'
                  : 'border-[#E5E5DE] text-[#221F1F]/70 hover:bg-[#F5F5F1]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Reschedule Follow-up</span>
            </button>
          </div>

          {actionType === 'reschedule' && (
            <div className="p-3 bg-[#F5F5F1] rounded-lg border border-[#E5E5DE] space-y-2.5">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickPreset(3)}
                  className="px-2.5 py-1 bg-white border border-[#E5E5DE] rounded text-xs text-[#221F1F] font-medium hover:bg-[#EAEAE5] cursor-pointer"
                >
                  +3 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(7)}
                  className="px-2.5 py-1 bg-white border border-[#E5E5DE] rounded text-xs text-[#221F1F] font-medium hover:bg-[#EAEAE5] cursor-pointer"
                >
                  +1 Week
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPreset(14)}
                  className="px-2.5 py-1 bg-white border border-[#E5E5DE] rounded text-xs text-[#221F1F] font-medium hover:bg-[#EAEAE5] cursor-pointer"
                >
                  +2 Weeks
                </button>
              </div>

              <input
                type="date"
                value={newDate}
                min={getTodayString()}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#E5E5DE] rounded-md text-xs text-[#221F1F] focus:outline-none focus:ring-1 focus:ring-[#221F1F]"
                required={actionType === 'reschedule'}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#221F1F] mb-1">
              Add Log Note (Optional)
            </label>
            <input
              type="text"
              value={followUpNote}
              onChange={(e) => setFollowUpNote(e.target.value)}
              placeholder="e.g. Sent email to recruiter; awaiting response"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#E5E5DE] rounded-lg placeholder-[#221F1F]/40 focus:outline-none focus:ring-1 focus:ring-[#221F1F] text-[#221F1F]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E5E5DE]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-[#221F1F]/70 hover:text-[#221F1F] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#E50914] hover:bg-[#B81D24] rounded-lg shadow-xs cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
