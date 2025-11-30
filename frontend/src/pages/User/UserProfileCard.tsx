import { Camera, Upload} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import React from "react";

interface UserProfileCardProps {
    name: string;
    username: string;
    avatarUrl: string;
    handleAvatarClick: () => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const BadgeInfo = ({ value, label }: { value: string; label: string }) => (
    <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-lg px-6 py-3 border border-slate-800 min-w-[90px]">
        <span className="text-xl font-bold text-white">{value}</span>
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
      {label}
    </span>
    </div>
);

const UserProfileCard = ({
                             name,
                             username,
                             avatarUrl,
                             handleAvatarClick,
                             handleFileChange,
                             fileInputRef,
                         }: UserProfileCardProps) => {
    const { t } = useTranslation();
    const avatarFallbackLetter = name.charAt(0).toUpperCase() || '?';

    return (
        <Card className="relative overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl hover:shadow-orange-900/10 transition-shadow duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

            <CardContent className="relative flex flex-col items-center pt-10 pb-8 px-6 text-center">

                <div
                    className="relative mb-6 cursor-pointer"
                    onClick={handleAvatarClick}
                >
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-orange-500 via-red-500 to-purple-600 opacity-75 blur-sm group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>

                    <div className="relative">
                        <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-slate-950 shadow-2xl">
                            <AvatarImage src={avatarUrl} className="object-cover" />
                            <AvatarFallback className="bg-slate-800 text-4xl font-bold text-slate-400">
                                {avatarFallbackLetter}
                            </AvatarFallback>
                        </Avatar>

                        <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                            <Camera className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">
                    {name}
                </h2>
                <p className="text-orange-400/90 font-medium tracking-wide mb-6 bg-orange-950/30 px-3 py-1 rounded-full border border-orange-500/20 text-sm">
                    @{username}
                </p>

                <div className="w-full flex gap-3 justify-center mb-6">
                    <BadgeInfo label={t("dashboard.stat_posts")} value="3" />
                    <BadgeInfo label={t("dashboard.stat_likes")} value="12" />
                </div>

                <Button
                    onClick={handleAvatarClick}
                    variant="outline"
                    className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all duration-300 hover:border-orange-500/50 group/btn"
                >
                    <Upload className="w-4 h-4 mr-2 group-hover/btn:text-orange-400 transition-colors" />
                    {t("profile.change_avatar")}
                </Button>
            </CardContent>
        </Card>
    );
};

export default UserProfileCard;