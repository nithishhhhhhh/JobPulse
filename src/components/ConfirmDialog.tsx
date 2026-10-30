import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221F1F]/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-xl border border-[#E5E5DE] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-2.5 rounded-lg shrink-0 ${
                isDestructive ? 'bg-[#E50914]/10 text-[#E50914]' : 'bg-[#EAEAE5] text-[#221F1F]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[#221F1F]">{title}</h3>
              <p className="mt-1 text-sm text-[#221F1F]/70 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-[#221F1F]/40 hover:text-[#221F1F] p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-semibold text-[#221F1F]/70 hover:text-[#221F1F] bg-[#EAEAE5] hover:bg-[#DFDFD6] rounded-lg transition-colors cursor-pointer"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer shadow-xs ${
                isDestructive
                  ? 'bg-[#E50914] hover:bg-[#B81D24]'
                  : 'bg-[#221F1F] hover:bg-[#221F1F]/90'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
