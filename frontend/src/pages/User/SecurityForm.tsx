import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import ModernInput from "@/components/own/ModernInput";
import { toast } from "sonner";
import type {User as UserType} from "@/Context/userTypes";

interface SecurityFormProps {
    user: UserType;
    updateUser: (data: Partial<UserType>) => Promise<boolean>;
    newPassword: string;
    setNewPassword: (value: string) => void;
    confirmNewPassword: string;
    setConfirmNewPassword: (value: string) => void;
}

interface PasswordUpdatePayload extends Partial<UserType> {
    password: string;
}

const passwordRegex = /^(?=.*[0-9]).{8,}$/;

const SecurityForm = ({
                          user,
                          updateUser,
                          newPassword,
                          setNewPassword,
                          confirmNewPassword,
                          setConfirmNewPassword
                      }: SecurityFormProps) => {
    const { t } = useTranslation();

    const handleUpdatePassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            toast.error(t('errors.all_fields_required'));
            return;
        }

        if (newPassword !== confirmNewPassword) {
            toast.error(t('errors.passwords_do_not_match'));
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            toast.error(t('errors.weak_password'));
            return;
        }

        const payload: PasswordUpdatePayload = {
            ...user,
            password: newPassword
        };

        const success = await updateUser(payload as Partial<UserType>);

        if (success) {
            toast.success(t("profile.update_success"));
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            toast.error(t("errors.generic_signup_error"));
        }
    };

    return (
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-8 border-b border-slate-800/50">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                    <div className="p-2 rounded-tl-xl bg-blue-500/10 border border-blue-500/20">
                        <Lock className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-xl">{t("profile.update_password")}</span>
                </CardTitle>
                <CardDescription className="text-slate-400 ml-12">
                    <span className="text-base"> {t("profile.update_password_desc")}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <ModernInput
                        label={t("profile.new_password")}
                        value={newPassword}
                        onChange={setNewPassword}
                        type="password"
                        placeholder="••••••••"
                    />
                    <ModernInput
                        label={t("register.confirm_password")}
                        value={confirmNewPassword}
                        onChange={setConfirmNewPassword}
                        type="password"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleUpdatePassword}
                        variant="gradient-fire"
                        size="lg"
                    >
                        {t("profile.update_password")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default SecurityForm;