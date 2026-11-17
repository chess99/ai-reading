'use client';

import SettingsContent from '@/components/SettingsContent';
import ModalPanel from '@/components/ModalPanel';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  return (
    <ModalPanel title="设置" placement="center" isOpen={isOpen} onClose={onClose}>
      <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">
        <SettingsContent onNavigate={onClose} />
      </div>
    </ModalPanel>
  );
}
