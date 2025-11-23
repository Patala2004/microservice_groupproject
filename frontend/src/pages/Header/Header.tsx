import { useNavigate } from "react-router-dom";
import { School } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header
      className="
        sticky top-0 z-50
        w-full
        bg-white/80 dark:bg-neutral-950/80
        backdrop-blur-xl
        border-b border-neutral-200/70 dark:border-neutral-800
        shadow-2xl
      "
    >
      <div className="mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="
            flex items-center gap-3
            cursor-pointer
            group
          "
          onClick={() => navigate("/")}
        >
          <div
            className="
              p-2 rounded-xl
              bg-gradient-to-br from-rose-600 via-red-600 to-orange-500
              text-white
              shadow-md
              group-hover:scale-105 transition-transform
            "
          >
            <School size={20} />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            EduPost
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/connexion")}
            className="
              px-4 py-2 rounded-xl
              text-base font-bold
              text-white
              bg-gradient-to-r from-rose-600 via-red-600 to-orange-500
              hover:from-rose-500 hover:via-red-500 hover:to-orange-400
              shadow-md shadow-red-900/30
              hover:shadow-red-900/50
              transition-all
            "
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
