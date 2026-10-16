import { Print } from "@/lib/types";
import PrintCard from "./PrintCard";
import Reveal from "./Reveal";

export default function PrintGrid({ prints }: { prints: Print[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
      {prints.map((p, i) => (
        <Reveal key={p.id} delay={(i % 4) * 80}>
          <PrintCard print={p} />
        </Reveal>
      ))}
    </div>
  );
}
