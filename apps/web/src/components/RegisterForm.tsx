import { useState } from "react";
import { NeumorphicCard, SoftInput, GlowButton } from "@pingcortex/ui";

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

const UserIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const AcademicIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
);

export const RegisterForm = () => {
    const [step, setStep] = useState<number>(1);

    const stepsDetails = [
        { num: 1, title: "Identifiants", desc: "Email et sécurité" },
        { num: 2, title: "Profil", desc: "Informations personnelles" },
        { num: 3, title: "Confirmation", desc: "Validation du compte" },
    ];

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                        <SoftInput label="Email universitaire ou personnel" type="email" placeholder="etudiant@univ.mg" icon={<EmailIcon />} />
                        <SoftInput label="Mot de passe" type="password" placeholder="••••••••" icon={<LockIcon />} />
                        <SoftInput label="Vérifier le mot de passe" type="password" placeholder="••••••••" icon={<LockIcon />} />
                    </div>
                );
            case 2:
                return (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SoftInput label="Nom" type="text" placeholder="Rabe" icon={<UserIcon />} />
                            <SoftInput label="Prénom(s)" type="text" placeholder="Soa" icon={<UserIcon />} />
                        </div>
                        <SoftInput
                            label="Votre parcours actuel"
                            type="text"
                            placeholder="Ex: L1 Informatique, M1 Intelligence Artificielle..."
                            icon={<AcademicIcon />}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="flex flex-col gap-4 text-center py-4 animate-fadeIn">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-bold shadow-neu-pressed dark:shadow-neu-dark-pressed">
                            ✓
                        </div>
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-white">Presque terminé !</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            Vérifiez vos informations avant de finaliser la création de votre espace de révision PingCortex.
                        </p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-neu-bg dark:bg-neu-dark-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
                                            isCompleted ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-800"
                                        }`}
                                    />
                                )}
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                        isActive
                                        ? "bg-brand-500 text-white shadow-glow-primary scale-110"
                                        : isCompleted
                                        ? "bg-emerald-500 text-white shadow-neu-flat dark:shadow-neu-dark-flat"
                                        : "bg-neu-bg dark:bg-neu-dark-bg text-slate-400 shadow-neu-pressed dark:shadow-neu-dark-pressed"
                                    }`}
                                >
                                {isCompleted ? "✓" : s.num}
                            </div>

                        <div className="hidden lg:flex flex-col">
                            <span className={`text-sm font-semibold ${isActive ? "text-brand-500 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"}`}>
                                {s.title}
                            </span>
                            <span className="text-xs text-slate-400">{s.desc}</span>
                        </div>
                    </div>
                    );
                    })}
                </div>

                <NeumorphicCard className="lg:col-span-8 flex flex-col gap-6 p-6 sm:p-8">
                    <div className="flex items-center gap-4 border-b border-slate-300/40 dark:border-slate-800/40 pb-6">
                        <img src="/logo.png" alt="Logo PingCortex" className="w-20 h-20 object-contain" />
                        <div>
                        <h2 className="text-2xl font-extrabold tracking-tight text-primary dark:text-white">
                            Ping<span className="text-blue-900">Cortex</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Plateforme de tutorat intelligent par IA</p>
                        </div>
                    </div>

                    {renderStepContent()}

                    <div className="flex items-center justify-between pt-4 border-t border-slate-300/40 dark:border-slate-800/40">
                        {step > 1 ? (
                        <GlowButton variant="secondary" onClick={() => setStep(step - 1)}>
                            Précédent
                        </GlowButton>
                        ) : <div />}

                        <GlowButton
                            variant="primary"
                            isGlowing
                            onClick={() => {
                                if (step < 3) setStep(step + 1);
                            }}
                        >
                            {step === 3 ? "Finaliser l'inscription" : "Suivant"}
                        </GlowButton>
                    </div>
                </NeumorphicCard>

            </div>
        </div>
    );
};