
import { TabsContent } from "@/components/ui/tabs";
import MistakeCollection from "@/components/MistakeCollection";

const MistakesTab = () => {
  return (
    <TabsContent value="mistakes" className="mt-4">
      <MistakeCollection />
    </TabsContent>
  );
};

export default MistakesTab;
