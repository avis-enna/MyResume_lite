import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to the modern design page
  redirect('/new-design');
}
