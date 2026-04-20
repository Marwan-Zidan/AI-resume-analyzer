import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";
import { getFeedbackSections } from "~/lib/feedback";
import { cn } from "~/lib/utils";

const Category = ({ title, score }: { title: string, score: number }) => {
    const textColor = score > 70 ? 'text-green-600'
            : score > 49
        ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="score-list-row border-b border-slate-100 last:border-b-0">
            <div className="score-list-label">
                <span className="truncate">{title}</span>
                <ScoreBadge score={score} />
            </div>
            <p className={cn("score-list-value", textColor)}>
                {score}/100
            </p>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    const sections = getFeedbackSections(feedback);

    return (
        <div className="score-card">
            <div className="score-card-header">
                <ScoreGauge score={feedback?.overallScore ?? 0} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-slate-900">Your Resume Score</h2>
                    <p className="max-w-[420px] text-sm text-slate-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <div>
              {sections.map((section) => (
                  <Category key={section.id} title={section.title} score={section.score} />
              ))}
            </div>
        </div>
    )
}
export default Summary