import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import InputTextField from "@/components/own/InputTextField.tsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useUser } from "@/Context/UserContext.tsx";
import api from "@/lib/api/axios.ts";

const SignInForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useUser();

  const handleConnexion = async () => {
    if (!username || !password) {
      toast.error(t('errors.login_fields_required'));
      return;
    }

    try {
      const response = await api.post(
          "user/api/users/login/",
          { username, password },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
      );

      const data = response.data;

      if (response.status === 200) {
        login(data.user, data.access_token, "");

        toast.success(`${t('success.welcome_back')} ${data.user.name}`);
        navigate("/dashboard");
      } else {
        toast.error(data.message || t('errors.generic_login_error'));
      }
    } catch (error) {
      console.error("An error occurred during login:", error);

      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          toast.error(t('errors.invalid_credentials'));
        } else if (error.response.status === 406) {
          toast.error(t('errors.account_inactive'));
        } else {
          toast.error(t('errors.generic_login_error'));
        }
      } else {
        toast.error(t('errors.generic_login_error'));
      }
    }
  };

  return (
      <div className="w-full flex justify-center">
        <Card variant="form-theme">
          <div className="w-full flex flex-col items-center mb-4">
          <span className="text-4xl font-bold tracking-tight bg-gradient-to-r 
                          from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
            {t('login.title')}
          </span>
            <p className="mt-2 text-lg text-neutral-200 text-center">
              {t('login.subtitle')} <strong>{t('signup.plateform')}</strong>
            </p>
          </div>

          <div className="w-full space-y-4 mt-2 mb-4">
            <InputTextField
                label={t('login.username')}
                setter={setUsername}
                valueToDisplay={t('signup.placeholder_username')}
            />
            <InputTextField
                label={t('login.password')}
                setter={setPassword}
                password={true}
                showPassword={visiblePassword}
                valueToDisplay={t('signup.placeholder_password')}
                toggleShowPassword={() => setVisiblePassword((prev) => !prev)}
            />
          </div>

          <Button
              variant="gradient-fire" size="full-width"
              onClick={handleConnexion}
          >
            {t('login.submit_btn')}
          </Button>

          <div className="w-full flex justify-end mt-5 mb-1">
          <span
              className="
                    text-xs sm:text-base 
                    text-sky-400 hover:text-sky-300 
                    hover:underline cursor-pointer 
                    transition-colors"
              onClick={() => navigate("/signup")}
          >
            {t('login.signup_link_prefix')} <strong>{t('login.signup_link')}</strong>
          </span>
          </div>

        </Card>
      </div>
  );
};

export default SignInForm;