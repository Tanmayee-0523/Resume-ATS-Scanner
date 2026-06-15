'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';

interface UploadScreenProps {
  onAnalyze: (file: File, jobDescription: string) => void;
  loading: boolean;
}

export default function UploadScreen({ onAnalyze, loading }: UploadScreenProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === 'application/pdf') setFile(dropped);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const canSubmit = file && jobDescription.trim().length > 0 && !loading;

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-5xl mx-auto">
      {/* Left — PDF Upload */}
      <div className="flex-1 flex flex-col gap-3">
        <label className="text-sm font-semibold text-[#16425B] uppercase tracking-wide">
          Resume (PDF)
        </label>
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          className={`flex-1 min-h-[280px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
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
            onChange={handleFileChange}
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
                className="text-xs text-[#3A7CA5] underline mt-1"
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

      {/* Right — Job Description */}
      <div className="flex-1 flex flex-col gap-3">
        <label className="text-sm font-semibold text-[#16425B] uppercase tracking-wide">
          Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          className="flex-1 min-h-[280px] w-full rounded-xl border border-[#3A7CA5]/40 bg-white/60 p-4 text-sm text-[#16425B] placeholder-[#2F6690]/40 focus:outline-none focus:border-[#3A7CA5] focus:bg-white resize-none"
        />
      </div>

      {/* Analyze Button — full width below */}
      <div className="w-full md:absolute md:bottom-0 md:left-0" />

      <style jsx>{`
        .flex-col.md\\:flex-row { position: relative; }
      `}</style>
    </div>
  );
}
