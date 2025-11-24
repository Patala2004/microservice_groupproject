import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import InputTextField from "@/components/own/InputTextField.tsx";
import api from "@/lib/api/axios.ts";
import { Card } from "@/components/ui/card";
import {useTranslation} from "react-i18next";

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
    const [campus, setCampus] = useState<number>(0);
    const [preferedLanguage, setPreferedLanguage] = useState<LanguageEnum>(LanguageEnum.EN);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/; // chinese phone number format
    const passwordRegex = /^(?=.*[0-9]).{8,}$/; // Min 8 characters + 1 digit

    const handleSignup = async () => {
        // Check if required fields are filled
        if (!username || !name || !email || !password || !confirmPassword || !phone || !weXinId) {
            toast.error(t('errors.all_fields_required'));
            return;
        }

        // Validate email format
        if (!emailRegex.test(email)) {
            toast.error(t('errors.invalid_email'));
            return;
        }

        // Validate phone number format
        if (!phoneRegex.test(phone)) {
            console.log(phone.length);
            toast.error(t('errors.invalid_phone'));
            return;
        }

        // Validate password strength
        if (!passwordRegex.test(password)) {
            toast.error(t('errors.weak_password'));
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            toast.error(t('errors.passwords_do_not_match'));
            return;
        }

        try {
            const {data} = await api.post('user/api/users', {
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
            )
            console.log(data);

            if(data.success){
                toast.success(t('success.signup_successful'));
                navigate("/signin");
                cleanStates();
            }else{
                toast.error(data.message || t('errors.generic_signup_error'));
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);
            toast.error(t('errors.generic_signup_error'));
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
                        {t("signup.title")}
                    </span>
                    <p className="mt-2 text-lg text-neutral-200 text-center">
                        {t('signup.subtitle')} <strong>{t('signup.plateform')}</strong>
                    </p>
                </div>

                <div className="w-full space-y-4 mt-2 mb-4">
                    <InputTextField
                        label={t('signup.name')}
                        setter={setName}
                        valueToDisplay={t('signup.placeholder_name')}
                    />
                    <InputTextField
                        label={t('signup.username')}
                        setter={setUsername}
                        valueToDisplay={t('signup.placeholder_username')}
                    />
                    <InputTextField
                        label={t('signup.email')}
                        setter={setEmail}
                        valueToDisplay={t('signup.placeholder_email')}
                    />
                    <InputTextField
                        label={t('signup.password')}
                        setter={setPassword}
                        password={true}
                        showPassword={visiblePassword}
                        valueToDisplay={t('signup.placeholder_password')}
                        toggleShowPassword={() => setVisiblePassword((prev) => !prev)}
                    />
                    <InputTextField
                        label={t('signup.confirm_password')}
                        setter={setConfirmPassword}
                        password={true}
                        showPassword={visibleConfirmPassword}
                        valueToDisplay={t('signup.placeholder_confirm_password')}
                        toggleShowPassword={() => setVisibleConfirmPassword((prev) => !prev)}
                    />
                    <InputTextField
                        label={t('signup.phone_number')}
                        setter={setPhone}
                        valueToDisplay={t('signup.placeholder_phone')}
                    />
                    <InputTextField
                        label={t('signup.wechat_id')}
                        setter={setWeXinId}
                        valueToDisplay={t('signup.placeholder_wechat_id')}
                    />
                </div>

                <Button
                    variant="gradient-fire"
                    size="full-width"
                    onClick={handleSignup}
                >
                    {t('signup.submit_btn')}
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
                        {t('signup.login_link_prefix')} <strong>{t('signup.login_link')}</strong>
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default SignupForm;