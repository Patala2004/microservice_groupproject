import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    const handleConnexion = () => {
        navigate("/connexion");
    };

    const handleSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="flex flex-col items-center justify-center h-2/3 w-full gap-4">
            <div className="flex flex-row items-center justify-center gap-4">
                <Button
                    onClick={handleConnexion}
                    className="my-4 px-6 py-2 bg-[#8B0000]  text-white rounded-lg hover:bg-[#ab3f3e]"
                >
                    Login
                </Button>

                <Button
                    onClick={handleSignup}
                    className="my-4 px-6 py-2 bg-[#8B0000]  text-white rounded-lg hover:bg-[#ab3f3e]"
                >
                    Sign Up
                </Button>
            </div>
        </div>
    );
}

export default LandingPage;
