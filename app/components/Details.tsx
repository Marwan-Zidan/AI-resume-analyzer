import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordion";

const ScoreBadge = ({ score }: { score: number }) => {
  return (
      <div
          className={cn(
              "flex flex-row gap-1 items-center px-2 py-0.5 rounded-[96px]",
              score > 69
                  ? "bg-badge-green"
                  : score > 39
                      ? "bg-badge-yellow"
                      : "bg-badge-red"
          )}
      >
        <img
            src={score > 69 ? "/icons/check.svg" : "/icons/warning.svg"}
            alt="score"
            className="size-4"
        />
        <p
            className={cn(
                "text-sm font-medium",
                score > 69
                    ? "text-badge-green-text"
                    : score > 39
                        ? "text-badge-yellow-text"
                        : "text-badge-red-text"
            )}
        >
          {score}/100
        </p>
      </div>
  );
};

const CategoryHeader = ({
                          title,
                          categoryScore,
                        }: {
  title: string;
  categoryScore: number;
}) => {
  return (
      <div className="flex flex-row gap-4 items-center py-2">
        <p className="text-2xl font-semibold">{title}</p>
        <ScoreBadge score={categoryScore} />
      </div>
  );
};

const CategoryContent = ({
                           tips,
                         }: {
  tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
  const goodTips = tips?.filter(t => t.type === "good") || [];
  const improveTips = tips?.filter(t => t.type === "improve") || [];

  return (
      <div className="flex flex-col gap-6 w-full">
        {/* Quick Tips Overview */}
        <div className="bg-gray-50 w-full rounded-lg px-5 py-4">
          <p className="text-sm font-semibold text-gray-600 mb-3">Quick Overview</p>
          <div className="grid grid-cols-2 gap-4">
            {tips?.map((tip, index) => (
              <div className="flex flex-row gap-2 items-start" key={index}>
                <img
                    src={tip.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                    alt="score"
                    className="size-5 mt-0.5 flex-shrink-0"
                />
                <p className="text-sm text-gray-700">{tip.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Tips */}
        <div className="flex flex-col gap-4 w-full">
          {goodTips.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                <img src="/icons/check.svg" alt="good" className="size-5" />
                What's Working Well
              </h4>
              <div className="space-y-3">
                {goodTips.map((tip, index) => (
                  <div
                      key={index}
                      className="flex flex-col gap-2 rounded-xl p-4 bg-green-50 border border-green-200"
                  >
                    <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                      <img src="/icons/check.svg" alt="check" className="size-4" />
                      {tip.tip}
                    </p>
                    <p className="text-sm text-green-600">{tip.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {improveTips.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                <img src="/icons/warning.svg" alt="improve" className="size-5" />
                Areas for Improvement
              </h4>
              <div className="space-y-3">
                {improveTips.map((tip, index) => (
                  <div
                      key={index}
                      className="flex flex-col gap-2 rounded-xl p-4 bg-yellow-50 border border-yellow-200"
                  >
                    <p className="text-sm font-semibold text-yellow-700 flex items-center gap-2">
                      <img src="/icons/warning.svg" alt="warning" className="size-4" />
                      {tip.tip}
                    </p>
                    <p className="text-sm text-yellow-600">{tip.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

const Details = ({ feedback }: { feedback: Feedback }) => {
  return (
      <div className="flex flex-col gap-4 w-full">
        <Accordion>
          <AccordionItem id="tone-style">
            <AccordionHeader itemId="tone-style">
              <CategoryHeader
                  title="Tone & Style"
                  categoryScore={feedback?.toneAndStyle?.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="tone-style">
              <CategoryContent tips={feedback?.toneAndStyle?.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="content">
            <AccordionHeader itemId="content">
              <CategoryHeader
                  title="Content"
                  categoryScore={feedback?.content?.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="content">
              <CategoryContent tips={feedback?.content?.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="structure">
            <AccordionHeader itemId="structure">
              <CategoryHeader
                  title="Structure"
                  categoryScore={feedback?.structure?.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="structure">
              <CategoryContent tips={feedback?.structure?.tips} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem id="skills">
            <AccordionHeader itemId="skills">
              <CategoryHeader
                  title="Skills"
                  categoryScore={feedback?.skills?.score}
              />
            </AccordionHeader>
            <AccordionContent itemId="skills">
              <CategoryContent tips={feedback?.skills?.tips} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
  );
};

export default Details;