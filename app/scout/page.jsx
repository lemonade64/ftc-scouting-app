import OnlineForm from "@/components/OnlineForm";
import OfflineForm from "@/components/OfflineForm";
import ImportData from "@/components/ImportData";
import TeamAnalysis from "@/components/TeamAnalysis";
import TeamComparison from "@/components/TeamComparison";

export default function Scout() {
  return (
    <>
      <OnlineForm />
      <OfflineForm />
      <ImportData />
      <TeamAnalysis />
      <TeamComparison />
    </>
  );
}
