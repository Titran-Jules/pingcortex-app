import { useState } from "react";
import { NeumorphicCard, SoftInput, GlowButton } from "@pingcortex/ui";


export const RegisterForm = () => {
    const [step, setStep] = useState<number>(1);

    const step1 = () => {
        return (
            <div className="flex flex-col gap-4">
                <SoftInput label="Email" type="email" />
                <SoftInput label="Mot de passe" type="password"/>
                <SoftInput label="Vérifier le mot de passe" type="password"/>
            </div>
        );
    };

    const step2 = () => {
        return (
            <div className="flex flex-col gap-4">
                <SoftInput label="Nom" type="text"/>
                <SoftInput label="Prénom(s)" type="text" />
                <SoftInput label="Parler nous de votre parcours actuel" type="text" placeholder="Ex: Je suis en 1ère année de licence informatique" />
            </div>
        );
    };

    const showStep = (stepActual: number) => {
        if (stepActual === 1) {
            return step1();
        } else if (stepActual === 2) {
            return step2();
        }
    }

    return (
        <div className="w-screen grid grid-cols-[30%_70%] items-center h-screen"> {/* Comment redimensioner un grid pour 30% et 70%*/}
            <div className="flex flex-col items-center">
                <div className={`w-15 h-15 rounded-full flex items-center justify-center ${step <= 1 ? 'bg-core-bg' : 'bg-secondary'}`}><div className={`w-10 h-10 bg-neu-bg rounded-full`}></div></div>
                <div className={`h-40 w-5 bg-core-bg ${step <= 1 ? 'bg-core-bg' : 'bg-secondary'}`}></div>
                <div className={`w-15 h-15 rounded-full flex items-center justify-center ${step <= 2 ? 'bg-core-bg' : 'bg-secondary'}`}><div className={`w-10 h-10 bg-neu-bg rounded-full`}></div></div>
                <div className={`h-40 w-5 bg-core-bg ${step <= 2 ? 'bg-core-bg' : 'bg-secondary'}`}></div>
                <div className={`w-15 h-15 rounded-full flex items-center justify-center ${step <= 3 ? 'bg-core-bg' : 'bg-secondary'}`}><div className={`w-10 h-10 bg-neu-bg rounded-full`}></div></div>
            </div>
            <NeumorphicCard className="w-200 flex flex-col gap-8 p-8">
                <div className="flex gap-8 items-center">
                    <img src="/logo.png" alt="Logo PingCortex" className="w-30 h-30"/>
                    <div>
                        <h2 className="text-[2rem] font-bold text-primary">Ping<span className="text-slate-800 dark:text-white">Cortex</span></h2>
                        <h3 className="text-[1.05rem] text-sub-text">AI-Powered Study Plateform</h3>
                    </div>
                </div>
                {showStep(step)}
                <div>
                    {step > 1 && (
                        <GlowButton variant="secondary" onClick={() => setStep(step - 1)} className="mr-4">
                            Précédent
                        </GlowButton>
                    )}
                    <GlowButton variant="primary" isGlowing onClick={() => {if (step < 3) setStep(step + 1)}}>
                        {step === 1 ? "Suivant" : "S'inscrire"}
                    </GlowButton>
                </div>
            </NeumorphicCard>
        </div>
    );
}