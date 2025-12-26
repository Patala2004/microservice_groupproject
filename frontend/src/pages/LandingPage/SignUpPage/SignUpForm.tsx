import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { LanguageEnum } from "@/Context/userTypes.tsx";
import InputTextField from "@/components/own/InputTextField.tsx";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import axios from "axios";
import userApi from "@/lib/api/userApi.ts";
import { useUser } from "@/Context/UserContext.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";

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
    const [campusId, setCampusId] = useState<string>('');
    const [preferedLanguage, setPreferedLanguage] = useState<LanguageEnum>(LanguageEnum.EN);
    const [selectedTopics, setSelectedTopics] = useState<number[]>([]);

    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { campuses } = useUser();

    const topics = [
        { id: 1, label: t('register.topics.sports') },
        { id: 2, label: t('register.topics.music') },
        { id: 3, label: t('register.topics.arts') },
        { id: 4, label: t('register.topics.crafting') },
        { id: 5, label: t('register.topics.reading') },
        { id: 6, label: t('register.topics.studying') },
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;
    const passwordRegex = /^(?=.*[0-9]).{8,}$/;

    useEffect(() => {
        if (campuses && campuses.length > 0) {
            setCampusId(campuses[0].id.toString());
        }
    }, [campuses]);

    const toggleTopic = (id: number) => {
        setSelectedTopics(prev =>
            prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
        );
    };

    const handleSignup = async () => {
        if (!username || !name || !email || !password || !confirmPassword || !phone || !weXinId || !campusId) {
            toast.error(t('errors.all_fields_required'));
            return;
        }

        if (selectedTopics.length === 0) {
            toast.error(t('register.interested_topics'));
            return;
        }

        if (!emailRegex.test(email)) {
            toast.error(t('errors.invalid_email'));
            return;
        }

        if (!phoneRegex.test(phone)) {
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
            const response = await userApi.post('user/users/', {
                username,
                password,
                name,
                email,
                phone_number: phone,
                weixinId: weXinId,
                campus: parseInt(campusId),
                preferedLanguage,
                interested_topics: selectedTopics
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 201) {
                toast.success(t('success.signup_successful'));
                navigate("/signin");
                cleanStates();
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data?.message || t('errors.generic_signup_error'));
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
        setCampusId('');
        setPreferedLanguage(LanguageEnum.EN);
        setSelectedTopics([]);
    }

    return (
        <div className="w-full flex justify-center py-10">
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

                <div className="w-full space-y-4 mt-2 mb-6">
                    <InputTextField label={t('register.name')} setter={setName} valueToDisplay={t('register.placeholder_name')} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputTextField label={t('register.username')} setter={setUsername} valueToDisplay={t('register.placeholder_username')} />
                        <InputTextField label={t('register.email')} setter={setEmail} valueToDisplay={t('register.placeholder_email')} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputTextField label={t('register.phone_number')} setter={setPhone} valueToDisplay={t('register.placeholder_phone')} />
                        <InputTextField label={t('register.wechat_id')} setter={setWeXinId} valueToDisplay={t('register.placeholder_wechat_id')} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label className="text-base font-medium text-white">{t("create_modal.label_location")}</Label>
                        <Select onValueChange={setCampusId} value={campusId}>
                            <SelectTrigger className="w-full h-10 rounded-xl border border-neutral-700 bg-neutral-900/70 text-white transition-all">
                                <SelectValue placeholder={t("create_modal.placeholder_location")} />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-900 border-neutral-700 rounded-xl text-white">
                                {campuses?.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()} className="cursor-pointer">
                                        {i18n.language === 'cn' ? c.cn_name : c.en_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-3 mt-4">
                        <Label className="text-base font-medium text-white">
                            {t('register.interested_topics')}
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => {
                                const isSelected = selectedTopics.includes(topic.id);
                                return (
                                    <div
                                        key={topic.id}
                                        onClick={() => toggleTopic(topic.id)}
                                        className={`
                                            px-4 py-2 rounded-full text-sm font-semibold cursor-pointer select-none transition-all duration-200 border
                                            ${isSelected
                                            ? "bg-gradient-to-r from-rose-600 to-orange-500 text-white border-transparent shadow-lg scale-105"
                                            : "bg-neutral-800/50 text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-neutral-200"
                                        }
                                        `}
                                    >
                                        {topic.label}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <Button variant="gradient-fire" size="full-width" onClick={handleSignup}>
                    {t('register.submit_btn')}
                </Button>

                <div className="w-full flex justify-end mt-5 mb-1">
                    <span
                        className="text-xs sm:text-base text-sky-400 hover:text-sky-300 hover:underline cursor-pointer transition-colors"
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