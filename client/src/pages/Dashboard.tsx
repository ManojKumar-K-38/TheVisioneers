import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Cloud,
  Droplets,
  Wind,
  CloudRain,
  Sprout,
  TrendingUp,
  AlertCircle,
  MessageCircle,
  FlaskConical,
  Bug,
} from "lucide-react";
import { Link } from "wouter";
import type { WeatherData, Crop, Resource, Advisory } from "@shared/schema";

export default function Dashboard() {
  const { t } = useLanguage();

  const { data: weather, isLoading: weatherLoading } = useQuery<WeatherData>({
    queryKey: ["/api/weather/current"],
  });

  const { data: crops, isLoading: cropsLoading } = useQuery<Crop[]>({
    queryKey: ["/api/crops/recommended"],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery<Resource[]>({
    queryKey: ["/api/resources/current"],
  });

  const { data: advisories, isLoading: advisoriesLoading } = useQuery<Advisory[]>({
    queryKey: ["/api/advisories/recent"],
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

  const getEfficiencyPercentage = (used: number, optimal: number) => {
    if (optimal === 0) return 0;
    return Math.min(100, (used / optimal) * 100);
  };

  const getEfficiencyStatus = (percentage: number) => {
    if (percentage <= 90) return { color: "text-green-600", text: t("efficiency") };
    if (percentage <= 110) return { color: "text-amber-600", text: t("warning") };
    return { color: "text-red-600", text: t("critical") };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("welcome")}, {t("demoFarmer")}
          </h1>
          <p className="text-muted-foreground">{t("dashboard")}</p>
        </motion.div>

        {advisories && advisories.length > 0 && advisories.some((a) => a.severity === "critical") && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive">{t("critical")} {t("advisories")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {advisories.filter((a) => a.severity === "critical").length} {t("urgentAlerts")}
                    </p>
                  </div>
                  <Link href="/advisories">
                    <Button variant="destructive" size="sm" data-testid="button-view-alerts">
                      {t("viewAll")}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.div variants={itemVariants}>
            <Card className="h-full" data-testid="card-weather">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  {t("todayWeather")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : weather ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-4xl font-bold">{weather.temperature}°C</div>
                        <div className="text-muted-foreground capitalize">{weather.condition}</div>
                      </div>
                      <Cloud className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("humidity")}</div>
                          <div className="font-semibold">{weather.humidity}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("rainfall")}</div>
                          <div className="font-semibold">{weather.rainfall || 0}mm</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-gray-600" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("wind")}</div>
                          <div className="font-semibold">{weather.windSpeed || 0}km/h</div>
                        </div>
                      </div>
                    </div>
                    {weather.advisory && (
                      <div className="pt-4 border-t">
                        <Badge variant="secondary">{weather.advisory}</Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t("noWeatherData")}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full" data-testid="card-crops">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600 dark:text-green-400" />
                  {t("recommendedCrops")}
                </CardTitle>
                <Link href="/crops">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-crops">
                    {t("viewAll")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {cropsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-32" />
                    ))}
                  </div>
                ) : crops && crops.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {crops.slice(0, 4).map((crop) => (
                      <Card key={crop.id} className="hover-elevate active-elevate-2" data-testid={`card-crop-${crop.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold">{crop.name}</h3>
                            <Badge variant="secondary">{crop.season}</Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div>
                              {t("expectedYield")}: {crop.expectedYield} kg/acre
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              {t("profit")}: ₹{crop.profitEstimate}/acre
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t("noCropRecommendations")}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <Card data-testid="card-resources">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  {t("resourceUsage")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resourcesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16" />
                    ))}
                  </div>
                ) : resources && resources.length > 0 ? (
                  <div className="space-y-6">
                    {resources.slice(0, 3).map((resource) => {
                      const percentage = getEfficiencyPercentage(resource.used, resource.optimal);
                      const status = getEfficiencyStatus(percentage);
                      return (
                        <div key={resource.id} data-testid={`resource-${resource.resourceType}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{resource.resourceType}</span>
                            <span className={`text-sm font-semibold ${status.color}`}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>
                              {resource.used} {resource.unit}
                            </span>
                            <span>
                              {t("optimal")}: {resource.optimal} {resource.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t("noResourceData")}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-advisories">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  {t("recentAdvisories")}
                </CardTitle>
                <Link href="/advisories">
                  <Button variant="ghost" size="sm" data-testid="button-view-all-advisories">
                    {t("viewAll")}
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {advisoriesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-20" />
                    ))}
                  </div>
                ) : advisories && advisories.length > 0 ? (
                  <div className="space-y-3">
                    {advisories.slice(0, 3).map((advisory) => (
                      <Card key={advisory.id} className="hover-elevate active-elevate-2" data-testid={`advisory-${advisory.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-medium text-sm">{advisory.title}</h4>
                            <Badge variant={getSeverityColor(advisory.severity) as any} className="text-xs">
                              {advisory.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {advisory.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t("noRecentAdvisories")}</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-6 right-6 flex flex-col gap-3"
        >
          <Link href="/chatbot">
            <Button
              size="lg"
              className="rounded-full h-14 w-14 shadow-lg"
              data-testid="button-chatbot-fab"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
