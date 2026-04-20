import { cn } from "~/lib/utils";

interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        score > 70
          ? "bg-badge-green text-badge-green-text"
          : score > 49
            ? "bg-badge-yellow text-badge-yellow-text"
            : "bg-badge-red text-badge-red-text"
      )}
    >
      {score > 70 ? "Strong" : score > 49 ? "Good Start" : "Needs Work"}
    </div>
  );
};

export default ScoreBadge;