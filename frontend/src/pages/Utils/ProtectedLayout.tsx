import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import NoAccess from "@/pages/NoAccess/NoAccess.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import { RotateCw } from "lucide-react";

const ProtectedLayout = () => {
    const { checkAuth } = useUser();
    const [loading, setLoading] = useState(true);
    const [isAuthConfirmed, setIsAuthConfirmed] = useState(false);

    useEffect(() => {
        const checkStatus = async () => {
            setLoading(true);
            const authenticated = await checkAuth();
            console.log("Statut d'authentification:", authenticated);
            setIsAuthConfirmed(authenticated);
            setLoading(false);
        };

        checkStatus();
    }, [checkAuth]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <RotateCw className="animate-spin text-gray-500 size-12" />
            </div>
        );
    }

    if (!isAuthConfirmed) {
        return <NoAccess />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Outlet />
        </div>
    );
};

export default ProtectedLayout;