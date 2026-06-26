import { ThreatModel } from "../../components/ThreatModeling/ThreatModel.jsx";

const ThreatModelResult = ({ user }) => {
  return (
    <main className="workstation-page threat-model-result-page">
      <ThreatModel user={user} />
    </main>
  );
};

export default ThreatModelResult;
