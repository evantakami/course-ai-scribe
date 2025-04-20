
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Course } from "@/types";

interface CourseIconProps {
  course: Course;
  size?: "sm" | "md" | "lg" | "xl";
}

const CourseIcon = ({ course, size = "md" }: CourseIconProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  };

  const fallbackText = course.name.substring(0, 2);

  return (
    <Avatar className={sizeClasses[size]}>
      {course.icon ? (
        <AvatarImage src={course.icon} alt={course.name} />
      ) : null}
      <AvatarFallback className={`${course.color} text-white`}>
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};

export default CourseIcon;
