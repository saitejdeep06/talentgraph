"use client";

type GraphEvidenceProps = {
  candidateName: string;
  jobTitle: string;
  matchedSkills: {
    id: string;
    name: string;
    category: string;
  }[];
  missingSkills: {
    id: string;
    name: string;
    category: string;
  }[];
};

export default function GraphEvidence({
  candidateName,
  jobTitle,
  matchedSkills,
  missingSkills,
}: GraphEvidenceProps) {
  return (
    <div className="mt-4 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Graph Evidence
        </p>

        <p className="mt-1 text-sm text-gray-400">
          Recommendation path derived from Neo4j relationships.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-gray-200">
          {candidateName}
        </span>

        <span className="text-cyan-400">→ HAS_SKILL →</span>

        <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-emerald-300">
          {matchedSkills.length} matched skills
        </span>

        <span className="text-cyan-400">→ REQUIRED_BY →</span>

        <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-cyan-300">
          {jobTitle}
        </span>
      </div>

      {matchedSkills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Graph-supported skills
          </p>

          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            Missing graph requirements
          </p>

          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs text-red-300"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 border-t border-white/10 pt-3">
        <p className="text-xs text-gray-500">
          Neo4j evidence: Candidate → HAS_SKILL → Skill ← REQUIRES ← Job
        </p>
      </div>
    </div>
  );
}
