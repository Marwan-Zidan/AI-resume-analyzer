import React from 'react';

interface ImprovementItem {
  category: string;
  tip: string;
  explanation: string;
}

interface ImprovementChecklistProps {
  feedback: Feedback;
}

const ImprovementChecklist: React.FC<ImprovementChecklistProps> = ({ feedback }) => {
  const improvementItems: ImprovementItem[] = [];

  // Collect all improvement suggestions
  if (feedback?.toneAndStyle?.tips) {
    feedback.toneAndStyle.tips
      .filter(t => t.type === "improve")
      .forEach(t => {
        improvementItems.push({
          category: "Tone & Style",
          tip: t.tip,
          explanation: t.explanation
        });
      });
  }

  if (feedback?.content?.tips) {
    feedback.content.tips
      .filter(t => t.type === "improve")
      .forEach(t => {
        improvementItems.push({
          category: "Content",
          tip: t.tip,
          explanation: t.explanation
        });
      });
  }

  if (feedback?.structure?.tips) {
    feedback.structure.tips
      .filter(t => t.type === "improve")
      .forEach(t => {
        improvementItems.push({
          category: "Structure",
          tip: t.tip,
          explanation: t.explanation
        });
      });
  }

  if (feedback?.skills?.tips) {
    feedback.skills.tips
      .filter(t => t.type === "improve")
      .forEach(t => {
        improvementItems.push({
          category: "Skills",
          tip: t.tip,
          explanation: t.explanation
        });
      });
  }

  if (improvementItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white w-full rounded-2xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <img src="/icons/warning.svg" alt="improve" className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Resume Improvement Checklist</h2>
      </div>

      <div className="space-y-3">
        {improvementItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
          >
            <input
              type="checkbox"
              className="w-5 h-5 mt-0.5 accent-amber-600 cursor-pointer"
              aria-label={`Task: ${item.tip}`}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                  {item.category}
                </span>
              </div>
              <p className="font-semibold text-amber-900 text-sm">{item.tip}</p>
              <p className="text-xs text-amber-700 mt-2">{item.explanation}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          💡 <strong>Pro Tip:</strong> Focus on the high-priority improvements first. Addressing the "Needs Work" categories will have the biggest impact on your resume score.
        </p>
      </div>
    </div>
  );
};

export default ImprovementChecklist;
