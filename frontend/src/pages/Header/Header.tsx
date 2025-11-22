import { useNavigate } from "react-router-dom";
import { School } from 'lucide-react';
import {useUser} from "@/Context/UserContext.tsx";

const Header = () => {
    const navigate = useNavigate();
    const {logout} = useUser();

    const handleLogOut = () => {
        logout();
        navigate("/");
    }

    return (
        <div
            className="flex justify-between items-center w-full h-[100px] bg-gradient-to-b from-[#8B0000] 
            to-white text-white pt-3 pb-3 px-6 mb-6"
        >
            {/* Logo - Redirection vers Home */}
            <div className="cursor-pointer" onClick={() => navigate("/")}>
                <School/>
            </div>
            
            <button
                onClick={() => navigate("/connexion")}
                className="px-4 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
            >
                Se connecter
            </button>
        </div>
    );
};

export default Header;
