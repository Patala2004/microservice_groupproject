import { ShoppingBag, Car, Calendar, Tag } from "lucide-react";
import type { PostCategory } from "../mockData";

export const getBadgeStyle = (type: PostCategory) => {
  switch (type) {
    case "sell": return "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20";
    case "buy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20";
    case "activity": return "bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20";
    case "transport": return "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20";
    default: return "bg-slate-800 text-slate-400";
  }
};

export const getTypeLabel = (type: PostCategory, t: any) => {
  switch (type) {
    case "sell": return <><Tag className="w-3 h-3 mr-1.5" /> {t("post_type.sell")}</>;
    case "buy": return <><ShoppingBag className="w-3 h-3 mr-1.5" /> {t("post_type.buy")}</>;
    case "activity": return <><Calendar className="w-3 h-3 mr-1.5" /> {t("post_type.activity")}</>;
    case "transport": return <><Car className="w-3 h-3 mr-1.5" /> {t("post_type.transport")}</>;
    default: return type;
  }
};