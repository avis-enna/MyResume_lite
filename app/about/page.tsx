import { redirect } from 'next/navigation';

export default function AboutPage() {
  // Redirect to the main page with about anchor
  redirect('/new-design#about');
}
