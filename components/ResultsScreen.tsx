'use client';

import ScoreCircle from './ScoreCircle';
import { AnalysisResult } from '@/types/analysis';

interface ResultsScreenProps {
  result: AnalysisResult;
  onReset: () => void;
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm">
        <span className="text-[#16425B] font-medium">{label}</span>
        <span className="text-[#2F6690] font-semibold">{value}/100</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-[#C5C9C2]">
        <div
          className="h-2.5 rounded-full bg-[#3A7CA5] transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default function ResultsScreen({ result, onReset }: ResultsScreenProps) {
  const { score, summary, matchedKeywords, missingKeywords, sectionScores, suggestions } = result;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {/* Score */}
      <div className="flex flex-col items-center gap-3">
        <ScoreCircle score={score} />
        <p className="text-[#16425B] text-center text-base max-w-xl">{summary}</p>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/70 rounded-xl p-5 border border-[#3A7CA5]/20">
          <h3 className="text-sm font-semibold text-[#16425B] uppercase tracking-wide mb-3">
            Matched Keywords:
          </h3>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full text-xs font-medium bg-[#81C3D7]/30 text-[#16425B] border border-[#3A7CA5]/30"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-white/70 rounded-xl p-5 border border-[#3A7CA5]/20">
          <h3 className="text-sm font-semibold text-[#16425B] uppercase tracking-wide mb-3">
            Missing Keywords:
          </h3>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => (
              <span
                key={kw}
                className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section Scores */}
      <div className="bg-white/70 rounded-xl p-5 border border-[#3A7CA5]/20 flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-[#16425B] uppercase tracking-wide">Section Scores</h3>
        <ProgressBar label="Skills" value={sectionScores.skills} />
        <ProgressBar label="Experience" value={sectionScores.experience} />
        <ProgressBar label="Projects" value={sectionScores.projects} />
      </div>

      {/* Suggestions */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#16425B] uppercase tracking-wide">Suggestions</h3>
        {suggestions.map((s, i) => (
          <div key={i} className="bg-white/70 rounded-xl p-5 border border-[#3A7CA5]/20 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#2F6690] uppercase tracking-wide">Original</span>
              <p className="text-sm text-[#16425B]/70 leading-relaxed">{s.original}</p>
            </div>
            <div className="border-t border-[#3A7CA5]/20" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[#3A7CA5] uppercase tracking-wide">Rewritten</span>
              <p className="text-sm text-[#16425B] leading-relaxed font-medium">{s.rewritten}</p>
            </div>
            <p className="text-xs text-[#2F6690] italic">{s.reason}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="self-center px-6 py-2.5 rounded-lg border border-[#2F6690] text-[#2F6690] text-sm font-medium hover:bg-[#2F6690] hover:text-white transition-colors"
      >
        Analyze another resume
      </button>
    </div>
  );
}
