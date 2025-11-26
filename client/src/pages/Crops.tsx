import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Sprout, TrendingUp, Calendar, Droplets } from "lucide-react";
import type { Crop } from "@shared/schema";
import cropImage from "@assets/generated_images/healthy_rice_crop_closeup.png";

export default function Crops() {
  const { t } = useLanguage();

  const { data: crops, isLoading } = useQuery<Crop[]>({
    queryKey: ["/api/crops"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("crops")}
          </h1>
          <p className="text-muted-foreground">
            {t("exploreCrops")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        ) : crops && crops.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {crops.map((crop, index) => (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full overflow-hidden hover-elevate active-elevate-2" data-testid={`card-crop-${crop.id}`}>
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3)), url(${cropImage})`,
                    }}
                  >
                    <div className="h-full flex items-end p-4">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                        {crop.season}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sprout className="h-5 w-5 text-green-600" />
                      {crop.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {crop.description || t("suitableForRegion")}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="h-4 w-4 text-cyan-600" />
                        <span className="text-muted-foreground">{t("waterReq")}:</span>
                        <span className="font-medium">{crop.waterRequirement}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-amber-600" />
                        <span className="text-muted-foreground">{t("duration")}:</span>
                        <span className="font-medium">{crop.growthDuration} {t("days")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-muted-foreground">{t("expectedYield")}:</span>
                        <span className="font-medium">{crop.expectedYield} kg/acre</span>
                      </div>
                      {crop.profitEstimate && (
                        <div className="pt-3 border-t">
                          <div className="text-sm text-muted-foreground">{t("profit")}</div>
                          <div className="text-xl font-bold text-green-600">
                            ₹{crop.profitEstimate}/acre
                          </div>
                        </div>
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
              <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noCropsAvailable")}</h3>
              <p className="text-muted-foreground">
                {t("cropsWillAppear")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
