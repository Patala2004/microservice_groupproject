import { createContext, useContext, useCallback, useState } from "react";
import translationApi from "@/lib/api/translationApi.ts";

interface TranslationResponse {
    translation: string[];
}

interface TranslationContextType {
    translate: (texts: string[], targetLanguage: string) => Promise<string[] | null>;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: React.ReactNode }) => {
    const [cache, setCache] = useState<Record<string, string[]>>({});

    const translate = useCallback(async (texts: string[], targetLanguage: string): Promise<string[] | null> => {
        const cacheKey = `${targetLanguage}-${texts.join("|")}`;

        if (cache[cacheKey]) {
            return cache[cacheKey];
        }

        try {
            const response = await translationApi.post<TranslationResponse>("/translate", {
                texts,
                language: targetLanguage,
            });

            if (response.status === 200) {
                const result = response.data.translation;
                setCache(prev => ({ ...prev, [cacheKey]: result }));
                return result;
            }
            return null;
        } catch (error) {
            console.error("Translation error:", error);
            return null;
        }
    }, [cache]);

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