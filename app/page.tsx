'use client';

import { useState, useRef } from 'react';
import ResultsScreen from '@/components/ResultsScreen';
import { AnalysisResult } from '@/types/analysis';

type Screen = 'input' | 'loading' | 'results';

export default function Home() {
  const [screen, setScreen] = useState<Screen>('input');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) return;
    setError(null);
    setScreen('loading');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Analysis failed');
      const data: AnalysisResult = await res.json();
      setResult(data);
      setScreen('results');
    } catch {
      setError('Something went wrong. Please try again.');
      setScreen('input');
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError(null);
    setScreen('input');
  };

  const canSubmit = file && jobDescription.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#D9DCD6] flex flex-col">
      {/* Header */}
      <header className="bg-[#16425B] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-[#81C3D7] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16425B" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">ATS Scanner</span>
        </div>
      </header>

      <div className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col gap-8">

          {screen === 'input' && (
            <>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-[#16425B]">Resume ATS Scanner</h1>
                <p className="text-[#2F6690] text-sm">Upload your resume and paste a job description to see how well you match.</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-6">
                {/* PDF Upload */}
                <div className="flex-1 flex flex-col gap-3">
                  <label className="text-xs font-semibold text-[#16425B] uppercase tracking-wide">
                    Resume (PDF)
                  </label>
                  <div
                    onClick={() => inputRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      const dropped = e.dataTransfer.files[0];
                      if (dropped?.type === 'application/pdf') setFile(dropped);
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    className={`min-h-[280px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                      ${dragging
                        ? 'border-[#3A7CA5] bg-[#81C3D7]/20'
                        : 'border-[#3A7CA5]/50 bg-white/60 hover:bg-white/80'
                      }`}
                  >
                    <input
                      ref={inputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const selected = e.target.files?.[0];
                        if (selected) setFile(selected);
                      }}
                    />
                    {file ? (
                      <div className="flex flex-col items-center gap-3 px-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#81C3D7]/30 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F6690" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        </div>
                        <p className="text-[#16425B] font-medium text-sm">{file.name}</p>
                        <p className="text-[#2F6690] text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="text-xs text-[#3A7CA5] underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 px-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-[#81C3D7]/30 flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2F6690" strokeWidth="2">
                            <polyline points="16 16 12 12 8 16"/>
                            <line x1="12" y1="12" x2="12" y2="21"/>
                            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
                          </svg>
                        </div>
                        <p className="text-[#16425B] font-medium text-sm">Drop your PDF here</p>
                        <p className="text-[#2F6690] text-xs">or click to browse</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div className="flex-1 flex flex-col gap-3">
                  <label className="text-xs font-semibold text-[#16425B] uppercase tracking-wide">
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="flex-1 min-h-[280px] w-full rounded-xl border border-[#3A7CA5]/40 bg-white/60 p-4 text-sm text-[#16425B] placeholder-[#2F6690]/40 focus:outline-none focus:border-[#3A7CA5] focus:bg-white resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!canSubmit}
                className={`self-end px-8 py-3 rounded-lg text-sm font-semibold transition-colors
                  ${canSubmit
                    ? 'bg-[#2F6690] text-white hover:bg-[#16425B] cursor-pointer'
                    : 'bg-[#2F6690]/30 text-white/50 cursor-not-allowed'
                  }`}
              >
                Analyze Resume
              </button>
            </>
          )}

          {screen === 'loading' && (
            <div className="flex flex-col items-center justify-center gap-6 py-32">
              <div className="w-12 h-12 rounded-full border-4 border-[#81C3D7] border-t-[#2F6690] animate-spin" />
              <p className="text-[#16425B] text-base font-medium">Analyzing your resume...</p>
              <p className="text-[#2F6690] text-sm">This takes about 5–10 seconds</p>
            </div>
          )}

          {screen === 'results' && result && (
            <ResultsScreen result={result} onReset={handleReset} />
          )}
        </div>
      </div>
    </main>
  );
}
