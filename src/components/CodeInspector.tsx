import React, { useState, useEffect } from 'react';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FolderGit2,
  ExternalLink,
  Terminal,
  Server,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  FileArchive,
  Code2,
} from 'lucide-react';

export type RepoFileKey =
  | 'server.ts'
  | 'main.py'
  | 'app.py'
  | 'demo_runner.py'
  | 'src/App.tsx'
  | 'src/components/QuickTestView.tsx'
  | 'src/components/SelfTestView.tsx'
  | 'src/components/CodeInspector.tsx'
  | 'src/components/GcpConsoleNav.tsx'
  | 'src/components/VideoComparison.tsx'
  | 'src/components/AudioTestbench.tsx'
  | 'src/components/RoiCalculator.tsx'
  | 'src/components/OfflineReferenceHub.tsx'
  | 'src/components/MasterDocumentation.tsx'
  | 'firestore.rules'
  | 'Dockerfile'
  | 'requirements.txt'
  | 'cloud_deploy.sh'
  | 'README.md';

const ALL_REPO_FILES: RepoFileKey[] = [
  'server.ts',
  'src/App.tsx',
  'src/components/QuickTestView.tsx',
  'src/components/SelfTestView.tsx',
  'src/components/CodeInspector.tsx',
  'src/components/VideoComparison.tsx',
  'src/components/GcpConsoleNav.tsx',
  'src/components/AudioTestbench.tsx',
  'src/components/RoiCalculator.tsx',
  'src/components/OfflineReferenceHub.tsx',
  'src/components/MasterDocumentation.tsx',
  'main.py',
  'app.py',
  'demo_runner.py',
  'firestore.rules',
  'Dockerfile',
  'requirements.txt',
  'cloud_deploy.sh',
  'README.md',
];

