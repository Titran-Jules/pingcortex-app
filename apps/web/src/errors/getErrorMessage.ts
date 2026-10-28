import { getApiError, type ApiError } from "@pingcortex/api-client"

const messages: Record<string, string> = {
    "INVALID_CREDENTIALS": "Identifiants invalides.",
    "EMAIL_ALREADY_EXISTS": "Cette adresse email est déjà utilisée.",
    "VALIDATION_ERROR": "Les données fournies sont invalides.",
    "INVALID_TOKEN": "Jeton d'authentification invalide.",
    "INVALID_REFRESH_TOKEN": "Session expirée ou invalide.",
    "USER_NOT_FOUND": "Utilisateur introuvable.",
    "COURSE_NOT_FOUND": "Cours introuvable.",
    "CONCEPT_NOT_FOUND": "Concept introuvable.",
    "CONCEPT_NOT_AVAILABLE": "Ce concept n'est pas disponible.",
    "COURSE_MATERIAL_NOT_FOUND": "Support de cours introuvable.",
    "QUIZ_NOT_FOUND": "Quiz introuvable.",
    "INVALID_OPTION": "Option sélectionnée invalide.",
    "MASTERY_NOT_REACHED": "Le seuil de maîtrise requis n'a pas été atteint.",
    "API_KEY_NOT_FOUND": "Clé API introuvable.",
    "NO_ACTIVE_KEY": "Aucune clé API active trouvée.",
    "UNSUPPORTED_PROVIDER": "Fournisseur non pris en charge.",
    "AI_PROVIDER_ERROR": "Erreur lors de la communication avec le service d'IA.",
    "ANALYSIS_NOT_RETRYABLE": "Ce cours ne peut pas être re-analyser.",
    "INTERNAL_ERROR": "Le serveur a rencontré un problème interne.",
};

export const getErrorMessage = (error: unknown, fallback: string = "Une erreur est survenue."): string => {
    const apiEror: ApiError = getApiError(error);
    if (apiEror.isTimeout) {
        return "Le serveur met trop de temps à répondre...";
    }
    if (apiEror.isNetworkError) {
        return "Serveur injoignable ou connextion bloquée...";
    }
    if (apiEror.code && messages[apiEror.code]) {
        return messages[apiEror.code];
    }
    if (apiEror.status) {
        if (apiEror.status === 502 || (apiEror.status >= 500 && apiEror.status < 600)) {
            return "Le serveur a rencontré un problème...";
        }
        switch (apiEror.status) {
            case (400):
                return "Requête invalide.";
            case (401):
                return "Non authentifié.";
            case (403):
                return "Accès refusé.";
            case (404):
                return "Ressource introuvable.";
            case (409):
                return "Conflit de données.";
            case (422):
                return "Trop de requête. Veuillez patienter.";
        }
    }
    return fallback;
}