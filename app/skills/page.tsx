import { redirect } from 'next/navigation';

export default function SkillsPage() {
  // Redirect to the main page with skills anchor
  redirect('/new-design#skills');
}
