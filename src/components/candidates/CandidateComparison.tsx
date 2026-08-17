"use client";

type Candidate = {
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  location: string;
  experience: number;
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchPercentage: number;
};

type CandidateComparisonProps = {
  candidates: Candidate[];
};

export default function CandidateComparison({
  candidates,
}: CandidateComparisonProps) {

  const topCandidates = [...candidates]
    .sort(
      (a, b) =>
        Number(b.matchPercentage || 0) -
        Number(a.matchPercentage || 0)
    )
    .slice(0, 3);

  if (topCandidates.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Candidate Comparison
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Top Graph Matches
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Compare the strongest candidates recommended by the
          Neo4j matching engine.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {topCandidates.map((candidate, index) => {

          const percentage = Math.min(
            100,
            Math.max(
              0,
              Number(candidate.matchPercentage || 0)
            )
          );

          const label =
            percentage >= 80
              ? "Excellent Match"
              : percentage >= 60
                ? "Strong Match"
                : "Potential Match";

          return (
            <div
              key={candidate.candidateId}
              className="rounded-xl border border-white/10 bg-black/20 p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Rank #{index + 1}
                  </p>

                  <h3 className="mt-2 text-lg font-semibold text-white">
                    {candidate.candidateName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-400">
                    {candidate.candidateTitle}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-400">
                    {percentage.toFixed(0)}%
                  </p>

                  <p className="text-xs text-gray-500">
                    {label}
                  </p>
                </div>

              </div>

              <div className="mt-5">

                <div className="mb-2 flex justify-between text-xs">
                  <span className="text-gray-500">
                    Skill Coverage
                  </span>

                  <span className="text-gray-300">
                    {candidate.matchedSkillCount}/
                    {candidate.requiredSkillCount}
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">

                <div className="rounded-lg border border-white/10 p-3">
                  <p className="text-xs text-gray-500">
                    Experience
                  </p>

                  <p className="mt-1 text-sm font-medium text-white">
                    {candidate.experience} years
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 p-3">
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="mt-1 truncate text-sm font-medium text-white">
                    {candidate.location}
                  </p>
                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}
