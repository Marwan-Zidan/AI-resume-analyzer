const toNumber = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
};

const toScore = (value: unknown): number => {
    const numeric = toNumber(value);

    if (numeric === undefined) return 0;

    // Support scores reported on a 0-10 scale as well as 0-100.
    return numeric <= 10 ? Math.round(numeric * 10) : Math.round(numeric);
};

type FeedbackTip = {
    type: "good" | "improve";
    tip: string;
    explanation: string;
};

type ATSFeedbackTip = {
    type: "good" | "improve";
    tip: string;
};

const extractTipText = (item: unknown): string => {
    if (typeof item === "string") return item.trim();

    if (item && typeof item === "object") {
        const record = item as Record<string, unknown>;
        const candidate =
            record.tip ??
            record.title ??
            record.text ??
            record.explanation ??
            record.label;

        if (typeof candidate === "string") return candidate.trim();
    }

    return "";
};

const toTipList = (
    items: unknown,
    type: "good" | "improve"
): FeedbackTip[] => {
    if (!Array.isArray(items)) return [];

    return items
        .map(extractTipText)
        .filter(Boolean)
        .map((tip) => ({
            type,
            tip,
            explanation: tip,
        }));
};

const mergeTips = (
    positive: unknown,
    negative: unknown,
    positiveLimit = 3,
    negativeLimit = 3,
    fallbackTitle = "Resume section",
    fallbackScore = 0
): FeedbackTip[] => {
    const merged: FeedbackTip[] = [
        ...toTipList(positive, "good").slice(0, positiveLimit),
        ...toTipList(negative, "improve").slice(0, negativeLimit),
    ];

    if (merged.length > 0) return merged;

    const isStrong = fallbackScore >= 70;

    return [
        {
            type: isStrong ? "good" : "improve",
            tip: `${fallbackTitle} score: ${fallbackScore}/100`,
            explanation: isStrong
                ? `The AI marked this area as relatively strong, but it did not return more detailed bullets for ${fallbackTitle.toLowerCase()}.`
                : `The AI did not return detailed bullets for ${fallbackTitle.toLowerCase()}, so this section should be reviewed and expanded with more specific resume evidence.`,
        },
    ];
};

const emptyFeedback = (): Feedback => ({
    overallScore: 0,
    ATS: {
        score: 0,
        tips: [],
    },
    toneAndStyle: {
        score: 0,
        tips: [],
    },
    content: {
        score: 0,
        tips: [],
    },
    structure: {
        score: 0,
        tips: [],
    },
    skills: {
        score: 0,
        tips: [],
    },
});

export type FeedbackSection = {
    id: keyof Pick<Feedback, "toneAndStyle" | "content" | "structure" | "skills">;
    title: string;
    score: number;
    tips: FeedbackTip[];
};

export const getFeedbackSections = (feedback: Feedback): FeedbackSection[] => [
    {
        id: "toneAndStyle",
        title: "Tone & Style",
        score: feedback?.toneAndStyle?.score ?? 0,
        tips: feedback?.toneAndStyle?.tips ?? [],
    },
    {
        id: "content",
        title: "Content",
        score: feedback?.content?.score ?? 0,
        tips: feedback?.content?.tips ?? [],
    },
    {
        id: "structure",
        title: "Structure",
        score: feedback?.structure?.score ?? 0,
        tips: feedback?.structure?.tips ?? [],
    },
    {
        id: "skills",
        title: "Skills",
        score: feedback?.skills?.score ?? 0,
        tips: feedback?.skills?.tips ?? [],
    },
];

