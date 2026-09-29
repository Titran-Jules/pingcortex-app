import { NeumorphicCard, SoftInput, GlowButton } from "@pingcortex/ui"

export const LoginForm = () => {
    return (
        <NeumorphicCard className="max-w-md mx-auto my-auto p-8 flex flex-col gap-6 relative top-20">
            <div className="flex flex-col items-center">
                <img className="w-45 h-45" src="/logo.png" alt="Logo PingCortex" />
                <h2 className="text-[2rem] font-bold text-primary">Ping<span className="text-slate-800 dark:text-white">Cortex</span></h2>
                <h3 className="text-[1.05rem] text-sub-text">AI-Powered Study Plateform</h3>
            </div>
            <div className="flex flex-col gap-6">
                <SoftInput label="Email" type="email" placeholder="etudiant@pingcortex.com" />
                <SoftInput label="Mot de passe" type="password" />
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <input type="checkbox" name="" id="" className="mr-2" />
                        <label className="text-[0.9rem] text-sub-text">Se souvenir de moi</label>
                    </div>
                    <div>
                        <p className="text-secondary underline text-[0.9rem] hover:text-[#595cf0] cursor-default">Mot de passe oublié?</p>
                    </div>
                </div>
                <GlowButton variant="primary" isGlowing className="mt-2">
                    Se connecter
                </GlowButton>
            </div>
            <div>
                <p className="text-[0.9rem] text-sub-text text-center">Vous n'avez pas de compte? <span className="text-secondary underline text-[0.9rem] hover:text-[#595cf0] cursor-default">S'inscrire</span></p>
            </div>
        </NeumorphicCard>
    );
};