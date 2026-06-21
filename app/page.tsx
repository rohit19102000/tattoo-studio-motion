import ScrollHero from "./components/ScrollHero";
import ManifestoSection from "./components/ManifestoSection";
import ArtistsSection from "./components/ArtistsSection";
import ProcessSection from "./components/ProcessSection";
import ClosingCTA from "./components/ClosingCTA";

export default function Home() {
  return (
    <main style={{ background: "#0A0A0A" }}>
      <ScrollHero />
      <ManifestoSection />
      <ArtistsSection />
      <ProcessSection />
      <ClosingCTA />
    </main>
  );
}