export function normalizeFeedback(input: unknown): Feedback {
    const raw = (input ?? {}) as Record<string, unknown> & {
        ATS?: { score?: unknown; tips?: unknown };
        toneAndStyle?: { score?: unknown; tips?: unknown };
        content?: { score?: unknown; tips?: unknown };
        structure?: { score?: unknown; tips?: unknown };
        skills?: { score?: unknown; tips?: unknown };
        overallScore?: unknown;
        overall_rating?: unknown;
        ats_compatibility?: { rating?: unknown; feedback?: unknown };
        detailed_feedback?: Record<string, { rating?: unknown; feedback?: unknown; issues?: unknown }>;
        formatting_and_presentation?: unknown;
        technical_skills_match?: unknown;
        project_alignment?: unknown;
        experience_relevance?: unknown;
        strengths?: unknown;
        weaknesses?: unknown;
        missing_keywords?: unknown;
        recommendations?: unknown;
        specific_improvements?: unknown;
        improvement_suggestions?: unknown;
        missing_elements?: unknown;
    };

    const legacyLike =
        raw.overallScore !== undefined ||
        raw.ATS !== undefined ||
        raw.toneAndStyle !== undefined ||
        raw.content !== undefined ||
        raw.structure !== undefined ||
        raw.skills !== undefined;

    if (legacyLike) {
        const overallScore = toScore(raw.overallScore);
        const atsScore = toScore(raw.ATS?.score);
        const toneScore = toScore(raw.toneAndStyle?.score);
        const contentScore = toScore(raw.content?.score);
        const structureScore = toScore(raw.structure?.score);
        const skillsScore = toScore(raw.skills?.score);

        return {
            ...emptyFeedback(),
            overallScore,
            ATS: {
                score: atsScore,
                tips: mergeTips(raw.ATS?.tips, [], 3, 0, "ATS", atsScore).map(
                    ({ type, tip }): ATSFeedbackTip => ({ type, tip })
                ),
            },
            toneAndStyle: {
                score: toneScore,
                tips: mergeTips(raw.toneAndStyle?.tips, [], 3, 0, "Tone & Style", toneScore),
            },
            content: {
                score: contentScore,
                tips: mergeTips(raw.content?.tips, [], 3, 0, "Content", contentScore),
            },
            structure: {
                score: structureScore,
                tips: mergeTips(raw.structure?.tips, [], 3, 0, "Structure", structureScore),
            },
            skills: {
                score: skillsScore,
                tips: mergeTips(raw.skills?.tips, [], 3, 0, "Skills", skillsScore),
            },
        };
    }

    // New schema with ats_compatibility and detailed_feedback
    const hasDetailedFeedback = raw.detailed_feedback && Object.keys(raw.detailed_feedback).length > 0;
    const hasAtsCompat = raw.ats_compatibility && typeof raw.ats_compatibility === "object";
    const newSchema = hasDetailedFeedback || hasAtsCompat;
    
    if (newSchema) {
        const overallScore = toScore(raw.overall_rating);
        
        // Safely extract ATS score - ensure we get the rating value
        let atsScore = 0;
        if (raw.ats_compatibility && typeof raw.ats_compatibility === "object") {
            const atsRating = (raw.ats_compatibility as Record<string, any>).rating;
            atsScore = toScore(atsRating);
        }
        
        // Map detailed_feedback fields to our categories
        const detailedFeedback = (raw.detailed_feedback ?? {}) as Record<string, any>;
        
        // Build strengths as positive tips
        const strengthsList = Array.isArray(raw.strengths) 
            ? (raw.strengths as string[]).slice(0, 3)
            : [];
        
        // Build improvements from weaknesses and suggestions
        const improvementsList = [
            ...(Array.isArray(raw.weaknesses) ? (raw.weaknesses as string[]).slice(0, 3) : []),
            ...(Array.isArray(raw.improvement_suggestions) ? (raw.improvement_suggestions as string[]).slice(0, 3) : []),
        ];
        
        // Extract scores from detailed_feedback with proper fallbacks and explicit access
        const formattingRating = (detailedFeedback.formatting as Record<string, any>)?.rating;
        const technicalRating = (detailedFeedback.technical_skills as Record<string, any>)?.rating;
        const experienceRating = (detailedFeedback.experience as Record<string, any>)?.rating;
        const projectsRating = (detailedFeedback.projects as Record<string, any>)?.rating;
        const contactRating = (detailedFeedback.contact_information as Record<string, any>)?.rating;
        const educationRating = (detailedFeedback.education as Record<string, any>)?.rating;
        const achievementsRating = (detailedFeedback.achievements as Record<string, any>)?.rating;
        
        const formattingScore = toScore(formattingRating ?? 0);
        const technicalSkillsScore = toScore(technicalRating ?? 0);
        const experienceScore = toScore(experienceRating ?? 0);
        const projectsScore = toScore(projectsRating ?? 0);
        const contactScore = toScore(contactRating ?? 0);
        const educationScore = toScore(educationRating ?? 0);
        const achievementsScore = toScore(achievementsRating ?? 0);
        
        // Extract issues/feedback from detailed_feedback sections
        const formattingIssues = Array.isArray(detailedFeedback.formatting?.issues) ? detailedFeedback.formatting.issues : [];
        const technicalIssues = Array.isArray(detailedFeedback.technical_skills?.issues) ? detailedFeedback.technical_skills.issues : [];
        const experienceIssues = Array.isArray(detailedFeedback.experience?.issues) ? detailedFeedback.experience.issues : [];
        const projectIssues = Array.isArray(detailedFeedback.projects?.issues) ? detailedFeedback.projects.issues : [];
        const contactIssues = Array.isArray(detailedFeedback.contact_information?.issues) ? detailedFeedback.contact_information.issues : [];

        return {
            overallScore,
            ATS: {
                score: atsScore > 0 ? atsScore : Math.round((technicalSkillsScore + formattingScore) / 2),
                tips: [
                    ...strengthsList.slice(0, 3).map((tip): ATSFeedbackTip => ({
                        type: "good",
                        tip,
                    })),
                    ...(typeof raw.ats_compatibility?.feedback === "string"
                        ? [{ type: "improve" as const, tip: raw.ats_compatibility.feedback }]
                        : []),
                ].slice(0, 5),
            },
            toneAndStyle: {
                score: Math.round((contactScore + educationScore) / 2),
                tips: mergeTips(
                    strengthsList.slice(0, 2),
                    [...contactIssues, ...formattingIssues, ...improvementsList].slice(0, 3),
                    2,
                    3,
                    "Tone & Style",
                    Math.round((contactScore + educationScore) / 2)
                ),
            },
            content: {
                score: Math.round((experienceScore + projectsScore) / 2),
                tips: mergeTips(
                    strengthsList.slice(0, 3),
                    [...experienceIssues, ...projectIssues, ...improvementsList].slice(0, 4),
                    2,
                    4,
                    "Content",
                    Math.round((experienceScore + projectsScore) / 2)
                ),
            },
            structure: {
                score: formattingScore > 0 ? formattingScore : Math.round((educationScore + achievementsScore) / 2),
                tips: mergeTips(
                    [typeof detailedFeedback.formatting?.feedback === "string" ? detailedFeedback.formatting.feedback : ""].filter(Boolean),
                    [...formattingIssues, ...improvementsList].slice(0, 4),
                    1,
                    4,
                    "Structure",
                    formattingScore > 0 ? formattingScore : Math.round((educationScore + achievementsScore) / 2)
                ),
            },
            skills: {
                score: technicalSkillsScore,
                tips: mergeTips(
                    [achievementsScore > 70 ? "Excellent technical achievements" : "", ...strengthsList.slice(0, 2)].filter(Boolean),
                    [...technicalIssues, ...(Array.isArray(raw.missing_elements) ? raw.missing_elements as string[] : [])].slice(0, 4),
                    2,
                    4,
                    "Skills",
                    technicalSkillsScore
                ),
            },
        };
    }

    const overallScore = toScore(raw.overallScore ?? raw.overall_rating);
    const atsScore = toScore(raw.ATS?.score ?? raw.technical_skills_match);
    const toneScore = toScore(raw.formatting_and_presentation);
    const contentScore = toScore(raw.technical_skills_match);
    const structureScore = toScore(raw.project_alignment);
    const skillsScore = toScore(raw.experience_relevance);

    return {
        ...emptyFeedback(),
        overallScore,
        ATS: {
            score: atsScore,
            tips: mergeTips(raw.strengths, raw.missing_keywords, 2, 4, "ATS", atsScore).map(
                ({ type, tip }): ATSFeedbackTip => ({ type, tip })
            ),
        },
        toneAndStyle: {
            score: toneScore,
            tips: mergeTips(
                raw.recommendations,
                raw.specific_improvements,
                2,
                4,
                "Tone & Style",
                toneScore
            ),
        },
        content: {
            score: contentScore,
            tips: mergeTips(raw.strengths, raw.weaknesses, 3, 3, "Content", contentScore),
        },
        structure: {
            score: structureScore,
            tips: mergeTips(
                raw.recommendations,
                raw.specific_improvements,
                2,
                4,
                "Structure",
                structureScore
            ),
        },
        skills: {
            score: skillsScore,
            tips: mergeTips(raw.strengths, raw.missing_keywords, 3, 3, "Skills", skillsScore),
        },
    };
}