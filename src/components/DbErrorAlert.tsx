import React from 'react';
import { AlertCircle } from 'lucide-react';

type DbErrorAlertProps = {
  error: string | null;
};

export function DbErrorAlert({ error }: DbErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
        <div>
          <h3 className="font-bold text-red-400 text-sm mb-1">Database Sync Error</h3>
          <p className="text-sm text-red-200/80 mb-2">{error}</p>
          <div className="text-xs text-red-200/60 p-3 bg-black/5 dark:bg-black/40 rounded-lg border border-red-500/20">
            <p className="font-bold mb-1">Possible Fixes:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Ensure that you ran the required SQL script in your Supabase SQL editor.</li>
              <li>Check that RLS policies allow <i>SELECT</i> and <i>INSERT</i> operations.</li>
              <li>Validate that the `prompts` table columns match the queries.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
