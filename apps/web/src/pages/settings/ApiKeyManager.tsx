import React, { useState } from 'react';
import {
  KeyRound,
    Plus,
    Trash2,
    Power,
    ShieldCheck,
    Loader2,
    Calendar,
    X,
    Cpu,
} from 'lucide-react';
import type { ApiKeyResponse, Provider } from '@pingcortex/shared-types'

const MOCK_API_KEYS: ApiKeyResponse[] = [
  {
    id: 'c3d4e5f6-7890-1234-abcd-ef5678901234',
    provider: 'ANTHROPIC',
    isActive: true,
    createdAt: '2026-09-04T15:27:00Z',
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d4e5',
    provider: 'OPENAI',
    isActive: false,
    createdAt: '2026-09-10T11:15:00Z',
  },
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    provider: 'GEMINI',
    isActive: false,
    createdAt: '2026-09-18T09:40:00Z',
  },
];

export const ApiKeyManager: React.FC = () => {
    const [keys, setKeys] = useState<ApiKeyResponse[]>(MOCK_API_KEYS);
    const [showModal, setShowModal] = useState(false);

    const [provider, setProvider] = useState<Provider>('GEMINI');
    const [apiKey, setApiKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggleActive = (targetId: string, currentStatus: boolean) => {
        const newStatus = !currentStatus;

        setKeys((prevKeys) =>
        prevKeys.map((key) => {
            if (key.id === targetId) {
            return { ...key, isActive: newStatus };
            }
            return newStatus ? { ...key, isActive: false } : key;
        })
        );
        // await api.patch(`/users/me/api-keys/${targetId}`, { isActive: newStatus });
    };

    const handleDelete = (id: string) => {
        setKeys((prev) => prev.filter((key) => key.id !== id));
        // await api.delete(`/users/me/api-keys/${id}`);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) return;

        setIsSubmitting(true);

        setTimeout(() => {
        const newKeyResponse: ApiKeyResponse = {
            id: crypto.randomUUID(),
            provider,
            isActive: false,
            createdAt: new Date().toISOString(),
        };

        setKeys((prev) => [newKeyResponse, ...prev]);
        setIsSubmitting(false);
        setShowModal(false);
        setApiKey('');
        }, 500);
    };

    const getProviderBadge = (prov: string) => {
        const p = prov.toLowerCase();
        switch (p) {
        case 'anthropic':
            return { label: 'Anthropic (Claude)', color: 'text-amber-600 bg-amber-500/10' };
        case 'openai':
            return { label: 'OpenAI (GPT)', color: 'text-emerald-600 bg-emerald-500/10' };
        case 'gemini':
        default:
            return { label: 'Google Gemini', color: 'text-indigo-600 bg-indigo-500/10' };
        }
    };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-sub-text flex items-center gap-3">
            <div className="p-2.5 rounded-neu-sm bg-core-bg shadow-neu-flat text-secondary">
              <KeyRound size={22} />
            </div>
            Clés API d'IA
          </h2>
          <p className="text-xs text-sub-text mt-1">
            Gérez vos clés d'accès aux LLMs. Une seule clé peut être active à la fois.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-neu-md bg-secondary text-white text-xs font-bold shadow-glow-primary active:scale-95 transition-all"
        >
          <Plus size={18} /> Ajouter une clé
        </button>
      </div>

      <div className="space-y-4">
        {keys.length == 0 &&
            <div className='flex items-center justify-center p-6 rounded-neu-md bg-core-bg shadow-neu-flat text-sub-text text-sm font-bold'>
                Vous n'avez pas encore ajouté de clé.
            </div>
        }
        {keys.map((item) => {
          const badge = getProviderBadge(item.provider);
          const formattedDate = new Date(item.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={item.id}
              className={`p-5 rounded-neu-md bg-core-bg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/20 dark:border-slate-800/50 ${
                item.isActive
                  ? 'shadow-neu-flat ring-2 ring-secondary/40'
                  : 'shadow-neu-pressed opacity-75'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-neu-sm bg-core-bg shadow-neu-flat text-sub-text">
                  <Cpu size={20} className="text-secondary" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>

                    {item.isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                        <ShieldCheck size={13} /> Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-sub-text 500 font-mono">
                    <span>ID: {item.id.slice(0, 8)}...</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> Ajoutée le {formattedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/50 dark:border-slate-800/50">
                <button
                  onClick={() => handleToggleActive(item.id, item.isActive)}
                  title={item.isActive ? 'Désactiver la clé' : 'Activer cette clé'}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-neu-sm text-xs font-bold transition-all ${
                    item.isActive
                      ? 'bg-emerald-500 text-white shadow-glow-success'
                      : 'bg-core-bg text-sub-text shadow-neu-flat'
                  }`}
                >
                  <Power size={15} />
                  {item.isActive ? 'Active' : 'Activer'}
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  title="Supprimer"
                  className="p-2.5 rounded-neu-sm bg-core-bg shadow-neu-flat text-sub-text hover:text-rose-500 transition-all active:scale-95"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-neu-lg bg-core-bg shadow-neu-flat border border-white/30 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-sub-text flex items-center gap-2">
                <KeyRound size={18} className="text-secondary" /> Ajouter une clé d'API
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-neu-sm bg-core-bg shadow-neu-flat text-sub-text"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-sub-text">
                  Fournisseur d'IA (*Provider*)
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as Provider)}
                  className="w-full px-4 py-3 rounded-neu-sm bg-core-bg shadow-neu-pressed text-xs font-bold text-sub-text outline-none border-none"
                >
                  <option value={"GEMINI" as Provider}>Google Gemini</option>
                  <option value={"ANTHROPIC" as Provider}>Anthropic (Claude)</option>
                  <option value={"OPENAI" as Provider}>OpenAI (ChatGPT)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-sub-text">
                  Clé d'API secrète
                </label>
                <input
                  type="password"
                  placeholder="sk-ant-... ou AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-neu-sm bg-core-bg shadow-neu-pressed text-xs font-mono text-sub-text outline-none border-none placeholder:text-sub-text"
                  required
                />
                <p className="text-[10px] text-sub-text">
                  La clé est chiffrée côté serveur dès sa réception.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-neu-sm text-xs font-bold text-sub-text"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-neu-sm bg-secondary text-white font-bold text-xs shadow-glow-primary disabled:opacity-50 transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Enregistrer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};