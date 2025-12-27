import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usePost, type CreatePostPayload, type Post } from "@/Context/PostContext.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import { RotateCw, Edit, Tag, Calendar, ShoppingBag } from "lucide-react";
import { PostType } from "@/Context/PostType";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: (newPost: Post) => void;
}

const CreatePostDialog = ({ open, onOpenChange, onPostCreated }: CreatePostDialogProps) => {
  const { t } = useTranslation();
  const { createPost } = usePost();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<PostType>(PostType.ACTIVITY);
  const [locationTitle, setLocationTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanStates = () => {
    setTitle("");
    setContent("");
    setType(PostType.ACTIVITY);
    setLocationTitle("");
    setEventTime("");
    setImageFile(null);
  };

  const handleSubmit = async () => {
    if (!user || !user.id) return;
    if (!title || !content || !locationTitle || (type === PostType.ACTIVITY && !eventTime)) {
      toast.error(t("errors.all_fields_required"));
      return;
    }

    setLoading(true);
    const postData: CreatePostPayload = {
      title,
      content,
      type,
      locationTitle,
      poster: user.id,
      eventTime: type === PostType.ACTIVITY ? new Date(eventTime).toISOString() : undefined,
      imageFile: imageFile,
    };

    const newPost = await createPost(postData);
    setLoading(false);
    if (newPost) {
      toast.success(t("success.post_created"));
      onPostCreated(newPost);
      cleanStates();
      onOpenChange(false);
    } else {
      toast.error(t("errors.generic_error_creation"));
    }
  };

  const getHeaderGradient = () => {
    switch (type) {
      case PostType.ACTIVITY: return "bg-gradient-to-r from-sky-800 to-cyan-700";
      case PostType.SELL: return "bg-gradient-to-r from-emerald-800 to-green-700";
      case PostType.BUY: return "bg-gradient-to-r from-indigo-800 to-violet-700";
      default: return "bg-slate-800";
    }
  };

  const getHeaderIcon = () => {
    switch (type) {
      case PostType.ACTIVITY: return <Calendar className="w-6 h-6 text-white mr-5" />;
      case PostType.SELL: return <Tag className="w-6 h-6 text-white mr-5" />;
      case PostType.BUY: return <ShoppingBag className="w-6 h-6 text-white mr-5" />;
      default: return <Edit className="w-6 h-6 text-white mr-5" />;
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-0 overflow-hidden bg-slate-900 border-slate-800 text-slate-200 rounded-xl">
          <div className={`h-24 w-full relative flex items-end p-6 ${getHeaderGradient()} rounded-t-xl`}>
            <div className="absolute top-0 right-0 p-4 opacity-30">{getHeaderIcon()}</div>
            <h2 className="text-xl font-bold text-white">{t("create_modal.header_title")} - {t(`post_type.${type.toLowerCase()}`)}</h2>
          </div>
          <div className="p-6 grid gap-4">
            <DialogTitle className="hidden">{t("create_modal.title")}</DialogTitle>

            <div className="grid gap-2">
              <Label>{t("create_modal.label_category")}</Label>
              <Select onValueChange={(val: any) => setType(val)} value={type}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value={PostType.ACTIVITY}>{t("post_type.activity")}</SelectItem>
                  <SelectItem value={PostType.SELL}>{t("post_type.sell")}</SelectItem>
                  <SelectItem value={PostType.BUY}>{t("post_type.buy")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{t("create_modal.label_title")}</Label>
              <Input className="bg-slate-800/50 border-slate-700" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("create_modal.label_content")}</Label>
              <Input className="bg-slate-800/50 border-slate-700" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>{t("create_modal.label_location")}</Label>
              <Input className="bg-slate-800/50 border-slate-700" value={locationTitle} onChange={(e) => setLocationTitle(e.target.value)} />
            </div>
            {type === PostType.ACTIVITY && (
                <div className="grid gap-2">
                  <Label>{t("create_modal.label_event_time")}</Label>
                  <Input type="datetime-local" className="bg-slate-800/50 border-slate-700" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
                </div>
            )}
            <div className="flex justify-end pt-4">
              <Button onClick={handleSubmit} variant="gradient-fire" disabled={loading}>{loading ? <RotateCw className="animate-spin mr-2" /> : t("create_modal.submit_btn")}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default CreatePostDialog;