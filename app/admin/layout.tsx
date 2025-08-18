import { ThemeProvider } from '../components/ThemeProvider';
import '../styles/themes.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="admin-layout min-h-screen">
        {children}
      </div>
    </ThemeProvider>
  );
}
