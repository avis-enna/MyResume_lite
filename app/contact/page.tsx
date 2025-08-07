import { redirect } from 'next/navigation';

export default function ContactPage() {
  // Redirect to the main page with contact anchor
  redirect('/new-design#contact');
}
