import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Executive Dashboard | VettPro',
  description: 'Strategic risk intelligence command center for C-suite executives',
};

export default function ExecutiveDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}