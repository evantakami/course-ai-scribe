
import { useState, useEffect } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Book,
  BookOpen, 
  Plus,
  Upload,
  Check,
  ChevronDown
} from "lucide-react";
import { Course } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CourseSelectorProps {
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const DEFAULT_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-teal-500",
];

const CourseSelector = ({ selectedCourseId, onSelectCourse }: CourseSelectorProps) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLORS[0]);
  const [courseIcon, setCourseIcon] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    try {
      const userProfileString = localStorage.getItem('user_profile');
      if (userProfileString) {
        const userProfile = JSON.parse(userProfileString);
        if (userProfile.courses && Array.isArray(userProfile.courses)) {
          setCourses(userProfile.courses);
          
          // If no course is selected yet, select the first one
          if (!selectedCourseId && userProfile.courses.length > 0) {
            onSelectCourse(userProfile.courses[0].id);
          }
        }
      } else {
        // Initialize with default course if no courses exist
        const defaultCourse = createDefaultCourse();
        saveCourse(defaultCourse);
        setCourses([defaultCourse]);
        onSelectCourse(defaultCourse.id);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
      // Create a default course on error
      const defaultCourse = createDefaultCourse();
      setCourses([defaultCourse]);
      onSelectCourse(defaultCourse.id);
    }
  };

  const createDefaultCourse = (): Course => {
    return {
      id: uuidv4(),
      name: "通用课程",
      color: DEFAULT_COLORS[0],
      timestamp: new Date()
    };
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 500000) { // 500KB limit
        toast.error("图标文件过大，请选择小于500KB的图片");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCourseIcon(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCourse = (course: Course) => {
    try {
      const userProfileString = localStorage.getItem('user_profile') || '{"courses":[],"quizStats":{"totalQuizzes":0,"correctAnswers":0,"totalQuestions":0}}';
      const userProfile = JSON.parse(userProfileString);
      
      // Ensure courses array exists
      if (!userProfile.courses) {
        userProfile.courses = [];
      }
      
      // Add or update course
      const existingIndex = userProfile.courses.findIndex((c: Course) => c.id === course.id);
      if (existingIndex >= 0) {
        userProfile.courses[existingIndex] = course;
      } else {
        userProfile.courses.push(course);
      }
      
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      setCourses(userProfile.courses);
      return true;
    } catch (error) {
      console.error("Failed to save course:", error);
      toast.error("保存课程失败");
      return false;
    }
  };

  const handleCreateCourse = () => {
    if (!newCourseName.trim()) {
      toast.error("请输入课程名称");
      return;
    }

    const newCourse: Course = {
      id: uuidv4(),
      name: newCourseName,
      description: newCourseDescription,
      color: selectedColor,
      icon: courseIcon || undefined,
      timestamp: new Date()
    };

    if (saveCourse(newCourse)) {
      onSelectCourse(newCourse.id);
      toast.success("课程创建成功");
      setIsDialogOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewCourseName("");
    setNewCourseDescription("");
    setSelectedColor(DEFAULT_COLORS[0]);
    setCourseIcon(null);
  };

  const selectedCourse = courses.find(course => course.id === selectedCourseId) || courses[0];

  return (
    <div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center justify-between w-full gap-2 px-3"
          >
            {selectedCourse ? (
              <>
                {selectedCourse.icon ? (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedCourse.icon} alt={selectedCourse.name} />
                    <AvatarFallback className={`${selectedCourse.color} text-white`}>
                      {selectedCourse.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${selectedCourse.color} text-white text-xs`}>
                    {selectedCourse.name.substring(0, 2)}
                  </div>
                )}
                <span className="flex-1 text-left truncate">{selectedCourse.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">选择课程</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-2">
          <ScrollArea className="h-[200px]">
            <div className="space-y-1">
              {courses.map((course) => (
                <Button
                  key={course.id}
                  variant={course.id === selectedCourseId ? "secondary" : "ghost"}
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    onSelectCourse(course.id);
                    setIsOpen(false);
                  }}
                >
                  {course.icon ? (
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={course.icon} alt={course.name} />
                      <AvatarFallback className={`${course.color} text-white`}>
                        {course.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${course.color} text-white text-xs`}>
                      {course.name.substring(0, 2)}
                    </div>
                  )}
                  <span className="truncate">{course.name}</span>
                  {course.id === selectedCourseId && <Check className="h-4 w-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </ScrollArea>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full mt-2 gap-2"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="h-4 w-4" /> 新建课程
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>创建新课程</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">课程名称</Label>
                  <Input
                    id="name"
                    placeholder="例如：算法与数据结构"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">课程描述（可选）</Label>
                  <Input
                    id="description"
                    placeholder="简要描述课程内容"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>课程颜色</Label>
                  <div className="flex flex-wrap gap-2">
                    {DEFAULT_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full ${color} ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label>课程图标（可选）</Label>
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${selectedColor} text-white`}>
                      {courseIcon ? (
                        <img 
                          src={courseIcon} 
                          alt="Course Icon" 
                          className="h-full w-full rounded-full object-cover" 
                        />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </div>
                    <Label 
                      htmlFor="icon-upload" 
                      className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center gap-2 text-sm"
                    >
                      <Upload className="h-4 w-4" /> 上传图标
                    </Label>
                    <input
                      id="icon-upload"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                      className="hidden"
                      onChange={handleIconUpload}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                <Button onClick={handleCreateCourse}>创建课程</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CourseSelector;
