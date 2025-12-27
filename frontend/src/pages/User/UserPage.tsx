import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  User as UserIcon,
  ShieldCheck,
  RotateCw,
  LayoutGrid,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/Context/UserContext.tsx";
import { usePost, type Post } from "@/Context/PostContext.tsx";
import UserProfileCard from "./UserProfileCard.tsx";
import PersonalInfoForm from "./PersonalInfoForm.tsx";
import SecurityForm from "./SecurityForm.tsx";
import UserPosts from "./UserPosts.tsx";
import React from "react";
import { type Campus } from "@/Context/UserContext.tsx";

const UserPage = () => {
  const { t } = useTranslation();
  const { user, updateUser, campuses } = useUser();
  const { getPostsByUserId, setPosts: setGlobalPosts } = usePost();

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const initialUser = user || {
    username: t("profile.default_username"),
    name: t("profile.default_name"),
    email: t("profile.default_email"),
    phone_number: t("profile.default_phone"),
    weixinId: t("profile.default_weixin"),
    avatarUrl: "https://github.com/shadcn.png",
  };

  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [phone, setPhone] = useState(initialUser.phone_number);
  const [weixinId, setWeixinId] = useState(initialUser.weixinId);
  const [avatar, setAvatar] = useState("https://github.com/shadcn.png");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [campus, setCampus] = useState<Campus | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && campuses.length > 0) {
      const userCampus = campuses.find(c => c.id === user.campus) || campuses[0];
      setCampus(userCampus);
    }
  }, [user, campuses]);

  const updatePosts = useCallback((newPosts: Post[]) => {
    setUserPosts(newPosts);
    setGlobalPosts(newPosts);
  }, [setGlobalPosts]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user || !user.id) {
        setPostsLoading(false);
        return;
      }
      setPostsLoading(true);
      const posts = await getPostsByUserId(user.id);
      if (posts) {
        setUserPosts(posts);
      }
      setPostsLoading(false);
    };
    fetchUserPosts();
  }, [user?.id, getPostsByUserId]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      toast.success(t("profile.upload_success"));
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <RotateCw className="animate-spin text-orange-500 size-12" />
        </div>
    );
  }

  return (
      <div className="min-h-screen w-full bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-orange-500/30 font-sans">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div
              className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-red-600/10 blur-[150px] rounded-full opacity-40 animate-pulse"
              style={{ animationDuration: "4s" }}
          />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full opacity-30" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
          <div className="mb-12 text-center sm:text-left space-y-2 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 drop-shadow-sm">
              {t("profile.title")}
            </span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              {t("profile.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
              <UserProfileCard
                  name={name}
                  username={initialUser.username}
                  avatarUrl={avatar}
                  handleAvatarClick={handleAvatarClick}
                  handleFileChange={handleFileChange}
                  fileInputRef={fileInputRef}
                  postCount={userPosts.length}
              />
            </div>
            <div className="lg:col-span-8 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="w-full py-3 h-14 bg-slate-900/50 p-1 rounded-xl border border-slate-800 backdrop-blur-md mb-8 grid grid-cols-3">
                  <TabsTrigger
                      value="info"
                      className="h-4/5 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r 
                      data-[state=active]:from-rose-600 data-[state=active]:to-orange-500
                      data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium"
                  >
                    <UserIcon className="w-4 h-4 mr-2" /> {t("profile.personal_info")}
                  </TabsTrigger>
                  <TabsTrigger
                      value="security"
                      className="h-4/5 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r 
                      data-[state=active]:from-rose-600 data-[state=active]:to-orange-500
                       data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" /> {t("profile.security")}
                  </TabsTrigger>
                  <TabsTrigger
                      value="posts"
                      className="h-4/5 rounded-xl text-slate-400 data-[state=active]:bg-gradient-to-r 
                      data-[state=active]:from-rose-600 data-[state=active]:to-orange-500
                       data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-medium"
                  >
                    <LayoutGrid className="w-4 h-4 mr-2" /> {t("profile.my_posts")}
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="mt-0 focus-visible:outline-none">
                  <PersonalInfoForm
                      user={user}
                      updateUser={updateUser}
                      name={name}
                      setName={setName}
                      email={email}
                      setEmail={setEmail}
                      phone={phone}
                      setPhone={setPhone}
                      weixinId={weixinId}
                      setWeixinId={setWeixinId}
                      campus={campus}
                      setCampus={setCampus}
                  />
                </TabsContent>
                <TabsContent value="security" className="mt-0 focus-visible:outline-none">
                  <SecurityForm
                      user={user}
                      updateUser={updateUser}
                      newPassword={newPassword}
                      setNewPassword={setNewPassword}
                      confirmNewPassword={confirmNewPassword}
                      setConfirmNewPassword={setConfirmNewPassword}
                  />
                </TabsContent>
                <TabsContent value="posts" className="mt-0 focus-visible:outline-none">
                  <UserPosts
                      posts={userPosts}
                      loading={postsLoading}
                      updatePosts={updatePosts}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
  );
};

export default UserPage;