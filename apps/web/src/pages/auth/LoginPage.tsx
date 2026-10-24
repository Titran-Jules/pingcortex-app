import { NavLink } from "react-router-dom";
import { NeumorphicCard, SoftInput, Button } from "@pingcortex/ui";
import type { LoginRequest } from "@pingcortex/shared-types";
import { useState } from "react";
import { MailIcon, LockIcon } from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../errors/getErrorMessage";

export const LoginPage = () => {
    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: ""
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errorMessage) setErrorMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setErrorMessage("Veuillez remplir tous les champs obligatoires.");
            return;
        }
        setIsSubmitting(true);
        try {
            await login(formData);
        } catch (error) {
            setErrorMessage(getErrorMessage(error, "Erreur lors de la connexion."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-core-bg flex items-center justify-center p-4">
            <NeumorphicCard className="w-full max-w-md p-8 flex flex-col gap-6">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="w-25 h-25 rounded-full flex items-center justify-center bg-core-bg shadow-neu-flat p-3 mb-2">
                        <img className="w-full h-full object-contain" src="/logo.png" alt="Logo PingCortex" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-primary-strong">
                        Ping<span className="text-main-text">Cortex</span>
                    </h2>
                    <p className="text-xs text-sub-text">Bienvenue sur votre espace d'apprentissage</p>
                </div>

                {errorMessage && (
                    <div role="alert" className="p-3 rounded-neu-sm bg-danger/10 border border-danger/30 text-danger text-xs text-center font-medium">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <SoftInput
                        label="Adresse Email"
                        name="email"
                        type="email"
                        placeholder="etudiant@gmail.com"
                        icon={<MailIcon size={16}/>}
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                    <SoftInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockIcon size={16} />}
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                    />

                    <Button variant="primary" isGlowing className="w-full mt-2" loading={isSubmitting} type="submit">
                        Se connecter
                    </Button>
                </form>

                <div className="text-center pt-4 border-t border-sub-text/20">
                    <p className="text-xs sm:text-sm text-sub-text">
                        Vous n'avez pas de compte ?{" "}
                        <NavLink to="/register" className="text-secondary font-semibold hover:underline">
                            S'inscrire
                        </NavLink>
                    </p>
                </div>
            </NeumorphicCard>
        </div>
    );
};