export const CodeInspector: React.FC = () => {
  const [activeFile, setActiveFile] = useState<RepoFileKey>('server.ts');
  const [files, setFiles] = useState<Record<string, string> | null>(null);
  const [fileFilter, setFileFilter] = useState<'ALL' | 'REACT_SRC' | 'BACKEND' | 'CONFIG'>('ALL');
  const [copied, setCopied] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/repo-files')
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
        }
      })
      .catch((err) => console.error('Failed to load repo files:', err))
      .finally(() => setLoading(false));
  }, []);

  const currentCode = files ? files[activeFile] || '// Loading file content...' : '// Loading repository file...';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = activeFile.replace('/', '_');
    link.download = safeName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    if (!files) return;
    Object.entries(files).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace('/', '_');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  // Generate single-file bundle for Claude, ChatGPT, Cursor (Now including server.ts and src/)
  const generateClaudeBundle = (): string => {
    if (!files) return '';
    const fileEntries = Object.entries(files);
    let bundle = `# EchoFlow AI - Complete Full-Stack Codebase Bundle\n`;
    bundle += `**Project:** EchoFlow AI - Real-Time Pitch & Emotion-Preserving Voice Normalizer\n`;
    bundle += `**Submission:** Hack2skill AI Builder Cup 2026\n`;
    bundle += `**Submitter:** Bharathi Srihari (bharathi.srihari@gmail.com)\n`;
    bundle += `**Full-Stack Stack:** Express/Node server.ts (WebSocket streaming gateway), React/Tailwind src/ folder (GCP Console UI, Audio Testbench, Video Compare, ROI Engine), FastAPI main.py, Streamlit app.py, and Dockerfile.\n\n`;
    bundle += `================================================================================\n`;
    bundle += `MANIFEST OF INCLUDED FILES (${fileEntries.length} Files):\n`;
    fileEntries.forEach(([name]) => {
      bundle += `  - ${name}\n`;
    });
    bundle += `================================================================================\n\n`;

    fileEntries.forEach(([filename, content]) => {
      bundle += `\n/* =====================================================================\n`;
      bundle += `   FILE: ${filename}\n`;
      bundle += `   ===================================================================== */\n`;
      bundle += `<file path="${filename}">\n`;
      bundle += `${content}\n`;
      bundle += `</file>\n\n`;
    });

    return bundle;
  };

  const handleDownloadClaudeBundle = () => {
    const bundleText = generateClaudeBundle();
    const blob = new Blob([bundleText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'echoflow_local_backup_bundle.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyClaudeBundle = () => {
    const bundleText = generateClaudeBundle();
    navigator.clipboard.writeText(bundleText);
    setCopiedClaude(true);
    setTimeout(() => setCopiedClaude(false), 2500);
  };

  const getFileBadge = (file: RepoFileKey) => {
    if (file.startsWith('src/')) return 'React UI (src/)';
    if (file === 'server.ts') return 'Full-Stack Gateway (server.ts)';
    if (file === 'main.py') return 'FastAPI Gateway';
    if (file === 'app.py') return 'Streamlit Dashboard';
    if (file === 'demo_runner.py') return 'Automated Test Suite';
    if (file === 'README.md') return 'Architecture & Audit Docs';
    if (file === 'Dockerfile') return 'Cloud Run Container';
    if (file === 'cloud_deploy.sh') return 'GCP Deploy Script';
    return 'Manifest';
  };

  const visibleFiles = ALL_REPO_FILES.filter((file) => {
    if (fileFilter === 'REACT_SRC') return file.startsWith('src/');
    if (fileFilter === 'BACKEND') return file === 'server.ts' || file === 'main.py' || file === 'app.py' || file === 'demo_runner.py';
    if (fileFilter === 'CONFIG') return file.endsWith('.md') || file === 'Dockerfile' || file === 'requirements.txt' || file === 'cloud_deploy.sh';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderGit2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Complete Full-Stack Repository Deliverables
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Deliverables: server.ts, React src/ & Python Gateway
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Inspect production files including <strong>server.ts</strong> and the complete <strong>React src/</strong> application
              or download the consolidated single-file <strong>Local Backup</strong> bundle.
            </p>
          </div>

          {/* Action Buttons: Local Backup Bundle, Download All */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadClaudeBundle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/30 active:scale-95 cursor-pointer"
              title="Download consolidated Local Backup bundle"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>Download Local Backup</span>
            </button>

            <button
              onClick={handleCopyClaudeBundle}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/40 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              {copiedClaude ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedClaude ? 'Copied Local Backup!' : 'Copy Local Backup'}</span>
            </button>

            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
            >
              <FileArchive className="w-4 h-4 text-amber-400" />
              <span>Download Files Individually</span>
            </button>
          </div>
        </div>

        {/* AI Ingestion Callout */}
        <div className="mt-4 p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-between text-xs text-purple-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
            <span>
              <strong>Local Backup Ready:</strong> Single-file export consolidates <strong>server.ts</strong>, <strong>Test Suite</strong>, <strong>React src/</strong> components, <strong>FastAPI main.py</strong>, and all manuals with standardized XML tags (<code>&lt;file path=&quot;...&quot;&gt;</code>) for instant local preservation, offline review, or pasting into AI models.
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] font-mono text-purple-400">XML Delimited Bundle</span>
        </div>
      </div>

      {/* Code Inspector Container */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
        {/* Category Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 font-mono text-[11px] mr-2">Filter:</span>
            {(
              [
                ['ALL', 'All (16)'],
                ['REACT_SRC', 'React src/ (8)'],
                ['BACKEND', 'Gateways & Tests (4)'],
                ['CONFIG', 'Docs & Deploy (4)'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFileFilter(key)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-all ${
                  fileFilter === key
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {getFileBadge(activeFile)}
            </span>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-all"
              title="Copy active file content"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-mono transition-all"
              title="Download this file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* File Tabs Bar */}
        <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-950 border-b border-slate-800">
          {visibleFiles.map((file) => {
            const isSelected = activeFile === file;
            return (
              <button
                key={file}
                onClick={() => setActiveFile(file)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Area */}
        <div className="relative">
          <pre className="p-6 text-xs sm:text-sm font-mono text-slate-200 bg-slate-950 overflow-x-auto max-h-[600px] leading-relaxed selection:bg-amber-500/30 selection:text-amber-200">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
