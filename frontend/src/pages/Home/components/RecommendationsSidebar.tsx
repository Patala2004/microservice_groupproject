import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { FAKE_RECOMMENDATIONS } from "../mockData";

const RecommendationsSidebar = () => {
  const { t } = useTranslation();

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-24 shadow-xl">
      <CardHeader className="pb-3 px-6 pt-6">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-100">
          <Sparkles className="w-4 h-4 text-orange-500" />
          {t("home.trending_topics")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {FAKE_RECOMMENDATIONS.map((topic) => (
            <Badge
              key={topic.id}
              variant="outline"
              className="cursor-pointer border-slate-700 bg-slate-800/50 text-slate-400 hover:border-orange-500/50 hover:text-orange-400 px-3 py-1.5 text-sm font-normal transition-all duration-300"
            >
              #{topic.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationsSidebar;