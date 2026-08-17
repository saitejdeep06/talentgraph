"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Match = {
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  location: string;
  experience: number;
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchPercentage: number;
};

export default function JobMatchesPage() {
  const params = useParams();
  const jobId = params.id as string;

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/jobs/${jobId}/matches`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load matches."
          );
        }

        setMatches(data.matches || []);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load candidate matches."
        );
      } finally {
        setLoading(false);
      }
    }

    if (jobId) {
      loadMatches();
    }
  }, [jobId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="animate-pulse space-y-5">
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-12 w-96 rounded bg-zinc-800" />
            <div className="h-6 w-72 rounded bg-zinc-800" />
            <div className="h-32 rounded-2xl bg-zinc-900" />
            <div className="h-32 rounded-2xl bg-zinc-900" />
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="rounded-2xl border border-red-900 bg-red-950/20 p-8">
            <h1 className="text-2xl font-semibold">
              Candidate Matching Error
            </h1>

            <p className="mt-3 text-zinc-400">
              {error}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">

        <div className="mb-10">
          <p className="text-sm font-medium tracking-[0.25em] text-cyan-400">
            TALENTGRAPH
          </p>

          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold">
                Candidate Matching
              </h1>

              <p className="mt-3 text-zinc-400">
                Intelligent graph-powered matching for job{" "}
                <span className="font-semibold text-white">
                  {jobId}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-7 py-5">
              <p className="text-xs uppercase tracking-wider text-zinc-500">
                Candidates Found
              </p>

              <p className="mt-2 text-3xl font-bold">
                {matches.length}
              </p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-2xl font-semibold">
            Recommended Candidates
          </h2>

          <p className="mt-2 text-zinc-500">
            Ranked by connected skill match
          </p>

          <div className="mt-6 space-y-4">
            {matches.map((candidate, index) => {
              const percentage = Math.round(
                candidate.matchPercentage
              );

              const initials = candidate.candidateName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const matchLabel =
                percentage >= 80
                  ? "Excellent match"
                  : percentage >= 60
                  ? "Strong match"
                  : percentage >= 40
                  ? "Potential match"
                  : "Low match";

              return (
                <Link
                  key={candidate.candidateId}
                  href={`/candidates/${candidate.candidateId}?jobId=${jobId}`}
                  className="group block"
                >
                  <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition duration-200 hover:border-cyan-500/40 hover:bg-zinc-900/70">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">

                      <div className="flex min-w-0 flex-1 items-center gap-5">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold">
                          #{index + 1}
                        </div>

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 font-semibold text-cyan-400">
                          {initials}
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold group-hover:text-cyan-400">
                            {candidate.candidateName}
                          </h3>

                          <p className="mt-1 text-zinc-400">
                            {candidate.candidateTitle}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
                            <span>
                              📍 {candidate.location}
                            </span>

                            <span>
                              💼 {candidate.experience} years
                            </span>

                            <span>
                              🔗{" "}
                              {candidate.matchedSkillCount}/
                              {candidate.requiredSkillCount} skills
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="w-full md:w-64">
                        <div className="flex items-center justify-between">
                          <span className="text-xs uppercase tracking-wider text-zinc-500">
                            Match
                          </span>

                          <span className="text-2xl font-bold">
                            {percentage}%
                          </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-cyan-400"
                            style={{
                              width: `${Math.min(
                                Math.max(percentage, 0),
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <p className="mt-2 text-right text-xs text-zinc-500">
                          {matchLabel}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {matches.length === 0 && (
            <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-10 text-center">
              <p className="text-lg font-medium">
                No matching candidates found.
              </p>

              <p className="mt-2 text-zinc-500">
                This job currently has no candidates with connected skills.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}