import { createContext, useContext, useState, useEffect } from "react";
import {toast} from "sonner";


enum LanguageEnum {
    EN = "en",
    CN = "cn",
}

interface User {
    username: string;
    password: string;
    name: string;
    weixinId: string;
    email: string;
    phone_number: string;
    campus: number;
    preferedLanguage:LanguageEnum;
}

interface UserContextType {
    user: User | null;
    login: (userData: User, token: string, refreshToken: string) => void;
    logout: () => void;
    authFetch: (
        input: RequestInfo,
        init?: RequestInit,
        navigate?: any
    ) => Promise<Response | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData: User, token: string, refreshToken: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
    };

    const verifyToken = async (navigate?: any): Promise<string | null> => {
        // We use two tokens, the access token and the refresh token,
        // to allow the user to stay connected even if the first token has expired.
        // The access token has a shorter validity period, but if it becomes invalid,
        // we can use the refresh token to obtain a new access token.
        // This way, we can keep the user logged in without requiring them to log in again each time the token expires.
        const VITE_API_URL = import.meta.env.VITE_API_URL;

        try {
            const req = await fetch(`${VITE_API_URL}/api/Token/refresh`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
                },
            });

            // If the status is not 200, it means the refresh token is invalid or expired
            if (req.status !== 200) {
                // If the refresh token is invalid, we redirect the user to the login page
                logout();
                toast.error("Votre session a expiré, veuillez vous reconnecter.");
                if (navigate) navigate("/");
                return null;
            }

            // If the refresh token is valid, we update the tokens in local storage
            const tokens = await req.json(); // get the new two tokens
            localStorage.setItem("token", tokens.token);
            localStorage.setItem("refreshToken", tokens.refreshToken);
            return tokens.token;
        } catch (error) {
            logout();
            toast.error("Une erreur s'est produite lors de la vérification de votre connection, veuillez vous reconnecter.");
            if (navigate) navigate("/");
            return null;
        }
    };

    const authFetch = async (
        input: RequestInfo,
        init?: RequestInit,
        navigate?: any
    ): Promise<Response | null> => {
        // authFetch is a custom function that replaces fetch()
        // It automatically handles token-related errors (401 or 403)
        // If the token is expired, it tries to get a new one via verifyToken()
        // Then it retries the original request with the new token

        // Adds the access token to the Authorization header
        const token = localStorage.getItem("token");
        const withAuth = {
            ...init,
            headers: {
                ...(init?.headers || {}),
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };

        let response = await fetch(input, withAuth);

        // If the response is 401 or 403, it means the token is invalid or expired
        if (response.status === 401 || response.status === 403) {
            const newToken = await verifyToken(navigate);

            if (!newToken) return null;

            const retried = await fetch(input, {
                ...init,
                headers: {
                    ...(init?.headers || {}),
                    Authorization: `Bearer ${newToken}`,
                    "Content-Type": "application/json",
                },
            });

            return retried;
        }

        return response;
    };

    return (
        <UserContext.Provider
            value={{
                user,
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
