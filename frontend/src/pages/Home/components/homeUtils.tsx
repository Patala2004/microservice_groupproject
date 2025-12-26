import { ShoppingBag, Dumbbell, Calendar, Tag } from "lucide-react";
import {PostType} from "@/Context/PostType.tsx";

export const getBadgeStyle = (type: PostType) => {
  switch (type) {
    case PostType.SELL: return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
    case PostType.BUY: return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20";
    case PostType.ACTIVITY: return "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20";
    default: return "bg-slate-800 text-slate-400";
  }
};

export const getTypeLabel = (type: PostType, t: any) => {
  switch (type) {
    case PostType.SELL:
      return <><Tag className="w-4 h-4 inline-block mr-1.5" /> {t("post_type.sell")}</>;
    case PostType.BUY:
      return <><ShoppingBag className="w-4 h-4 inline-block mr-1.5" /> {t("post_type.buy")}</>;
    case PostType.ACTIVITY:
      return <><Calendar className="w-4 h-4 inline-block mr-1.5" /> {t("post_type.activity")}</>;
    default:
      return type;
  }
};