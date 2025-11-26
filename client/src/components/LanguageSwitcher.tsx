import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      data-testid="button-language-toggle"
      className="gap-2"
    >
      <Globe className="h-5 w-5" />
      <span className="text-sm font-medium">{language === "en" ? "हि" : "En"}</span>
    </Button>
  );
}
