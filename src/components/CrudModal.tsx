import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface CrudModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
}

export function CrudModal({ title, onClose, children, onSubmit, submitLabel = 'Save' }: CrudModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
          {children}
        </div>
        {onSubmit && (
          <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
            <button onClick={onSubmit} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors btn-press">{submitLabel}</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-foreground block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";
export const selectClass = inputClass;
