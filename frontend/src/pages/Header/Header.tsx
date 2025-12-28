import { useNavigate } from "react-router-dom";
import { School, LogOut } from "lucide-react";
import { useUser } from "@/Context/UserContext.tsx";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useTranslation} from "react-i18next";
import { Languages } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, language, setLanguage, logout } = useUser();
  const { t } = useTranslation();

  const handleToggleLanguage = () => {
    const next =
        language === LanguageEnum.EN ? LanguageEnum.CN : LanguageEnum.EN;
    setLanguage(next);
  };
  
  const handleClickMainButton = () => {
    if(isLoggedIn) {
        navigate("/home");
        }
    else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/user");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const avatarLetter =
      user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?";

  const otherDisponibleLanguage = language === LanguageEnum.EN ? 'language.chinese' : 'language.english';

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
              onClick={handleClickMainButton}
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
            {t('app_name')}
          </span>
          </div>


          <div className="flex items-center gap-4">
            <Button
                onClick={handleToggleLanguage}
                variant="gradient-fire"
            >
              <Languages/> {t(otherDisponibleLanguage)}
            </Button>

            {isLoggedIn ? (
                <>
                  <Button
                      onClick={handleProfileClick}
                      variant="profile-button"
                  >
                    <div className="
                          w-8 h-8 rounded-full
                          bg-gradient-to-br from-rose-600 via-red-600 to-orange-500
                          flex items-center justify-center
                          text-white text-sm font-bold
                          shrink-0"
                    >
                      {avatarLetter}
                    </div>
                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      {user?.username ?? t('header.profile')}
                    </span>
                  </Button>

                  <Button
                      onClick={handleLogout}
                      variant="logout"
                  >
                    <LogOut />
                  </Button>
                </>
            ) : (
                <Button onClick={() => navigate("/signin")} variant="outline-soft-red">
                  {t('landing.login_btn')}
                </Button>
            )}
          </div>
        </div>
      </header>
  );
};

export default Header;