import { useNavigate } from "react-router-dom";
import { School } from "lucide-react";
import { useUser } from "@/Context/UserContext.tsx";
import { LanguageEnum } from "@/Context/userTypes.tsx";

const Header = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, language, setLanguage } = useUser();

  const handleToggleLanguage = () => {
    const next =
      language === LanguageEnum.EN ? LanguageEnum.CN : LanguageEnum.EN;
    setLanguage(next);
  };

  const handleProfileClick = () => {
    navigate("/user");
  };

  const avatarLetter =
    user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?";

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
        {/* Logo + titre */}
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
          {isLoggedIn ? (
            <>
              {/* Bouton switch langue */}
              <button
                onClick={handleToggleLanguage}
                className="
                  px-3 py-1 rounded-full
                  text-sm font-semibold
                  border border-neutral-300 dark:border-neutral-700
                  text-neutral-800 dark:text-neutral-100
                  bg-white/70 dark:bg-neutral-900/70
                  hover:bg-neutral-100 dark:hover:bg-neutral-800
                  transition-colors
                "
              >
                {language === LanguageEnum.EN ? "EN" : "中文"}
              </button>

              {/* Profil utilisateur */}
              <button
                onClick={handleProfileClick}
                className="
                  flex items-center gap-2
                  px-3 py-1
                  rounded-full
                  bg-neutral-100 dark:bg-neutral-900
                  border border-neutral-200 dark:border-neutral-800
                  hover:bg-neutral-200 dark:hover:bg-neutral-800
                  transition-colors
                  shadow-sm
                "
              >
                <div
                  className="
                    w-8 h-8 rounded-full
                    bg-gradient-to-br from-rose-600 via-red-600 to-orange-500
                    flex items-center justify-center
                    text-white text-sm font-bold
                    shrink-0
                  "
                >
                  {avatarLetter}
                </div>
                <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {"testUsername"}
                </span>
              </button>
            </>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
