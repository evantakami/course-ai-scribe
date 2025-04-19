
import { Course } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MistakeFiltersProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  selectedCourseId: string | null;
  onCourseChange: (value: string) => void;
  courses: Course[];
}

const MistakeFilters = ({
  selectedTab,
  onTabChange,
  selectedCourseId,
  onCourseChange,
  courses,
}: MistakeFiltersProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Tabs 
        defaultValue="all" 
        value={selectedTab} 
        onValueChange={onTabChange}
        className="w-[200px]"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="recent">最近一周</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Select 
        value={selectedCourseId || "all"} 
        onValueChange={onCourseChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="筛选课程" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">全部课程</SelectItem>
          {courses.map(course => (
            <SelectItem key={course.id} value={course.id} className="flex items-center">
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MistakeFilters;
