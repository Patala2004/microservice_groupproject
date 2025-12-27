import { MapPin, X, RotateCw, Clock, CalendarDays, Users } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

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

  const [localPost, setLocalPost] = useState<Post>(post);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [posterDetails, setPosterDetails] = useState<DisplayUser | null>(null);
  const [joinerDetails, setJoinerDetails] = useState<DisplayUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    setLocalPost(post);
  }, [post]);

  const posterIdString = localPost?.poster?.toString();
  const currentUserIdString = user?.id?.toString();
  const isHost = posterIdString === currentUserIdString;

  const fetchUserDetails = useCallback(async () => {
    if (!localPost?.poster) return;
    setLoadingUsers(true);
    const fetchedPoster = await getUserById(posterIdString);
    if (fetchedPoster) setPosterDetails({ ...fetchedPoster, id: fetchedPoster.id.toString() } as any);
    const fetchedJoiners = await Promise.all((localPost?.joinedUsers || []).slice(0, 4).map(id => getUserById(id.toString())));
    setJoinerDetails(fetchedJoiners.filter((u): u is User => u !== null).map(u => ({ ...u, id: u.id.toString() } as any)));
    setLoadingUsers(false);
  }, [localPost?.poster, localPost?.joinedUsers, getUserById, posterIdString]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const handleJoinInModal = async (postId: number, isJoining: boolean) => {
    if (!user?.id) return;
    const success = isJoining ? await joinPost(postId, user.id) : await leavePost(postId, user.id);
    if (success) toast.success(t(isJoining ? "post_actions.join_success" : "post_actions.leave_success"));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Shanghai"
    });
  };

  if (!localPost) return null;

  return (
      <>
        <Card
            onClick={() => setIsDetailsModalOpen(true)}
            className="group relative border-slate-800 bg-slate-900/60 transition-all cursor-pointer overflow-hidden"
        >
          <CardContent className="p-6 pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-slate-700">
                  <AvatarImage src={posterDetails?.avatarUrl} />
                  <AvatarFallback className="bg-slate-800 text-slate-200 font-bold">
                    {posterDetails ? posterDetails.name.charAt(0) : <RotateCw className="size-3 animate-spin" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  {loadingUsers ? (
                      <>
                        <Skeleton className="h-4 w-24 bg-slate-800" />
                        <Skeleton className="h-3 w-16 bg-slate-800" />
                      </>
                  ) : (
                      <>
                        <span className="text-sm font-bold text-slate-200">{posterDetails?.name}</span>
                        {posterDetails?.weixinId && (
                            <span className="text-xs text-slate-500">@{posterDetails.weixinId}</span>
                        )}
                      </>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <div className={`flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getBadgeStyle(localPost.type)}`}>
                  {loadingUsers ? <RotateCw className="animate-spin size-3" /> : getTypeLabel(localPost.type, t)}
                </div>
                {isHost && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteModalOpen(true);
                        }}
                        className="text-red-500/70 hover:bg-red-500/10"
                    >
                      <X className="size-4" />
                    </Button>
                )}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="text-lg font-bold mb-2 text-slate-100">{localPost.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-3">{localPost.content}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {localPost.location && (
                  <div className="inline-flex items-center text-xs text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-800">
                    <MapPin className="w-3 h-3 mr-1" />
                    {localPost.location.title}
                  </div>
              )}
              {localPost.eventTime && (
                  <div className="inline-flex items-center text-xs text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-md border border-orange-500/20">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    {formatDate(localPost.eventTime)}
                  </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {loadingUsers ? (
                      <Skeleton className="h-6 w-6 rounded-full bg-slate-800" />
                  ) : joinerDetails.length > 0 ? (
                      joinerDetails.map(j => (
                          <Avatar key={j.id} className="h-6 w-6 ring-2 ring-slate-900">
                            <AvatarImage src={j.avatarUrl} />
                            <AvatarFallback className="text-[10px]">{j.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      ))
                  ) : (
                      <div className="h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-800/50 flex items-center justify-center">
                        <Users className="w-3 h-3 text-slate-600" />
                      </div>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                {localPost.joinedUsers?.length || 0} attending
              </span>
              </div>
              <div className="flex items-center text-[10px] text-slate-500 italic">
                <Clock className="size-3 mr-1" />
                {formatDate(localPost.creationTime)}
              </div>
            </div>
          </CardContent>
        </Card>

        <PostDetailsModal
            post={localPost}
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            currentUser={currentUserIdString || ""}
            onJoin={handleJoinInModal}
            onPostUpdated={(updatedPost) => {
              setLocalPost(updatedPost);
              onPostUpdated?.(updatedPost);
            }}
            posterName={posterDetails?.name || ""}
            posterAvatarUrl={posterDetails?.avatarUrl}
            canEditPost={canEditPost}
        />

        {isHost && (
            <PostDeleteModal
                post={localPost}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirmDelete={onDelete}
            />
        )}
      </>
  );
};

export default PostCard;