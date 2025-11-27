import {createContext, useContext, useEffect, useState} from "react";
import {toast} from "sonner";
import type {NavigateFunction} from "react-router-dom";
import {LanguageEnum, type User} from "@/Context/userTypes.tsx";
import i18n from "i18next";


interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    language: LanguageEnum;
    setLanguage: (lang: LanguageEnum) => void;
    login: (userData: User, token: string, refreshToken: string) => void;
    logout: () => void;
    authFetch: (
        input: RequestInfo,
        init?: RequestInit,
        navigate?: NavigateFunction
    ) => Promise<Response | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getInitialUser = (): User | null => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
        return JSON.parse(storedUser) as User;
    } catch {
        return null;
    }
};

const getInitialLanguage = (): LanguageEnum => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser) as User;
            if (parsed.preferedLanguage) {
                return parsed.preferedLanguage;
            }
        } catch {
            // Ignore parsing errors
        }
    }

    const storedLang = localStorage.getItem("language") as LanguageEnum | null;
    if (storedLang === LanguageEnum.EN || storedLang === LanguageEnum.CN) {
        return storedLang;
    }

    return LanguageEnum.EN;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => getInitialUser());
    const [language, setLanguageState] = useState<LanguageEnum>(
        () => getInitialLanguage()
    );

    useEffect(() => {
        if (i18n.language !== language) {
            i18n.changeLanguage(language);
        }
    }, [language]);

    const isLoggedIn = true;    //temporary bypass login check

    const login = (userData: User, token: string, refreshToken: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("language", userData.preferedLanguage);
        setUser(userData);
        setLanguageState(userData.preferedLanguage);
        i18n.changeLanguage(userData.preferedLanguage);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    const setLanguage = (lang: LanguageEnum) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);

        // Important: Changer la langue I18n immédiatement lors du changement manuel
        i18n.changeLanguage(lang);

        if (user) {
            const updatedUser: User = { ...user, preferedLanguage: lang };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    const verifyToken = async (
        navigate?: NavigateFunction
    ): Promise<string | null> => {
        const VITE_API_URL = import.meta.env.VITE_API_URL;

        try {
            const req = await fetch(`${VITE_API_URL}/api/Token/refresh`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "refreshToken"
                    )}`,
                },
            });

            if (req.status !== 200) {
                logout();
                toast.error(
                    "Votre session a expiré, veuillez vous reconnecter."
                );
                if (navigate) navigate("/");
                return null;
            }

            const tokens = await req.json();
            localStorage.setItem("token", tokens.token);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            return tokens.token;
        } catch {
            logout();
            toast.error(
                "Une erreur s'est produite lors de la vérification de votre connexion, veuillez vous reconnecter."
            );
            if (navigate) navigate("/");
            return null;
        }
    };

    const authFetch = async (
        input: RequestInfo,
        init?: RequestInit,
        navigate?: NavigateFunction
    ): Promise<Response | null> => {
        const token = localStorage.getItem("token");
        const withAuth: RequestInit = {
            ...init,
            headers: {
                ...(init?.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        const response = await fetch(input, withAuth);

        if (response.status === 401 || response.status === 403) {
            const newToken = await verifyToken(navigate);

            if (!newToken) return null;

            return await fetch(input, {
                ...init,
                headers: {
                    ...(init?.headers || {}),
                    Authorization: `Bearer ${newToken}`,
                    "Content-Type": "application/json",
                },
            });
        }

        return response;
    };

    return (
        <UserContext.Provider
            value={{
                user,
                isLoggedIn,
                language,
                setLanguage,
                login,
                logout,
                authFetch,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useCurrentUser must be used within a UserProvider");
    }
    return context;
};