import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import {type Post} from "@/Context/PostContext.tsx";

interface PostDeleteModalProps {
    post: Post | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirmDelete: (postId: number) => void;
}

const PostDeleteModal = ({ post, isOpen, onClose, onConfirmDelete }: PostDeleteModalProps) => {
    const { t } = useTranslation();

    const handleConfirm = () => {
        if (post?.id) {
            onConfirmDelete(post.id);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 rounded-xl max-w-sm">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl text-red-500 flex items-center gap-2">
                        <AlertTriangle className="size-6" />
                        {t("profile.delete_modal_title")}
                    </DialogTitle>
                </DialogHeader>

                <DialogDescription className="text-slate-400 mt-4">
                    {t("profile.delete_modal_desc")}
                </DialogDescription>

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:bg-slate-800">
                        {t("profile.cancel_btn")}
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="delete"
                        size="default"
                        className="shadow-red-900/40"
                    >
                        {t("profile.delete_btn")}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PostDeleteModal;