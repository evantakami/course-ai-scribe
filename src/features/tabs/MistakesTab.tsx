
import { TabsContent } from "@/components/ui/tabs";
import MistakeCollection from "@/features/mistakes/MistakeCollection";

const MistakesTab = () => {
  return (
    <TabsContent value="mistakes" className="mt-2">
      <MistakeCollection />
    </TabsContent>
  );
};

export default MistakesTab;
