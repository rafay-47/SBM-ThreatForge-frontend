import { ThreatCatalogCardsComponent } from "../../components/ThreatModeling/ThreatCatalogCards.jsx";

const ThreatCatalog = ({ user }) => {
  return (
    <main className="workstation-page threat-catalog-page">
      <ThreatCatalogCardsComponent user={user} />
    </main>
  );
};

export default ThreatCatalog;
