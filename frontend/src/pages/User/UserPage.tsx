import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
// FIX: Added MessageCircle to the imports
import {
  Camera,
  User,
  Lock,
  Mail,
  Phone,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Save,
  Upload,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock User Data
const MOCK_USER = {
  username: "student123",
  name: "John Doe",
  email: "john@example.com",
  phone: "13800138000",
  weixinId: "wxid_12345",
  avatarUrl: "https://github.com/shadcn.png",
};

const UserPage = () => {
  const { t } = useTranslation();

  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [phone, setPhone] = useState(MOCK_USER.phone);
  const [weixinId, setWeixinId] = useState(MOCK_USER.weixinId);
  const [avatar, setAvatar] = useState(MOCK_USER.avatarUrl);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      toast.success(t("profile.upload_success"));
    }
  };

  const handleSaveChanges = () => {
    setTimeout(() => toast.success(t("profile.update_success")), 500);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-orange-500/30 font-sans">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/10 blur-[150px] rounded-full opacity-40 animate-pulse"
          style={{ animationDuration: "4s" }}
        />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full opacity-30" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">

        <div className="mb-12 text-center sm:text-left space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-purple-600 drop-shadow-sm">
              {t("profile.title")}
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            {t("profile.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
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
                      <AvatarImage src={avatar} className="object-cover" />
                      <AvatarFallback className="bg-slate-800 text-4xl font-bold text-slate-400">
                        {name.charAt(0)}
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
                  @{MOCK_USER.username}
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
          </div>

          <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-md mb-8">
                <TabsTrigger
                  value="info"
                  className="w-1/2 py-3 rounded-lg text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium"
                >
                  <User className="w-4 h-4 mr-2" /> {t("profile.personal_info")}
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="w-1/2 py-3 rounded-lg text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />{" "}
                  {t("profile.security")}
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="info"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-8 border-b border-slate-800/50">
                    <CardTitle className="flex items-center gap-3 text-xl text-white">
                      <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                      </div>
                      {t("profile.personal_info")}
                    </CardTitle>
                    <CardDescription className="text-slate-400 ml-11">
                      {t("profile.personal_info_desc")}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8 pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <ModernInput
                        label={t("signup.name")}
                        value={name}
                        onChange={setName}
                        icon={<User className="w-4 h-4" />}
                      />
                      <ModernInput
                        label={t("signup.email")}
                        value={email}
                        onChange={setEmail}
                        icon={<Mail className="w-4 h-4" />}
                      />
                      <ModernInput
                        label={t("signup.phone_number")}
                        value={phone}
                        onChange={setPhone}
                        icon={<Phone className="w-4 h-4" />}
                      />
                      <ModernInput
                        label={t("signup.wechat_id")}
                        value={weixinId}
                        onChange={setWeixinId}
                        icon={<MessageCircle className="w-4 h-4" />}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={handleSaveChanges}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] px-8 py-6 rounded-xl font-bold w-full md:w-auto"
                      >
                        <Save className="w-4 h-4 mr-2" />{" "}
                        {t("profile.save_btn")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SECURITY TAB */}
              <TabsContent
                value="security"
                className="mt-0 focus-visible:outline-none"
              >
                <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="pb-8 border-b border-slate-800/50">
                    <CardTitle className="flex items-center gap-3 text-xl text-white">
                      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Lock className="w-5 h-5 text-blue-500" />
                      </div>
                      {t("profile.update_password")}
                    </CardTitle>
                    <CardDescription className="text-slate-400 ml-11">
                      {t("profile.update_password_desc")}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-8 pt-8">
                    <ModernInput
                      label={t("profile.current_password")}
                      value={currentPassword}
                      onChange={setCurrentPassword}
                      type="password"
                      placeholder="••••••••"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <ModernInput
                        label={t("profile.new_password")}
                        value={newPassword}
                        onChange={setNewPassword}
                        type="password"
                        placeholder="••••••••"
                      />
                      <ModernInput
                        label={t("signup.confirm_password")}
                        value={confirmNewPassword}
                        onChange={setConfirmNewPassword}
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/20 px-8 py-6 rounded-xl font-bold w-full md:w-auto transition-all hover:scale-[1.02]"
                      >
                        {t("profile.update_password")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS FOR MODERN LOOK ---

const BadgeInfo = ({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col items-center justify-center bg-slate-900/50 rounded-lg px-6 py-3 border border-slate-800 min-w-[90px]">
    <span className="text-xl font-bold text-white">{value}</span>
    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mt-1">
      {label}
    </span>
  </div>
);

// Define props type for ModernInput to avoid 'any' if using TypeScript strict mode
interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
  type?: string;
  placeholder?: string;
}

const ModernInput = ({
  label,
  value,
  onChange,
  icon,
  type = "text",
  placeholder,
}: ModernInputProps) => (
  <div className="space-y-2 group">
    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-orange-500 transition-colors ml-1">
      {label}
    </Label>
    <div className="relative">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-black/20 border-slate-800 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 text-slate-100 pl-11 py-6 rounded-xl transition-all duration-300 placeholder:text-slate-600"
      />
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-white transition-colors duration-300">
          {icon}
        </div>
      )}
    </div>
  </div>
);

export default UserPage;
