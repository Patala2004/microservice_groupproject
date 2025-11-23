// Dans votre ProtectedLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import NoAccess from "@/pages/NoAccess/NoAccess.tsx";

const ProtectedLayout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        setIsAuthenticated(!!token);
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <NoAccess />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;