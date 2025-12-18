import { MapPin, X, Users, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import { getBadgeStyle, getTypeLabel } from "@/pages/Home/components/homeUtils";
import { usePost, type Post } from "@/Context/PostContext.tsx";
import type { User } from "@/Context/userTypes.tsx";
import { useState, useEffect, useCallback } from "react";
import PostDeleteModal from "@/pages/Modal/PostDeleteModal.tsx";
import { useUser } from "@/Context/UserContext.tsx";
import PostDetailsModal from "@/pages/Home/components/PostDetailsModal.tsx";
import { toast } from "sonner";

interface PostCardProps {
  post: Post;
  user: User | null;
  onDelete: (postId: number) => void;
  canEditPost: boolean;
  onPostUpdated?: (updatedPost: Post) => void;
}

interface DisplayUser {
  id: string;
  name: string;
  avatarUrl?: string;
  weixinId: string;
  email: string;
  phone_number: string;
}

const PostCard = ({ post, user, onDelete, canEditPost = false, onPostUpdated }: PostCardProps) => {
  const { t } = useTranslation();
  const { getUserById } = useUser();
  const { joinPost, leavePost } = usePost();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [posterDetails, setPosterDetails] = useState<DisplayUser | null>(null);
  const [joinerDetails, setJoinerDetails] = useState<DisplayUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const posterIdString = post.poster.toString();
  const currentUserIdString = user?.id?.toString();
  const isHost = posterIdString === currentUserIdString;

  const defaultPoster: DisplayUser = {
    id: posterIdString,
    name: `User ID: ${post.poster}`,
    weixinId: '',
    email: '',
    phone_number: '',
    avatarUrl: undefined,
  };
  const displayPoster = posterDetails || defaultPoster;
  const initials = displayPoster.name.charAt(0).toUpperCase() || '?';

  const locationTitle = post.location?.title || t('post_actions.no_location');
  const cardShadowHover = "hover:shadow-red-900/10";
  const cardBorderHover = "hover:border-orange-700";
  const accentColor = "text-orange-400";

  const fetchUserDetails = useCallback(async () => {
    setLoadingUsers(true);

    const fetchedPoster = await getUserById(posterIdString);
    if (fetchedPoster) {
      setPosterDetails({
        id: fetchedPoster.id.toString(),
        name: fetchedPoster.name || `User ID: ${fetchedPoster.id}`,
        avatarUrl: fetchedPoster.avatarUrl,
        weixinId: fetchedPoster.weixinId || '',
        email: fetchedPoster.email || '',
        phone_number: fetchedPoster.phone_number || ''
      } as DisplayUser);
    }

    const joinerIdsToFetch = post.joinedUsers.slice(0, 4).map(id => id.toString());
    const fetchedJoiners = await Promise.all(joinerIdsToFetch.map(id => getUserById(id)));

    setJoinerDetails(fetchedJoiners.filter((u): u is User => u !== null).map(u => ({
      id: u!.id.toString(),
      name: u!.name || `User ID: ${u!.id}`,
      avatarUrl: u!.avatarUrl,
      weixinId: u!.weixinId || '',
      email: u!.email || '',
      phone_number: u!.phone_number || ''
    } as DisplayUser)));

    setLoadingUsers(false);
  }, [post.poster, post.joinedUsers, getUserById, posterIdString]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (postId: number) => {
    setIsDeleteModalOpen(false);
    onDelete(postId);
  };

  const handleJoinInModal = async (postId: number, isJoining: boolean) => {
    if (!user) return;

    try {
      let success = false;

      if (isJoining) {
        success = await joinPost(postId, user?.id);
        if (success) toast.success(t("post_actions.join_success"));
      } else {
        success = await leavePost(postId, user?.id);
        if (success) toast.success(t("post_actions.leave_success"));
      }
    } catch (e) {
      console.error("Join/Leave error", e);
    }
  };

  const handleInternalUpdate = (updatedPost: Post) => {
    if (onPostUpdated) {
      onPostUpdated(updatedPost);
    }
  };

  const maxAvatars = 4;
  const avatarsToShow = joinerDetails.slice(0, maxAvatars);
  const remainingCount = post.joinedUsers.length - avatarsToShow.length;

  return (
      <>
        <Card
            onClick={() => setIsDetailsModalOpen(true)}
            className={`group relative border-slate-800 bg-slate-900/60 shadow-lg ${cardShadowHover} ${cardBorderHover} transition-all duration-300 cursor-pointer overflow-hidden`}
        >
          <CardContent className="p-6 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700">
                  {displayPoster.avatarUrl && <AvatarImage src={displayPoster.avatarUrl} />}
                  <AvatarFallback className="bg-slate-800 text-slate-200 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className={`text-sm font-bold text-slate-200 leading-none mb-1 group-hover:${accentColor} transition-colors`}>{displayPoster.name}</span>
                  <span className="text-xs text-slate-500 font-medium">{displayPoster.weixinId ? `@${displayPoster.weixinId}` : t('profile.default_weixin_unavailable')}</span>
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <div className={`flex flex-row items-center justify-center rounded-full px-3 py-1 text-xs font-medium border ${getBadgeStyle(post.type)}`}>
                  {loadingUsers ? <RotateCw className="size-4 animate-spin" /> : getTypeLabel(post.type, t)}
                </div>
                {isHost && (
                    <Button variant="ghost" size="icon" onClick={handleDeleteClick} className="size-8 rounded-full text-red-500/70 hover:text-red-500 hover:bg-red-500/10">
                      <X className="size-4" />
                    </Button>
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-lg font-bold mb-2 text-slate-100">{post.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">{post.content}</p>
            </div>

            {post.location && (
                <div className="flex flex-wrap gap-2 mb-5">
                  <div className="inline-flex items-center text-xs font-medium text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800">
                    <MapPin className="w-3 h-3 mr-1.5 opacity-70" /> {locationTitle}
                  </div>
                </div>
            )}

            <div className="mt-4 flex items-center justify-between text-xs font-medium text-slate-500">
              {(post.type === "ACTIVITY" || post.type === "SPORT") && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden mr-2">
                      {avatarsToShow.length > 0 ? avatarsToShow.map((joiner) => (
                          <Avatar key={joiner.id} className="h-6 w-6 ring-2 ring-slate-900">
                            {joiner.avatarUrl && <AvatarImage src={joiner.avatarUrl} />}
                            <AvatarFallback className="bg-slate-700 text-slate-300 text-[10px] font-bold">{joiner.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      )) : (
                          <div className="h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-800/50 flex items-center justify-center">
                            <Users className="w-3 h-3 text-slate-600" />
                          </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span className="text-xs font-semibold">
                    {post.joinedUsers.length > 0 ? t("post_actions.joined_count", { count: post.joinedUsers.length }) : t("post_actions.be_first")}
                  </span>
                      {remainingCount > 0 && <span className="text-xs text-slate-500 ml-1">+ {remainingCount} {t('post_actions.more')}</span>}
                    </div>
                  </div>
              )}
            </div>
          </CardContent>
        </Card>

        <PostDetailsModal
            post={post}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            currentUser={currentUserIdString || ""}
            onJoin={handleJoinInModal}
            onPostUpdated={handleInternalUpdate}
            posterName={displayPoster.name}
            posterAvatarUrl={displayPoster.avatarUrl}
            canEditPost={canEditPost}
        />

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