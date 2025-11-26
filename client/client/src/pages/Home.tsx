import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Cloud,
  Sprout,
  MessageCircle,
  Droplets,
  FlaskConical,
  Bug,
  ArrowRight,
  Users,
  TrendingUp,
} from "lucide-react";
import heroImage from "@assets/generated_images/golden_wheat_fields_hero.png";

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Cloud,
      title: t("weatherTitle"),
      description: t("weatherDesc"),
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Sprout,
      title: t("cropGuidanceTitle"),
      description: t("cropGuidanceDesc"),
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: MessageCircle,
      title: t("aiChatTitle"),
      description: t("aiChatDesc"),
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Droplets,
      title: t("resourceTitle"),
      description: t("resourceDesc"),
      color: "text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: FlaskConical,
      title: t("soilTitle"),
      description: t("soilDesc"),
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Bug,
      title: t("pestTitle"),
      description: t("pestDesc"),
      color: "text-red-600 dark:text-red-400",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="min-h-screen">
      <section
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-white/20 backdrop-blur-md text-white border-white/30"
              data-testid="badge-trust"
            >
              <Users className="h-4 w-4 mr-2" />
              {t("servingFarmers")}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              {t("heroTitle")}
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="min-h-12 text-base"
                  data-testid="button-get-started"
                >
                  {t("getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="min-h-12 text-base bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20"
                data-testid="button-learn-more"
              >
                {t("learnMore")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4">
              {t("featuresTitle")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("tagline")}
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover-elevate active-elevate-2" data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                    <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">{t("servingFarmers")}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
                <TrendingUp className="h-10 w-10" />
                35%
              </div>
              <div className="text-muted-foreground">Average Yield Increase</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support Available</div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-6">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already benefiting from AI-powered agricultural guidance
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="min-h-12 text-base" data-testid="button-cta-bottom">
              {t("getStarted")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
