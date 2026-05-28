import { Globe } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, useI18n } from "@/lib/i18n";

export function LanguagePicker() {
  const { lang, setLang } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface-raised px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Choose language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => {
              setLang(l.code);
              toast.info(`Language: ${l.label}`);
            }}
            className="cursor-pointer gap-2"
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
