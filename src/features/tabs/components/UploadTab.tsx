
import { TabsContent } from "@/components/ui/tabs";
import FileUpload from "@/components/FileUpload";

interface UploadTabProps {
  isLoading: boolean;
  handleContentLoaded: (
    content: string,
    generateQuiz: boolean,
    courseId: string
  ) => void;
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
}

const UploadTab = ({
  isLoading,
  handleContentLoaded,
  selectedCourseId,
  onSelectCourse
}: UploadTabProps) => {
  return (
    <TabsContent value="upload" className="mt-4">
      <div className="flex justify-center">
        <FileUpload 
          onContentLoaded={handleContentLoaded} 
          isLoading={isLoading}
          selectedCourseId={selectedCourseId}
          onSelectCourse={onSelectCourse}
          generateAllContent={true}
        />
      </div>
    </TabsContent>
  );
};

export default UploadTab;
