import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MailIcon, LockIcon, User2Icon, GraduationCap } from 'lucide-react';
import type { UserRegister } from "@pingcortex/shared-types";
import { NeumorphicCard, SoftInput, Button, toast } from "@pingcortex/ui";
import { getApiError } from "@pingcortex/api-client";
import { getErrorMessage } from "../../errors/getErrorMessage";

export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    level: string;
}

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState<RegisterFormData>({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        level: "",
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [step, setStep] = useState<number>(1);

    const stepsDetails = [
        { num: 1, title: "Identifiants", desc: "Email et sécurité" },
        { num: 2, title: "Profil", desc: "Informations personnelles" },
        { num: 3, title: "Confirmation", desc: "Validation du compte" },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name as keyof RegisterFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        if (submitError) setSubmitError(null);
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

        if (currentStep === 1) {
            if (!formData.email) newErrors.email = "L'adresse email est requise.";
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Format d'email invalide.";

            if (!formData.password) newErrors.password = "Le mot de passe est requis.";
            else if (formData.password.length < 8) newErrors.password = "Au moins 8 caractères requis.";

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
            }
        }

        if (currentStep === 2) {
            if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis.";
            if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis.";
            if (!formData.level.trim()) newErrors.level = "Votre parcours est requis.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const userRegisterPayload = (): UserRegister => {
        return {
            email: formData.email.trim(),
            name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            password: formData.password,
            level: formData.level.trim(),
        };
    };

    const handleFinalSubmit = async () => {
        if (!validateStep(1) || !validateStep(2)) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const outcome = await register(userRegisterPayload());
            if (outcome === 'registered') {
                toast.success('Compte créé', 'Connecte-toi pour continuer.');
                navigate('/login', { replace: true });
            }
        } catch (error) {
            const { code } = getApiError(error);
            if (code === 'EMAIL_ALREADY_EXISTS') {
                setErrors({ email: getErrorMessage(error, "Cette adresse email est déjà utilisée.") });
                setStep(1);
            } else {
                setSubmitError(getErrorMessage(error, "Erreur lors de l'inscription."));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-core-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-4 flex lg:flex-col justify-between lg:justify-center gap-25 p-4">
                    {stepsDetails.map((s, index) => {
                        const isActive = step === s.num;
                        const isCompleted = step > s.num;

                        return (
                            <div key={s.num} className="flex items-center gap-4 relative">
                                {index < stepsDetails.length - 1 && (
                                    <div
                                        className={`hidden lg:block absolute left-6 top-12 w-0.5 h-25 transition-colors duration-300 ${
                                            isCompleted ? "bg-success" : "bg-sub-text/20"
                                        }`}
                                    />
                                )}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        isActive
                                        ? "bg-secondary text-on-secondary shadow-glow-primary scale-110"
                                        : isCompleted
                                        ? "bg-success text-on-secondary shadow-neu-flat"
                                        : "bg-core-bg text-sub-text shadow-neu-pressed"
                                    }`}
                                >
                                    {isCompleted ? "✓" : s.num}
                                </div>

                                <div className="hidden lg:flex flex-col">
                                    <span className={`text-sm font-semibold ${isActive ? "text-secondary" : "text-sub-text"}`}>
                                        {s.title}
                                    </span>
                                    <span className="text-xs text-sub-text">{s.desc}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <NeumorphicCard className="lg:col-span-8 flex flex-col gap-6 p-6 sm:p-8">
                    <div className="flex items-center gap-4 border-b border-sub-text/20 pb-6">
                        <img src="/logo.png" alt="Logo PingCortex" className="w-16 h-16 object-contain" />
                        <div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-primary-strong">
                                Ping<span className="text-main-text">Cortex</span>
                            </h2>
                            <p className="text-xs text-sub-text">Plateforme de tutorat intelligent par IA</p>
                        </div>
                    </div>

                    {submitError && (
                        <div role="alert" className="p-3 rounded-neu-sm bg-danger/10 border border-danger/30 text-danger text-xs text-center font-medium">
                            {submitError}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="flex flex-col gap-4">
                            <SoftInput
                                label="Adresse Email"
                                name="email"
                                type="email"
                                placeholder="etudiant@gmail.com"
                                icon={<MailIcon size={16}/>}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                autoComplete="email"
                            />
                            <SoftInput
                                label="Mot de passe"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                icon={<LockIcon size={16}/>}
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                autoComplete="new-password"
                            />
                            <SoftInput
                                label="Vérifier le mot de passe"
                                name="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                icon={<LockIcon size={16} />}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                autoComplete="new-password"
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <SoftInput
                                    label="Nom"
                                    name="lastName"
                                    type="text"
                                    placeholder="ANDRIANATOMBO"
                                    icon={<User2Icon size={16} />}
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    error={errors.lastName}
                                    autoComplete="family-name"
                                />
                                <SoftInput
                                    label="Prénom(s)"
                                    name="firstName"
                                    type="text"
                                    placeholder="Jules Titran"
                                    icon={<User2Icon size={16} />}
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    error={errors.firstName}
                                    autoComplete="given-name"
                                />
                            </div>
                            <SoftInput
                                label="Votre parcours actuel"
                                name="level"
                                type="text"
                                placeholder="Ex: L1 Informatique, M1 Intelligence Artificielle..."
                                icon={<GraduationCap size={16} />}
                                value={formData.level}
                                onChange={handleChange}
                                error={errors.level}
                            />
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col gap-4 text-center py-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center text-2xl font-bold shadow-neu-pressed">
                                ✓
                            </div>
                            <h4 className="text-lg font-semibold text-sub-text">Récapitulatif des informations</h4>
                            <div className="text-left bg-core-bg p-4 rounded-neu-sm shadow-neu-pressed text-xs sm:text-sm space-y-2">
                                <p><strong className="text-sub-text">Email :</strong> {formData.email}</p>
                                <p><strong className="text-sub-text">Nom & Prénom(s) :</strong> {formData.lastName} {formData.firstName}</p>
                                <p><strong className="text-sub-text">Parcours :</strong> {formData.level}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-sub-text/20 dark:border-slate-800/40">
                        {step > 1 ? (
                            <Button variant="secondary" onClick={() => setStep(step - 1)}>
                                Précédent
                            </Button>
                        ) : <div />}

                        {step < 3 ? (
                            <Button variant="primary" isGlowing onClick={handleNextStep}>
                                Suivant
                            </Button>
                        ) : (
                            <Button variant="primary" isGlowing disabled={isSubmitting} loading={isSubmitting} onClick={handleFinalSubmit}>
                                Finaliser l'inscription
                            </Button>
                        )}
                    </div>
                </NeumorphicCard>
            </div>
        </div>
    );
};