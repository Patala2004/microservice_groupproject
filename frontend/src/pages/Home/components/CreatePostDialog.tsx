import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usePost, type CreatePostPayload} from "@/Context/PostContext.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import React from "react";
import { RotateCw, X, Edit, Tag, Calendar, ShoppingBag, Dumbbell } from "lucide-react";
import { PostType } from "@/Context/PostType";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePostDialog = ({ open, onOpenChange }: CreatePostDialogProps) => {
  const { t } = useTranslation();
  const { createPost } = usePost();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>(PostType.ACTIVITY);
  const [locationTitle, setLocationTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanStates = () => {
    setTitle("");
    setContent("");
    setType(PostType.ACTIVITY);
    setLocationTitle("");
    setImageFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async () => {
    if (!user || !user.id) {
      toast.error("Authentication required.");
      return;
    }

    if (!title || !content || !locationTitle) {
      toast.error(t("errors.all_fields_required"));
      return;
    }

    if (isNaN(user.id) || user.id <= 0) {
      toast.error("Invalid user ID.");
      return;
    }

    setLoading(true);

    const postData: CreatePostPayload = {
      title,
      content,
      type,
      locationTitle,
      poster: user.id,
      imageFile: imageFile,
    };

    const newPost = await createPost(postData);

    setLoading(false);

    if (newPost) {
      toast.success(t("success.signup_successful"));
      cleanStates();
      onOpenChange(false);
    } else {
      toast.error(t("errors.generic_signup_error"));
    }
  };

  const getHeaderGradient = () => {
    switch (type) {
      case PostType.ACTIVITY:
        return "bg-gradient-to-r from-sky-800 to-cyan-700";
      case PostType.SELL:
        return "bg-gradient-to-r from-emerald-800 to-green-700";
      case PostType.BUY:
        return "bg-gradient-to-r from-indigo-800 to-violet-700";
      case PostType.SPORT:
        return "bg-gradient-to-r from-red-800 to-rose-700";
      default:
        return "bg-slate-800";
    }
  };

  const getHeaderIcon = () => {
    switch (type) {
      case PostType.ACTIVITY:
        return <Calendar className="w-6 h-6 text-white" />;
      case PostType.SELL:
        return <Tag className="w-6 h-6 text-white" />;
      case PostType.BUY:
        return <ShoppingBag className="w-6 h-6 text-white" />;
      case PostType.SPORT:
        return <Dumbbell className="w-6 h-6 text-white" />;
      default:
        return <Edit className="w-6 h-6 text-white" />;
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-slate-900 border-slate-800 shadow-2xl text-slate-200 rounded-xl">

          <div className={`h-24 w-full relative overflow-hidden flex items-end p-6 ${getHeaderGradient()} rounded-t-xl`}>
            <div className="absolute top-0 right-0 p-4 opacity-30">
              {getHeaderIcon()}
            </div>

            <div className="relative z-10 flex w-full justify-between items-end">
              <h2 className="text-xl font-bold text-white tracking-tight">
                {t("create_modal.header_title")}
              </h2>
              <DialogClose asChild>
                <Button size="icon" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* FORM CONTENT */}
          <div className="p-6">
            <DialogTitle className="hidden">{t("create_modal.title")}</DialogTitle>
            <div className="grid gap-4 py-4">

              <div className="grid gap-2">
                <Label htmlFor="title">{t("create_modal.label_title")}</Label>
                <Input
                    id="title"
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 rounded-md"
                    placeholder={t("create_modal.placeholder_title")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">{t("create_modal.label_content")}</Label>
                <Input
                    id="content"
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 rounded-md"
                    placeholder={t("create_modal.placeholder_content")}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">{t("create_modal.label_location")}</Label>
                <Input
                    id="location"
                    className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus-visible:ring-cyan-500 rounded-md"
                    placeholder={t("create_modal.placeholder_location")}
                    value={locationTitle}
                    onChange={(e) => setLocationTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">{t("create_modal.label_category")}</Label>
                  <Select
                      onValueChange={(val:any) => setType(val as PostType)}
                      value={type}
                  >
                    <SelectTrigger id="type" className="bg-slate-800/50 border-slate-700 text-slate-100 focus-visible:ring-cyan-500 rounded-md">
                      <SelectValue placeholder={t("create_modal.label_type")} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      <SelectItem value={PostType.ACTIVITY}>{t("post_type.activity")}</SelectItem>
                      <SelectItem value={PostType.SELL}>{t("post_type.sell")}</SelectItem>
                      <SelectItem value={PostType.BUY}>{t("post_type.buy")}</SelectItem>
                      <SelectItem value={PostType.SPORT}>{t("post_type.sport")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">{t("create_modal.label_image")}</Label>
                  <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 cursor-pointer file:text-cyan-400 file:bg-slate-900 hover:file:bg-slate-800 focus-visible:ring-cyan-500 rounded-md"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                    onClick={handleSubmit}
                    variant="gradient-fire"
                    size="main-button"
                    disabled={loading || !title || !content || !locationTitle}
                >
                  {loading ? <RotateCw className="size-4 animate-spin mr-2" /> : t("create_modal.submit_btn")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default CreatePostDialog;