import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { useUser } from "@/Context/UserContext";

interface UserDashboardProps {
  onOpenCreatePost: () => void;
}

const UserDashboard = ({ onOpenCreatePost }: UserDashboardProps) => {
  const { t } = useTranslation();
  const {user} = useUser();

    const avatarLetter =
        user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "?";

  return (
    <Card className="border-slate-800 bg-slate-900 sticky top-24 shadow-xl overflow-hidden">
      <div className="h-20 bg-gradient-to-r from-orange-600 to-red-600 relative">
        <div className="absolute -bottom-8 left-6">
          <Avatar className="w-16 h-16 border-4 border-slate-900 shadow-xl">
            <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-lg">
                {avatarLetter}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <CardHeader className="pt-10 pb-2 px-6">
        <CardTitle className="text-lg text-slate-100">
          {t("dashboard.welcome")}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-6 pb-6 space-y-6">
        <Button 
          onClick={onOpenCreatePost}
          className="w-full bg-slate-100 text-slate-900 hover:bg-white font-bold py-6 rounded-xl shadow-lg transition-transform active:scale-[0.98]"
        >
          <Plus className="w-5 h-5 mr-2" /> {t("dashboard.new_post_btn")}
        </Button>

        <div className="grid grid-cols-3 gap-2 text-center">
          <StatBox value="3" label={t("dashboard.stat_posts")} />
        </div>
      </CardContent>
    </Card>
  );
};

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
    <div className="font-bold text-lg text-slate-200">{value}</div>
    <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
      {label}
    </div>
  </div>
);

export default UserDashboard;