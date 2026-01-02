import { createContext, useContext, useCallback } from "react";
import postApi from "@/lib/api/postApi.ts";

interface TranslationRequest {
    texts: string[];
    language: string;
}

interface TranslationResponse {
    translation: string[];
}

interface TranslationContextType {
    translate: (texts: string[], language: string) => Promise<string[] | null>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
    const translate = useCallback(async (texts: string[], language: string): Promise<string[] | null> => {
        try {
            const response = await postApi.post<TranslationResponse>("/translate", {
                texts,
                language,
            });
            return response.status === 200 ? response.data.translation : null;
        } catch (error) {
            console.error("Translation error:", error);
            return null;
        }
    }, []);

    return (
        <TranslationContext.Provider value={{ translate }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslationApi = () => {
    const context = useContext(TranslationContext);
    if (!context) throw new Error("useTranslationApi must be used within a TranslationProvider");
    return context;
};