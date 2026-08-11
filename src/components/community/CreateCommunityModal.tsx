import React, { useState } from 'react';
import { X, Users, Shield, Sparkles, Upload, Lock, Globe, Plus, Check } from 'lucide-react';
import { Community, CommunityCategory, CommunityType } from '../../types';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCommunity: (communityData: Partial<Community>) => void;
  showToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onCreateCommunity,
  showToast
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CommunityCategory>('athlete');
  const [sport, setSport] = useState('');
  const [type, setType] = useState<CommunityType>('public');
  const [rules, setRules] = useState('Be respectful, keep feedback constructive, and focus on performance improvement.');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      if (showToast) showToast('Please enter community name and description', 'error');
      return;
    }

    const newCommunity: Partial<Community> = {
      name: name.trim(),
      description: description.trim(),
      category,
      sport: sport.trim() || undefined,
      type,
      rules: rules.trim(),
      imageUrl: imageUrl.trim() || undefined,
      memberCount: 1,
      postCount: 0,
      isJoined: true,
      joinStatus: 'active',
      role: 'owner',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onCreateCommunity(newCommunity);
    if (showToast) showToast(`Community "${name}" created successfully!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto view-enter">
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--border-glass)] shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-glass)] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[var(--accent-1)]/15 border border-[var(--accent-1)]/30 text-[var(--accent-1)]">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text)] tracking-tight">
                Create Community
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Build a space for athletes, students, or coaches to connect and improve.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-glass)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Community Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Community Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Delhi Running Performance Club"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs sm:text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all font-semibold placeholder:text-[var(--text-faint)]"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Description *
            </label>
            <textarea
              required
              rows={3}
              placeholder="A community for runners to discuss technique, stride cadence, and biomechanical feedback..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all resize-none placeholder:text-[var(--text-faint)]"
            />
          </div>

          {/* Category & Sport */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all cursor-pointer"
              >
                <option value="athlete">Athletes</option>
                <option value="student">Students & Academics</option>
                <option value="coach">Coaches & Trainers</option>
                <option value="general">General / Sports Tech</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
                Sport / Topic (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Running, Football, Public Speaking"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all placeholder:text-[var(--text-faint)]"
              />
            </div>
          </div>

          {/* Community Type (Public / Private) */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Community Access Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('public')}
                className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                  type === 'public'
                    ? 'bg-[var(--accent-1)]/15 border-[var(--accent-1)] text-[var(--text)] shadow-md'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-glass)] text-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  {type === 'public' && <Check className="w-4 h-4 text-[var(--accent-1)]" />}
                </div>
                <div className="text-xs font-extrabold text-[var(--text)]">Public</div>
                <div className="text-[10px] text-[var(--text-muted)]">Anyone can discover and join instantly.</div>
              </button>

              <button
                type="button"
                onClick={() => setType('private')}
                className={`p-3.5 rounded-2xl border text-left space-y-1 transition-all cursor-pointer ${
                  type === 'private'
                    ? 'bg-amber-500/15 border-amber-500 text-[var(--text)] shadow-md'
                    : 'bg-[var(--bg-elevated)] border-[var(--border-glass)] text-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Lock className="w-4 h-4 text-amber-400" />
                  {type === 'private' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="text-xs font-extrabold text-[var(--text)]">Private</div>
                <div className="text-[10px] text-[var(--text-muted)]">Users need approval to join discussions.</div>
              </button>
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-mono block">
              Community Rules (Optional)
            </label>
            <textarea
              rows={2}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-glass)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent-1)] transition-all resize-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[var(--border-glass)]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-[var(--accent-1)] via-indigo-600 to-[var(--accent-2)] hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Community</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
