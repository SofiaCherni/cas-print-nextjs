import { Print } from "@/lib/types";
import PrintCard from "./PrintCard";

export default function PrintGrid({
  prints,
  tone = "default"
}: {
  prints: Print[];
  tone?: "default" | "accent";
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
      {prints.map((p) => (
        <PrintCard key={p.id} print={p} tone={tone} />
      ))}
    </div>
  );
}
