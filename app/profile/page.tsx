'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';

export default function ProfilePage() {
  const userId = 1; // ID de prueba (hasta implementar auth)

  // Estados de datos y UI
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>({
    user_id: userId,
    first_name: '',
    last_name: '',
    email: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error('Failed to load profile');
        const data: UserProfile = await res.json();

        const userData = Array.isArray(data) ? data[0] : data;

        setProfile(userData);
        setFormData(userData);
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Could not load profile details.' });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

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

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Update route not ready on server yet.');
      }

      const updated = await res.json();
      setProfile(updated);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.warn('PUT endpoint pending, applying optimistic UI update:', err);
      setProfile(formData);
      setIsEditing(false);
      setMessage({
        type: 'success',
        text: 'Profile updated locally (Connect PUT route when backend is ready).',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete route not ready');
      
      alert('Account deleted successfully.');
      window.location.href = '/';
    } catch (err) {
      console.warn('DELETE endpoint pending:', err);
      alert('Delete route not implemented in backend yet.');
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-text">
        <p className="animate-pulse text-lg font-medium text-primary">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 text-text md:p-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 border-b border-secondary/20 pb-4">
          <h1 className="text-3xl font-bold text-primary">Profile Management</h1>
          <p className="text-sm text-text/70">Manage your personal information and account settings</p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-lg p-4 text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
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
              <p className="text-sm text-text/60">User ID: #{profile?.user_id}</p>
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
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background shadow transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) setFormData(profile);
                    }}
                    className="rounded-lg border border-secondary/50 px-4 py-2 text-sm font-semibold text-text transition hover:bg-secondary/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="cursor-pointer rounded-lg border border-secondary bg-secondary px-4 py-2 text-sm font-semibold text-background shadow transition-colors duration-200 hover:!bg-background hover:!text-secondary"
                >
                  Edit Profile
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="text-sm font-semibold text-accent hover:underline cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-secondary/30 bg-background p-6 shadow-xl">
            <h3 className="text-xl font-bold text-accent">Delete Account</h3>
            <p className="mt-2 text-sm text-text/80">
              Are you sure you want to delete your profile? This action is permanent and will remove all your sleep journal entries.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-secondary/50 px-4 py-2 text-sm font-semibold text-text hover:bg-secondary/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 cursor-pointer"
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