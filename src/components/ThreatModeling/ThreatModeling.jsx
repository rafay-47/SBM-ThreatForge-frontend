import { useEffect, useState } from "react";
import { SubmissionComponent } from "./SubmissionForm";
import { Modal } from "@cloudscape-design/components";
import { uploadFile } from "./docs";
import { useNavigate } from "react-router-dom";
import { startThreatModeling } from "../../services/ThreatDesigner/stats";
import HomeDashboard from "./HomeDashboard";
import "./ThreatModeling.css";

export default function ThreatModeling({ user }) {
  const [iteration, setIteration] = useState({ label: "Auto", value: 0 });
  const [reasoning, setReasoning] = useState("0");
  const [base64Content, setBase64Content] = useState([]);
  const [id, setId] = useState(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBase64Change = (base64) => {
    setBase64Content(base64);
  };

  const handleStartThreatModeling = async (
    title,
    description,
    assumptions,
    applicationType,
    spaceId = null
  ) => {
    setLoading(true);
    try {
      const uploadResult = await uploadFile(base64Content?.value, null, base64Content?.type);
      const s3Key = uploadResult?.name;
      const response = await startThreatModeling(
        s3Key,
        iteration?.value,
        reasoning,
        title,
        description,
        assumptions,
        false,
        null,
        null,
        base64Content?.type,
        applicationType,
        spaceId
      );
      setLoading(false);
      setId(response.data.id);
    } catch (error) {
      console.error("Error starting threat modeling:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      navigate(`/${id}`);
    }
  }, [id, navigate]);

  return (
    <>
      <HomeDashboard user={user} onCreateNew={() => setVisible(true)} />
      <Modal
        onDismiss={() => setVisible(false)}
        visible={visible}
        size="large"
        header={"Threat model"}
      >
        <SubmissionComponent
          onBase64Change={handleBase64Change}
          base64Content={base64Content}
          iteration={iteration}
          setIteration={setIteration}
          setVisible={setVisible}
          handleStart={handleStartThreatModeling}
          loading={loading}
          reasoning={reasoning}
          setReasoning={setReasoning}
        />
      </Modal>
    </>
  );
}
