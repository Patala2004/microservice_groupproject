import { Heart, MessageCircle, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import {getBadgeStyle, getTypeLabel} from "@/pages/Home/components/homeUtils";
import type {Post} from "@/Context/PostContext.tsx";
import type {User} from "@/Context/userTypes.tsx";
import { useState } from "react";
import PostDeleteModal from "@/pages/Modal/PostDeleteModal.tsx";

interface PostCardProps {
  post: Post;
  user: User | null;
  onDelete: (postId: number) => void;
}

const PostCard = ({ post, user, onDelete }: PostCardProps) => {
  const { t } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const posterIdString = post.poster.toString();
  const currentUserIdString = user?.id?.toString();

  const isHost = posterIdString === currentUserIdString;

  const displayName = user?.name || `User ID: ${post.poster}`;
  const posterAvatarUrl = user?.avatarUrl;
  const initials = displayName?.charAt(0).toUpperCase() || posterIdString.charAt(0);
  const locationTitle = post.location?.title || t('post_actions.no_location');

  const cardShadowHover = "hover:shadow-red-900/10";
  const cardBorderHover = "hover:border-orange-700";
  const accentColor = "text-orange-400";

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (postId: number) => {
    setIsDeleteModalOpen(false);
    onDelete(postId);
  };

  const handleCardClick = () => {
    // TODO: Ouvrir la modal de détails (PostDetailsModal) si nécessaire
  };


  return (
      <>
        <Card
            onClick={handleCardClick}
            className={`group relative border-slate-800 bg-slate-900/60 shadow-lg 
            ${cardShadowHover} ${cardBorderHover} transition-all duration-300 cursor-pointer overflow-hidden`}
        >
          <CardContent className="p-6 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700">
                  {posterAvatarUrl && <AvatarImage src={posterAvatarUrl} />}
                  <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                <span className={`text-sm font-bold text-slate-200 leading-none mb-1 group-hover:${accentColor} transition-colors`}>
                  {displayName}
                </span>
                  <span className="text-xs text-slate-500 font-medium">@{user?.weixinId}</span>
                </div>
              </div>

              <div className={`flex flex-row items-center justify-center 
              rounded-full px-3 py-1 text-xs font-medium border ${getBadgeStyle(post.type)}`}>
                {getTypeLabel(post.type, t)}
              </div>

              {isHost && (
                  <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDeleteClick}
                      className="size-8 rounded-full text-red-500/70 hover:text-red-500 hover:bg-red-500/10"
                  >
                    <X className="size-4" />
                  </Button>
              )}
            </div>

            <div className="mb-5">
              <h3 className="text-lg font-bold mb-2 text-slate-100">{post.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                {post.content}
              </p>
            </div>

            {post.location && (
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="inline-flex items-center text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800">
                    <MapPin className="w-3 h-3 mr-1.5 opacity-70" /> {locationTitle}
                  </div>
                </div>
            )}

            {(post.type === "ACTIVITY" || post.type === "SPORT") && (
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800/50 flex items-center justify-between group/box transition-colors hover:bg-slate-950">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 overflow-hidden">
                      {[...Array(Math.min(3, post.joinedUsers.length))].map((_, i) => (
                          <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-600" />
                      ))}
                    </div>
                    <span className="ml-4 text-xs font-semibold text-slate-400 group-hover/box:text-slate-300 transition-colors">
                  {t("post_actions.joined_count", { count: post.joinedUsers.length })}
                </span>
                  </div>
                </div>
            )}
          </CardContent>

          <CardFooter className="px-6 py-3 bg-slate-950/30 border-t border-slate-800 flex justify-between items-center">
            <div className="flex gap-4">
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-pink-500 transition-colors group/like">
                <Heart className="w-4 h-4 group-hover/like:fill-pink-500 transition-all" />
                0 {t("post_actions.like")}
              </button>
              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                0 {t("post_actions.comment")}
              </button>
            </div>

            {(post.type === "BUY" || post.type === "SELL") && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 px-3 -mr-2"
                    onClick={(e) => { e.stopPropagation(); }}
                >
                  {t("post_actions.contact")}
                </Button>
            )}
          </CardFooter>
        </Card>

        {isHost && (
            <PostDeleteModal
                post={post}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirmDelete={handleConfirmDelete}
            />
        )}
      </>
  );
};

export default PostCard;