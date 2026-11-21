import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
}

export default function PageHeading({ title, description, children }: PageHeadingProps) {
  return (
    <header className="page-heading">
      <div className="min-w-0">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {children}
    </header>
  );
}
