import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SeparatorWithText from "@/pages/Utils/SeparatorWithText.tsx";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-[#c7c6c1] to-orange-400" />
      <div className="w-full max-w-3xl flex flex-col items-center text-center gap-10">
        <div className="space-y-4">
          <h1 className="text-6xl sm:text-6xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
            {t("landing.welcome-to")}&nbsp;
            <span className="bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                {t("app_name")}
            </span>
          </h1>

          <p className="text-xl text-neutral-800 dark:text-neutral-300">
            {t("landing.tagline")} <strong>{t("landing.join-us-now")}</strong> <br />
            {t("landing.description")}
          </p>
        </div>

        <div
          className="
            w-full max-w-md
            bg-gradient-to-br from-neutral-600 via-neutral-950 to-black 
            border border-neutral-200/70 dark:border-neutral-800
            rounded-2xl
            shadow-lg shadow-black/10
            px-8 py-7
            flex flex-col items-center
            backdrop-blur-xl
          "
        >
          <div className="flex flex-col w-full">
            <Button
                onClick={() => navigate("/signup")}
                variant="gradient-fire"
                size="main-button"
            >
                {t("landing.create_account_btn")}
            </Button>
            
            <SeparatorWithText text={t("or")} />
            
            <Button variant="outline-soft-red" size="secondary-button" onClick={() => navigate("/signin")}>
                {t("landing.login_btn")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
