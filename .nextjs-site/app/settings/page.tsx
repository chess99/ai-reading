import { getAllBookMetas } from '@/lib/books';
import SettingsContent from '@/components/SettingsContent';

export default function SettingsPage() {
  const allBooks = getAllBookMetas();
  return (
    <div className="page-container">
      <div className="max-w-lg mx-auto">
        <SettingsContent allBooks={allBooks} />
      </div>
    </div>
  );
}
