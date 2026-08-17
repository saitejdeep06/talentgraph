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

type MatchAnalyticsProps = {
  candidates: Candidate[];
};

export default function MatchAnalytics({
  candidates,
}: MatchAnalyticsProps) {
  if (candidates.length === 0) {
    return null;
  }

  const averageMatch =
    candidates.reduce(
      (total, candidate) => total + candidate.matchPercentage,
      0
    ) / candidates.length;

  const excellentMatches = candidates.filter(
    (candidate) => candidate.matchPercentage >= 80
  ).length;

  const strongMatches = candidates.filter(
    (candidate) =>
      candidate.matchPercentage >= 60 &&
      candidate.matchPercentage < 80
  ).length;

  const potentialMatches = candidates.filter(
    (candidate) => candidate.matchPercentage < 60
  ).length;

  const bestCandidate = [...candidates].sort(
    (a, b) => b.matchPercentage - a.matchPercentage
  )[0];

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
          Match Analytics
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-white">
          Recommendation Quality
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Live analytics calculated from the candidates returned by the
          Neo4j matching graph.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-white/10 bg-black/30 p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            Average Match
          </p>

          <p className="mt-3 text-3xl font-semibold text-cyan-400">
            {averageMatch.toFixed(1)}%
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Across {candidates.length} candidates
          </p>
        </div>

        <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-5">
          <p className="text-xs uppercase tracking-wider text-emerald-400">
            Excellent
          </p>

          <p className="mt-3 text-3xl font-semibold text-emerald-400">
            {excellentMatches}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            80% or higher
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-5">
          <p className="text-xs uppercase tracking-wider text-cyan-400">
            Strong
          </p>

          <p className="mt-3 text-3xl font-semibold text-cyan-400">
            {strongMatches}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            60% – 79%
          </p>
        </div>

        <div className="rounded-xl border border-yellow-400/10 bg-yellow-400/5 p-5">
          <p className="text-xs uppercase tracking-wider text-yellow-400">
            Potential
          </p>

          <p className="mt-3 text-3xl font-semibold text-yellow-400">
            {potentialMatches}
          </p>

          <p className="mt-2 text-xs text-gray-500">
            Below 60%
          </p>
        </div>

      </div>

      {bestCandidate && (
        <div className="mt-5 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-5">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Graph Top Recommendation
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                {bestCandidate.candidateName}
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                {bestCandidate.candidateTitle}
              </p>
            </div>

            <div className="text-left md:text-right">
              <p className="text-3xl font-semibold text-cyan-400">
                {bestCandidate.matchPercentage}%
              </p>

              <p className="text-xs text-gray-500">
                {bestCandidate.matchedSkillCount}/
                {bestCandidate.requiredSkillCount} required skills
              </p>
            </div>

          </div>

        </div>
      )}
    </section>
  );
}
