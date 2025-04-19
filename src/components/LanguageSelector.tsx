
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SummaryLanguage } from "@/types";

interface LanguageSelectorProps {
  value: SummaryLanguage;  // Changed from 'language' to 'value'
  onChange: (value: SummaryLanguage) => void;  // Changed from 'onLanguageChange' to 'onChange'
  disabled?: boolean;  // Added disabled prop
}

const LanguageSelector = ({ value, onChange, disabled = false }: LanguageSelectorProps) => {
  const languageOptions = [
    { value: "chinese", label: "中文" },
    { value: "english", label: "English" },
    { value: "spanish", label: "Español" },
    { value: "french", label: "Français" }
  ];

  return (
    <Select value={value} onValueChange={(value) => onChange(value as SummaryLanguage)} disabled={disabled}>
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
