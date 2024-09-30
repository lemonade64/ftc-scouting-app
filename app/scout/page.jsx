import OnlineForm from "@/components/OnlineForm";
import OfflineForm from "@/components/OfflineForm";
import DataImporter from "@/components/DataImporter";
import TeamAnalysis from "@/components/TeamAnalysis";
import TeamComparison from "@/components/TeamComparison";

export default function Scout() {
  return (
    <>
      <OnlineForm />
      <OfflineForm />
      <DataImporter />
      <TeamAnalysis />
      <TeamComparison />
    </>
  );
}
