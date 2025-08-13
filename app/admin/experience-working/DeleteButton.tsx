'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteButtonProps {
  experienceId: string;
}

export default function DeleteButton({ experienceId }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/admin/experience/${experienceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show updated data
        router.refresh();
      } else {
        alert('Failed to delete experience');
      }
    } catch (error) {
      console.error('Failed to delete experience:', error);
      alert('Failed to delete experience');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-600 hover:text-red-700 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
