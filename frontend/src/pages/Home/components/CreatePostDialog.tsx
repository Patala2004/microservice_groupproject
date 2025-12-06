import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import type { Post, PostCategory } from "../mockData";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (postData: Partial<Post>) => void;
}

const CreatePostDialog = ({ open, onOpenChange, onCreate }: CreatePostDialogProps) => {
  const { t } = useTranslation();
  const [newPost, setNewPost] = useState<Partial<Post>>({
    title: "", content: "", type: "activity", price: "", location: "",
  });

  const handleSubmit = () => {
    onCreate(newPost);
    // Reset form
    setNewPost({ title: "", content: "", type: "activity", price: "", location: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle>{t("create_modal.title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label>{t("create_modal.label_title")}</Label>
            <Input
              className="bg-slate-950 border-slate-800"
              placeholder={t("create_modal.placeholder_title")}
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />
          </div>
          {/* Content */}
          <div className="grid gap-2">
            <Label>{t("create_modal.label_content")}</Label>
            <Input
              className="bg-slate-950 border-slate-800"
              placeholder={t("create_modal.placeholder_content")}
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            />
          </div>
          {/* Category */}
          <div className="grid gap-2">
            <Label>{t("create_modal.label_category")}</Label>
            <Select
              onValueChange={(val) => setNewPost({ ...newPost, type: val as PostCategory })}
              value={newPost.type}
            >
              <SelectTrigger className="bg-slate-950 border-slate-800">
                <SelectValue placeholder={t("create_modal.label_type")} />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                <SelectItem value="activity">{t("post_type.activity")}</SelectItem>
                <SelectItem value="sell">{t("post_type.sell")}</SelectItem>
                <SelectItem value="buy">{t("post_type.buy")}</SelectItem>
                <SelectItem value="transport">{t("post_type.transport")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="bg-orange-600 text-white" disabled={!newPost.title}>
              {t("create_modal.submit_btn")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;