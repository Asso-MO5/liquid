import { Title } from "@solidjs/meta";
import { LayoutView } from "~/features/layout/layout.view";

export default function Home() {
  return (
    <LayoutView>
      <Title>Musée MO5</Title>
      <h1>Musée MO5</h1>
      <p>Réservation de visites, événements et accès membres.</p>
    </LayoutView>
  );
}
