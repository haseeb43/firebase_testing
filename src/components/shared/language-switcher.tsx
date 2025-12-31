
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { languages } from "@/lib/i18n";
import { useI18n } from "@/hooks/use-i18n";
import { ChevronDown } from "lucide-react";
import type { Language } from "@/lib/types";

export default function LanguageSwitcher({ isCollapsed = false, inHeader = false }: { isCollapsed?: boolean, inHeader?: boolean }) {
  const { language, setLanguage } = useI18n();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };
  
  const currentLanguage = languages[language];

  if (isCollapsed) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={inHeader ? "ghost" : "outline"} size="icon" className="text-foreground hover:bg-accent hover:text-accent-foreground text-lg">
                    <span>{currentLanguage.flag}</span>
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
                    {Object.entries(languages).map(([key, lang]) => (
                        <DropdownMenuRadioItem key={key} value={key} className="gap-2">
                           <span className="text-lg">{lang.flag}</span>
                           <span>{lang.name}</span>
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={inHeader ? "ghost" : "outline"} className={`justify-between ${inHeader ? 'text-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="hidden group-data-[collapsible=expanded]:inline">{currentLanguage.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 hidden group-data-[collapsible=expanded]:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuRadioGroup value={language} onValueChange={handleLanguageChange}>
          {Object.entries(languages).map(([key, lang]) => (
            <DropdownMenuRadioItem key={key} value={key} className="gap-2">
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
