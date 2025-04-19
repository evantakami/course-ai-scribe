
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SummaryLanguage } from "@/types";

interface LanguageSelectorProps {
  language: SummaryLanguage;
  onLanguageChange: (value: SummaryLanguage) => void;
}

const LanguageSelector = ({ language, onLanguageChange }: LanguageSelectorProps) => {
  const languageOptions = [
    { value: "chinese", label: "中文" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" }
  ];

  return (
    <Select value={language} onValueChange={(value) => onLanguageChange(value as SummaryLanguage)}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="选择语言" />
      </SelectTrigger>
      <SelectContent>
        {languageOptions.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
