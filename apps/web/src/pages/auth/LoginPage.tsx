import { NeumorphicCard, SoftInput, GlowButton } from "@pingcortex/ui";
import type { LoginRequest } from "@pingcortex/shared-types";
import { api } from "../../api/api";
import { useState } from "react";

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

export const LoginPage = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setErrorMessage("Veuillez remplir tous les champs obligatoire.");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.auth.login(formData);
        } catch (error) {
            setErrorMessage("Identifiants incorrects. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-neu-bg dark:bg-neu-dark-bg flex items-center justify-center p-4">
            <NeumorphicCard className="w-full max-w-md p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-25 h-25 rounded-full flex items-center justify-center bg-neu-bg dark:bg-neu-dark-bg shadow-neu-flat dark:shadow-neu-dark-flat p-3 mb-2">
                        <img className="w-full h-full object-contain" src="/logo.png" alt="Logo PingCortex" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary dark:text-white">
                        Ping<span className="text-blue-950">Cortex</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bienvenue sur votre espace d'apprentissage</p>
                </div>

                {errorMessage && (
                    <div className="p-3 rounded-neu-sm bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <SoftInput
                        label="Adresse Email"
                        name="email"
                        type="email"
                        placeholder="etudiant@pingcortex.com"
                        icon={<EmailIcon />}
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <SoftInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon />}
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-500/50 accent-brand-500 cursor-pointer"
                            />
                            Se souvenir de moi
                        </label>
                        <a href="#forgot" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
                            Mot de passe oublié ?
                        </a>
                    </div>

                    <GlowButton variant="primary" isGlowing className="w-full mt-2" disabled={isSubmitting}>
                        {isSubmitting ? "Connexion en cours..." : "Se connecter"}
                    </GlowButton>
                </form>

                <div className="text-center pt-4 border-t border-slate-300/40 dark:border-slate-800/40">
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Vous n'avez pas de compte ?{" "}
                        <a href="#register" className="text-brand-500 font-semibold hover:underline">
                            S'inscrire
                        </a>
                    </p>
                </div>
            </NeumorphicCard>
        </div>
    );
};