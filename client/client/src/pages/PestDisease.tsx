import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Bug, Search, AlertTriangle } from "lucide-react";
import { useState } from "react";
import type { PestDisease } from "@shared/schema";

export default function PestDiseasePage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: pestsAndDiseases, isLoading } = useQuery<PestDisease[]>({
    queryKey: ["/api/pests-diseases"],
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      default:
        return "default";
    }
  };

  const filteredPests = pestsAndDiseases?.filter((pest) =>
    pest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pest.cropAffected.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("pestDiseaseTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("identifyManage")}
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={`${t("search")} pests or diseases...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-pests"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : filteredPests && filteredPests.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPests.map((pest, index) => (
              <motion.div
                key={pest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover-elevate active-elevate-2" data-testid={`card-pest-${pest.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Bug className={`h-8 w-8 ${pest.type === "pest" ? "text-red-600" : "text-amber-600"}`} />
                      <Badge variant={getSeverityColor(pest.severity) as any}>
                        {t(pest.severity)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{pest.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("affectsCrop")}: {pest.cropAffected}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="symptoms">
                        <AccordionTrigger className="text-sm font-medium">
                          {t("symptoms")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc pl-4 space-y-1 text-sm">
                            {(pest.symptoms as string[]).map((symptom, idx) => (
                              <li key={idx}>{symptom}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="treatment">
                        <AccordionTrigger className="text-sm font-medium">
                          {t("treatment")}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{pest.treatment}</p>
                        </AccordionContent>
                      </AccordionItem>
                      {pest.prevention && (
                        <AccordionItem value="prevention">
                          <AccordionTrigger className="text-sm font-medium">
                            {t("prevention")}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm">{pest.prevention}</p>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noResultsFound")}</h3>
              <p className="text-muted-foreground">
                {t("tryDifferentKeywords")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
