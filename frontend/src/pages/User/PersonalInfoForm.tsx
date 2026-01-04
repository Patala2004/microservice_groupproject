import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, User, Mail, Phone, MessageCircle, Save, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import ModernInput from "@/components/own/ModernInput";
import { toast } from "sonner";
import type { User as UserType } from "@/Context/userTypes";
import type { Campus } from "@/Context/UserContext.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PersonalInfoFormProps {
    user: UserType;
    updateUser: (data: Partial<UserType>) => Promise<boolean>;
    name: string;
    setName: (value: string) => void;
    studentId: string;
    setStudentId: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    weixinId: string;
    setWeixinId: (value: string) => void;
    campus: Campus | null;
    setCampus: (value: Campus) => void;
}

const PersonalInfoForm = ({
                              user,
                              updateUser,
                              name,
                              setName,
                              studentId,
                              setStudentId,
                              email,
                              setEmail,
                              phone,
                              setPhone,
                              weixinId,
                              setWeixinId,
                              campus,
                              setCampus
                          }: PersonalInfoFormProps) => {
    const { t, i18n } = useTranslation();
    const { campuses } = useUser();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{11}$/;

    const hasChanges = () => {
        return (
            user.name !== name ||
            user.student_id !== studentId ||
            user.email !== email ||
            user.phone_number !== phone ||
            user.weixinId !== weixinId ||
            user.campus !== campus?.id
        );
    };

    const handleSaveChanges = async () => {
        if (!name || !studentId || !email || !phone || !weixinId || !campus) {
            toast.error(t('errors.all_fields_required'));
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

        const payload: Partial<UserType> = {
            username: user.username,
            name,
            student_id: studentId,
            email,
            phone_number: phone,
            weixinId: weixinId,
            campus: campus.id,
            preferedLanguage: user.preferedLanguage
        };

        const success = await updateUser(payload);
        if (success) {
            toast.success(t("profile.update_success"));
        } else {
            toast.error(t("errors.generic_signup_error"));
        }
    };

    const isDisabled = !hasChanges();

    return (
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-8 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="p-2 rounded-tl-xl bg-orange-500/10 border border-orange-500/20">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                    </div>
                    <span className="text-xl">{t("profile.personal_info")}</span>
                </CardTitle>
                <CardDescription className="text-slate-400 ml-12">
                    <span className="text-base">{t("profile.personal_info_desc")}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <ModernInput
                        label={t("register.name")}
                        value={name}
                        onChange={setName}
                        icon={<User className="w-4 h-4" />}
                    />
                    <ModernInput
                        label={t("register.student_id")}
                        value={studentId}
                        onChange={setStudentId}
                        icon={<GraduationCap className="w-4 h-4" />}
                    />
                    <ModernInput
                        label={t("register.email")}
                        value={email}
                        onChange={setEmail}
                        icon={<Mail className="w-4 h-4" />}
                    />
                    <ModernInput
                        label={t("register.phone_number")}
                        value={phone}
                        onChange={setPhone}
                        icon={<Phone className="w-4 h-4" />}
                    />
                    <div className="space-y-2 flex flex-col md:col-span-2">
                        <ModernInput
                            label={t("register.wechat_id")}
                            value={weixinId}
                            onChange={setWeixinId}
                            icon={<MessageCircle className="w-4 h-4" />}
                        />
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-500 transition-colors ml-1">
                            {t("create_modal.label_location")}
                        </Label>
                        <Select
                            value={campus?.id?.toString()}
                            onValueChange={(id) => {
                                const selected = campuses.find(c => c.id.toString() === id);
                                if (selected) setCampus(selected);
                            }}
                        >
                            <SelectTrigger className="bg-black/20 border-slate-800 focus:border-orange-500/50 focus:ring-4 
                            focus:ring-orange-500/10 text-slate-100 pl-11 py-6 rounded-xl transition-all 
                                duration-300 placeholder:text-slate-600">
                                <SelectValue placeholder={t("create_modal.placeholder_location")} />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                                {campuses.map((c) => (
                                    <SelectItem key={c.id} value={c.id.toString()}>
                                        {i18n.language === 'cn' ? c.cn_name : c.en_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSaveChanges}
                        disabled={isDisabled}
                        variant="gradient-fire"
                        size="lg"
                    >
                        <Save className="w-4 h-4 mr-2" /> {t("profile.save_btn")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default PersonalInfoForm;