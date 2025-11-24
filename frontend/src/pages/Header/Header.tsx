import { useNavigate } from "react-router-dom";
import { School } from "lucide-react";
import { useUser } from "@/Context/UserContext.tsx";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import {Button} from "@/components/ui/button.tsx";

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
              <Button
                onClick={handleToggleLanguage}
                variant="gradient-fire"
              >
                {language === LanguageEnum.EN ? "EN" : "中文"}
              </Button>

              <Button
                onClick={handleProfileClick}
                variant="profile-button"
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
              </Button>
            </>
          ) : (
            <Button  variant="outline-soft-red">
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
