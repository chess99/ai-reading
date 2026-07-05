import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <p className="text-xs font-black tracking-[0.16em] text-brand mb-2">PREFERENCES</p>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-stone-950">设置</h1>
        </div>
        <SettingsContent />
      </div>
    </div>
  );
}
