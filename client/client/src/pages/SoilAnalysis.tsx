import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Sprout, Droplets, ArrowRight, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const soilAnalysisSchema = z.object({
  soilType: z.string().min(1, "Soil type is required"),
  nitrogen: z.number().min(0).max(100),
  phosphorus: z.number().min(0).max(100),
  potassium: z.number().min(0).max(100),
  ph: z.number().min(0).max(14),
  organicMatter: z.number().min(0).max(100),
});

type SoilAnalysisForm = z.infer<typeof soilAnalysisSchema>;

export default function SoilAnalysis() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [recommendations, setRecommendations] = useState<string | null>(null);

  const form = useForm<SoilAnalysisForm>({
    resolver: zodResolver(soilAnalysisSchema),
    defaultValues: {
      soilType: "",
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      ph: 7,
      organicMatter: 3,
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: SoilAnalysisForm) => {
      return await apiRequest("POST", "/api/soil/analyze", data);
    },
    onSuccess: (data: any) => {
      setRecommendations(data.recommendations);
      setStep(3);
    },
  });

  const onSubmit = (data: SoilAnalysisForm) => {
    analyzeMutation.mutate(data);
  };

  const getNutrientStatus = (value: number) => {
    if (value < 30) return { color: "text-red-600", status: t("low") };
    if (value < 70) return { color: "text-amber-600", status: t("medium") };
    return { color: "text-green-600", status: t("high") };
  };

  const getPhStatus = (ph: number) => {
    if (ph < 5.5) return { color: "text-red-600", status: "Too Acidic" };
    if (ph < 6.5) return { color: "text-amber-600", status: "Slightly Acidic" };
    if (ph <= 7.5) return { color: "text-green-600", status: "Optimal" };
    if (ph <= 8.5) return { color: "text-amber-600", status: "Slightly Alkaline" };
    return { color: "text-red-600", status: "Too Alkaline" };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 md:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
            {t("soilAnalysisTitle")}
          </h1>
          <p className="text-muted-foreground">
            {t("personalizedAdvice")}
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    s <= step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      s < step ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{t("soilType")}</span>
            <span>{t("nutrientLevels")}</span>
            <span>Results</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card data-testid="card-soil-type">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sprout className="h-5 w-5 text-green-600" />
                        {t("selectSoilType")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="soilType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("soilType")}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-soil-type">
                                  <SelectValue placeholder={t("selectSoilTypePlaceholder")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="clay">Clay</SelectItem>
                                <SelectItem value="sandy">Sandy</SelectItem>
                                <SelectItem value="loamy">Loamy</SelectItem>
                                <SelectItem value="silty">Silty</SelectItem>
                                <SelectItem value="peaty">Peaty</SelectItem>
                                <SelectItem value="chalky">Chalky</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="mt-6 flex justify-end">
                        <Button
                          type="button"
                          onClick={() => setStep(2)}
                          disabled={!form.watch("soilType")}
                          data-testid="button-next-step"
                        >
                          {t("next")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card data-testid="card-nutrient-levels">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-amber-600" />
                        {t("nutrientLevels")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <FormField
                        control={form.control}
                        name="nitrogen"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>{t("nitrogenLevel")}</FormLabel>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{field.value}%</Badge>
                                <Badge
                                  className={getNutrientStatus(field.value).color}
                                  variant="outline"
                                >
                                  {getNutrientStatus(field.value).status}
                                </Badge>
                              </div>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                data-testid="slider-nitrogen"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phosphorus"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>{t("phosphorusLevel")}</FormLabel>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{field.value}%</Badge>
                                <Badge
                                  className={getNutrientStatus(field.value).color}
                                  variant="outline"
                                >
                                  {getNutrientStatus(field.value).status}
                                </Badge>
                              </div>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                data-testid="slider-phosphorus"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="potassium"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>{t("potassiumLevel")}</FormLabel>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{field.value}%</Badge>
                                <Badge
                                  className={getNutrientStatus(field.value).color}
                                  variant="outline"
                                >
                                  {getNutrientStatus(field.value).status}
                                </Badge>
                              </div>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={100}
                                step={1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                data-testid="slider-potassium"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ph"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>{t("phLevel")}</FormLabel>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{field.value.toFixed(1)}</Badge>
                                <Badge
                                  className={getPhStatus(field.value).color}
                                  variant="outline"
                                >
                                  {getPhStatus(field.value).status}
                                </Badge>
                              </div>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={14}
                                step={0.1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                data-testid="slider-ph"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="organicMatter"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between mb-2">
                              <FormLabel>{t("organicMatter")}</FormLabel>
                              <Badge variant="secondary">{field.value.toFixed(1)}%</Badge>
                            </div>
                            <FormControl>
                              <Slider
                                min={0}
                                max={20}
                                step={0.1}
                                value={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                                data-testid="slider-organic-matter"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3 justify-end mt-6 pt-6 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(1)}
                          data-testid="button-previous"
                        >
                          {t("previous")}
                        </Button>
                        <Button
                          type="submit"
                          disabled={analyzeMutation.isPending}
                          data-testid="button-analyze"
                        >
                          {analyzeMutation.isPending ? t("analyzing") : t("getRecommendations")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === 3 && recommendations && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card data-testid="card-recommendations">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        {t("recommendations")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{recommendations}</p>
                      </div>
                      <div className="mt-6 pt-6 border-t flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setStep(1);
                            setRecommendations(null);
                            form.reset();
                          }}
                          data-testid="button-new-analysis"
                        >
                          {t("newAnalysis")}
                        </Button>
                        <Button type="button" data-testid="button-save-recommendations">
                          {t("save")} {t("recommendations")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </div>
  );
}
