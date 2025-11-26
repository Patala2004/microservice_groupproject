import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SeparatorWithText from "@/pages/Utils/SeparatorWithText.tsx";
import { useTranslation } from "react-i18next";

const SigninSignupCard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
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
    );
};

export default SigninSignupCard;