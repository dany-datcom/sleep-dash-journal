'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    user_id: 0,
    first_name: '',
    last_name: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'loading') return;

    if (!userId) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to view your profile.',
      });
      setIsLoading(false);
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${userId}`);

        if (!res.ok) {
          throw new Error('Failed to load profile');
        }

        const data: UserProfile = await res.json();

        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        setMessage({
          type: 'error',
          text: 'Could not load profile details.',
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [userId, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    if (!userId) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to update your profile.',
      });
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update profile');
      }

      const updated = await res.json();

      setProfile(updated);
      setFormData(updated);
      setIsEditing(false);

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });
    } catch (err) {
      console.error(err);

      setMessage({
        type: 'error',
        text: 'Could not update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!userId) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to delete your account.',
      });
      return;
    }

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete account');
      }

      alert('Account deleted successfully.');
      window.location.href = '/';
    } catch (err) {
      console.error(err);

      alert('Could not delete your account.');
      setShowDeleteModal(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text/70">Loading profile...</p>
      </main>
    );
  }

  if (!session || !userId) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text/70">
          You must be logged in to view your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text">
          Profile Management
        </h1>
        <p className="mt-2 text-text/60">
          Manage your personal information and account settings
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg border p-4 text-sm font-medium ${
            message.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
              : 'border-rose-500/30 bg-rose-500/10 text-rose-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="rounded-xl border border-secondary/30 bg-background/60 p-6 shadow-md backdrop-blur-sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-background shadow">
            {profile?.first_name?.[0]}
            {profile?.last_name?.[0]}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-text">
              {profile?.first_name} {profile?.last_name}
            </h2>

            <p className="text-sm text-text/60">
              User ID: #{profile?.user_id}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text/70">
                First Name
              </label>

              <input
                type="text"
                name="first_name"
                disabled={!isEditing}
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/30 bg-background/80 px-3 py-2 text-sm text-text transition focus:border-primary focus:outline-none disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-text/70">
                Last Name
              </label>

              <input
                type="text"
                name="last_name"
                disabled={!isEditing}
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-secondary/30 bg-background/80 px-3 py-2 text-sm text-text transition focus:border-primary focus:outline-none disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-text/70">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-secondary/30 bg-background/80 px-3 py-2 text-sm text-text transition focus:border-primary focus:outline-none disabled:opacity-60"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-secondary/20 pt-4">
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background shadow transition hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);

                    if (profile) {
                      setFormData(profile);
                    }
                  }}
                  className="cursor-pointer rounded-lg border border-accent/50 px-4 py-2 text-sm font-semibold text-text transition hover:bg-accent/10"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="cursor-pointer rounded-lg border border-accent bg-accent px-4 py-2 text-sm font-semibold text-background shadow transition-colors duration-200 hover:!bg-background hover:!text-accent"
              >
                Edit Profile
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer text-sm font-semibold text-accent hover:underline"
            >
              Delete Account
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-secondary/30 bg-background p-6 shadow-xl">
            <h3 className="text-xl font-bold text-accent">
              Delete Account
            </h3>

            <p className="mt-2 text-sm text-text/80">
              Are you sure you want to delete your profile? This action is
              permanent and will remove all your sleep journal entries.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="cursor-pointer rounded-lg border border-secondary/50 px-4 py-2 text-sm font-semibold text-text hover:bg-secondary/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
