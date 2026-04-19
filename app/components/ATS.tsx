import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Determine background gradient based on score
  const gradientClass = score > 69
    ? 'from-green-100'
    : score > 49
      ? 'from-yellow-100'
      : 'from-red-100';

  // Determine icon based on score
  const iconSrc = score > 69
    ? '/icons/ats-good.svg'
    : score > 49
      ? '/icons/ats-warning.svg'
      : '/icons/ats-bad.svg';

  // Determine subtitle based on score
  const subtitle = score > 69
    ? 'Great Job!'
    : score > 49
      ? 'Good Start'
      : 'Needs Improvement';

  const goodSuggestions = suggestions.filter(s => s.type === "good");
  const improveSuggestions = suggestions.filter(s => s.type === "improve");

  return (
    <div className={`bg-gradient-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
      {/* Top section with icon and headline */}
      <div className="flex items-center gap-4 mb-6">
        <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
        </div>
      </div>

      {/* Description section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{subtitle}</h3>
        <p className="text-gray-600 mb-6">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        {/* Good Suggestions */}
        {goodSuggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
              <img src="/icons/check.svg" alt="good" className="size-5" />
              Strengths
            </h4>
            <div className="space-y-2">
              {goodSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <img
                    src="/icons/check.svg"
                    alt="Check"
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-green-700">{suggestion.tip}</p>
                    {suggestion.explanation && (
                      <p className="text-xs text-green-600 mt-1">{suggestion.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improve Suggestions */}
        {improveSuggestions.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-amber-700 mb-3 flex items-center gap-2">
              <img src="/icons/warning.svg" alt="improve" className="size-5" />
              Areas to Improve
            </h4>
            <div className="space-y-2">
              {improveSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <img
                    src="/icons/warning.svg"
                    alt="Warning"
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-amber-700">{suggestion.tip}</p>
                    {suggestion.explanation && (
                      <p className="text-xs text-amber-600 mt-1">{suggestion.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Closing encouragement */}
      <p className="text-gray-700 italic text-sm">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>
    </div>
  )
}

export default ATS