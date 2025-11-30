import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import InputTextField from "@/components/own/InputTextField.tsx";
import api from "@/lib/api/axios.ts";
import { Card } from "@/components/ui/card";
import {useTranslation} from "react-i18next";
import axios from "axios";

const SignupForm = () => {
    const [username, setUsername] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [visiblePassword, setVisiblePassword] = useState<boolean>(false);
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState<boolean>(false);
    const [phone, setPhone] = useState<string>('');
    const [weXinId, setWeXinId] = useState<string>('');
    const [campus, setCampus] = useState<number>(1);
    const [preferedLanguage, setPreferedLanguage] = useState<LanguageEnum>(LanguageEnum.EN);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;

    const handleSignup = async () => {
        if (!username || !name || !email || !password || !confirmPassword || !phone || !weXinId) {
            toast.error(t('errors.all_fields_required'));
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error(t('errors.invalid_email'));
            return;
        }

        if (!phoneRegex.test(phone)) {
            console.log(phone.length);
            toast.error(t('errors.invalid_phone'));
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error(t('errors.weak_password'));
            return;
        }

        if (password !== confirmPassword) {
            toast.error(t('errors.passwords_do_not_match'));
            return;
        }

        try {
            const response = await api.post('user/api/users/', {
                    username,
                    password,
                    name,
                    email,
                    phone_number: phone,
                    weixinId: weXinId,
                    campus,
                    preferedLanguage
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                toast.success(t('success.signup_successful'));
                navigate("/signin");
                cleanStates();
            } else {
                toast.error(t('errors.generic_signup_error'));
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);

            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                const errorMessage = errorData?.message;

                if (error.response.status === 400) {
                    const validationErrors = Object.values(errorData).flat().join(' ; ');
                    toast.error(validationErrors || errorMessage || t('errors.generic_signup_error'));
                } else if (error.response.status === 409) {
                    toast.error(errorMessage || t('errors.generic_signup_error'));
                } else {
                    toast.error(t('errors.generic_signup_error'));
                }
            } else {
                toast.error(t('errors.generic_signup_error'));
            }
        }
    };

    const cleanStates = () => {
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhone('');
        setWeXinId('');
        setCampus(0);
        setPreferedLanguage(LanguageEnum.EN);
    }

    return (
        <div className="w-full flex justify-center">
            <Card variant="form-theme">
                <div className="w-full flex flex-col items-center mb-4">
                    <span className="text-4xl font-bold tracking-tight bg-gradient-to-r 
                          from-rose-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                        {t("register.title")}
                    </span>
                    <p className="mt-2 text-lg text-neutral-200 text-center">
                        {t('register.subtitle')} <strong>{t('register.plateform')}</strong>
                    </p>
                </div>

                <div className="w-full space-y-4 mt-2 mb-4">
                    <InputTextField
                        label={t('register.name')}
                        setter={setName}
                        valueToDisplay={t('register.placeholder_name')}
                    />
                    <InputTextField
                        label={t('register.username')}
                        setter={setUsername}
                        valueToDisplay={t('register.placeholder_username')}
                    />
                    <InputTextField
                        label={t('register.email')}
                        setter={setEmail}
                        valueToDisplay={t('register.placeholder_email')}
                    />
                    <InputTextField
                        label={t('register.password')}
                        setter={setPassword}
                        password={true}
                        showPassword={visiblePassword}
                        valueToDisplay={t('register.placeholder_password')}
                        toggleShowPassword={() => setVisiblePassword((prev) => !prev)}
                    />
                    <InputTextField
                        label={t('register.confirm_password')}
                        setter={setConfirmPassword}
                        password={true}
                        showPassword={visibleConfirmPassword}
                        valueToDisplay={t('register.placeholder_confirm_password')}
                        toggleShowPassword={() => setVisibleConfirmPassword((prev) => !prev)}
                    />
                    <InputTextField
                        label={t('register.phone_number')}
                        setter={setPhone}
                        valueToDisplay={t('register.placeholder_phone')}
                    />
                    <InputTextField
                        label={t('register.wechat_id')}
                        setter={setWeXinId}
                        valueToDisplay={t('register.placeholder_wechat_id')}
                    />
                </div>

                <Button
                    variant="gradient-fire"
                    size="full-width"
                    onClick={handleSignup}
                >
                    {t('register.submit_btn')}
                </Button>

                <div className="w-full flex justify-end mt-5 mb-1">
                    <span
                        className="
                            text-xs sm:text-base 
                            text-sky-400 hover:text-sky-300 
                            hover:underline cursor-pointer 
                            transition-colors
                        "
                        onClick={() => navigate("/signin")}
                    >
                        {t('register.login_link_prefix')} <strong>{t('register.login_link')}</strong>
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default SignupForm;