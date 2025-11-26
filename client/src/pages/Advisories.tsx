import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { AlertCircle, Calendar } from "lucide-react";
import type { Advisory } from "@shared/schema";
import { format } from "date-fns";

export default function Advisories() {
  const { t } = useLanguage();

  const { data: advisories, isLoading } = useQuery<Advisory[]>({
    queryKey: ["/api/advisories"],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    return <AlertCircle className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("advisories")}
          </h1>
          <p className="text-muted-foreground">
            {t("latestAdvisories")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : advisories && advisories.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {advisories.map((advisory, index) => (
              <motion.div
                key={advisory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover-elevate active-elevate-2" data-testid={`card-advisory-${advisory.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(advisory.category)}
                        <Badge variant="outline" className="capitalize">
                          {advisory.category}
                        </Badge>
                      </div>
                      <Badge variant={getSeverityColor(advisory.severity) as any}>
                        {t(advisory.severity)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{advisory.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{advisory.content}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {advisory.timestamp
                          ? format(new Date(advisory.timestamp), "MMM dd, yyyy")
                          : t("recently")}
                      </div>
                      {advisory.source && (
                        <div>{t("sourceLabel")}: {advisory.source}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noAdvisoriesYet")}</h3>
              <p className="text-muted-foreground">
                {t("checkBackLater")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
