import React from 'react'
import { cn } from '~/lib/utils';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine colors - using soft/pink tones for all
  const bgClass = 'bg-rose-50';
  const borderClass = 'border border-rose-200';
  const badgeClass = 'bg-rose-100';
  const iconBgClass = 'bg-rose-200';
  const textClass = 'text-rose-900';
  const subtitleClass = 'text-rose-700';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/check.svg'
    : score > 49
      ? '/icons/warning.svg'
      : '/icons/warning.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  return (
    <div className={cn('rounded-[24px] w-full p-6', bgClass, borderClass)}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <div className={cn('rounded-full p-3 flex items-center justify-center', iconBgClass)}>
          <img src={iconSrc} alt="ATS Score Icon" className="w-6 h-6" />
        </div>
        <div>
          <h2 className={cn('text-2xl font-bold', textClass)}>ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className={cn('text-lg font-semibold mb-3', subtitleClass)}>{subtitle}</h3>
        <p className="text-gray-600 mb-4 text-sm">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        {/* Suggestions grid */}
        <div className="grid grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 rounded-xl p-3',
                suggestion.type === 'good'
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'bg-amber-50 border border-amber-200'
              )}
            >
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <p className={cn('text-xs', suggestion.type === "good" ? "text-emerald-700" : "text-amber-700")}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ATS