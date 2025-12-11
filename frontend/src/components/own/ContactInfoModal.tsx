import { CornerDownRight, Smartphone, Mail, Globe } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

interface ContactInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    posterDetails: { name: string; email: string; phone_number: string; weixinId: string; };
}

const ContactInfoModal = ({ isOpen, onClose, posterDetails }: ContactInfoModalProps) => {
    const { t } = useTranslation();

    const ContactDetail = ({ icon, label, value}) => (
        <div className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
            <div className="flex items-center gap-3 text-slate-400">
                {icon}
                <span className="font-medium">{label}</span>
            </div>
            <span className="font-semibold text-white">{value || t('profile.default_contact_unavailable')}</span>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-full max-w-md">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl text-orange-500 flex items-center gap-2">
                        <CornerDownRight className="size-6" />
                        {t("post_actions.contact_poster_title", { name: posterDetails.name })}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-slate-400 mt-4">
                    {t("post_actions.contact_poster_description")}
                </DialogDescription>

                <div className="mt-4 space-y-1">
                    <ContactDetail icon={<Mail className="size-4" />} label={t('profile.email')} value={posterDetails.email} />
                    <ContactDetail icon={<Smartphone className="size-4" />} label={t('profile.phone_number')} value={posterDetails.phone_number} />
                    <ContactDetail icon={<Globe className="size-4" />} label={t('profile.wechat_id')} value={posterDetails.weixinId} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ContactInfoModal;