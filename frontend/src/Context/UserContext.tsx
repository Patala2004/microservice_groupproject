import {createContext, useContext, useEffect, useState} from "react";
import {LanguageEnum, type User} from "@/Context/userTypes.tsx";
import i18n from "i18next";
import axios, {type AxiosResponse} from "axios";
import api from "@/lib/api/axios.ts";


interface UserContextType {
    user: User | null;
    isLoggedIn: boolean;
    language: LanguageEnum;
    setLanguage: (lang: LanguageEnum) => void;
    login: (userData: User, token: string, refreshToken: string) => void;
    logout: () => void;
    authFetch: (
        input: string
    ) => Promise<AxiosResponse | null>;
    checkAuth: () => Promise<boolean>;
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
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => !!getInitialUser());
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
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
    };

    const setLanguage = (lang: LanguageEnum) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);

        i18n.changeLanguage(lang);

        if (user) {
            const updatedUser: User = { ...user, preferedLanguage: lang };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
    };

    const authFetch = async (
        input: string
    ): Promise<AxiosResponse | null> => {
        try {
            return await api.get(input, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return error.response;
            }
            return null;
        }
    };

    const checkAuth = async (): Promise<boolean> => {
        if (!localStorage.getItem("token")) {
            if (isLoggedIn) logout();
            return false;
        }

        try {
            const response = await authFetch("user/api/users/auth/");

            if (response && response.status === 200) {
                let userData = response.data;
                if (userData) {
                    if (!user || user.id !== userData.id) {
                        login(
                            userData as User,
                            localStorage.getItem("token") || '',
                            localStorage.getItem("refreshToken") || ''
                        );
                    }
                    return true;
                }
            }
            logout();
            return false;
        } catch (e) {
            logout();
            return false;
        }
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
                checkAuth,
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