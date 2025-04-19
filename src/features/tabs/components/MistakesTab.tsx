
import { TabsContent } from "@/components/ui/tabs";
import MistakeCollection from "@/components/MistakeCollection";
import { useQuiz } from "@/hooks/useQuiz";

const MistakesTab = () => {
  return (
    <TabsContent value="mistakes" className="mt-4">
      <MistakeCollection />
    </TabsContent>
  );
};

export default MistakesTab;
