"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import GraphExplorer from "@/components/graph/GraphExplorer";

type Skill = {
  id: string;
  name: string;
  category?: string | null;
};

type Project = {
  id: string;
  name: string;
  description?: string | null;
  technologies: string[];
};

type Company = {
  id: string;
  name: string;
  industry?: string | null;
};

type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  experience: number;
  skills: Skill[];
  projects: Project[];
  companies: Company[];
};

type Match = {
  candidateId: string;
  candidateName: string;
  jobId: string;
  jobTitle: string;
  matchedSkills: Skill[];
  missingSkills: Skill[];
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchPercentage: number;
};

export default function CandidateProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const candidateId = params.id as string;
  const jobId = searchParams.get("jobId");

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const candidateResponse = await fetch(
          `/api/candidates/${candidateId}`
        );

        const candidateData = await candidateResponse.json();

        if (!candidateResponse.ok || !candidateData.success) {
          throw new Error(
            candidateData.message || "Unable to load candidate."
          );
        }

        setCandidate(candidateData.candidate);

        if (jobId) {
          const matchResponse = await fetch(
            `/api/candidates/${candidateId}/match?jobId=${encodeURIComponent(
              jobId
            )}`
          );

          const matchData = await matchResponse.json();

          if (matchResponse.ok && matchData.success) {
            setMatch(matchData.match);
          }
        }
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load candidate profile."
        );
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      loadData();
    }
  }, [candidateId, jobId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="animate-pulse space-y-6">
            <div className="h-5 w-32 rounded bg-zinc-800" />
            <div className="h-12 w-80 rounded bg-zinc-800" />
            <div className="h-5 w-96 rounded bg-zinc-800" />

            <div className="h-48 rounded-2xl border border-zinc-800 bg-zinc-950" />

            <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !candidate) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl border border-red-900 bg-red-950/30 p-8">
            <h1 className="text-2xl font-semibold">
              Unable to load candidate
            </h1>

            <p className="mt-3 text-zinc-400">
              {error || "Candidate not found."}
            </p>

            <Link
              href={jobId ? `/jobs/${jobId}` : "/"}
              className="mt-6 inline-block rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black"
            >
              Go Back
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const initials = candidate.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const percentage = match
    ? Math.round(match.matchPercentage)
    : null;

  const matchLabel =
    percentage === null
      ? "Profile"
      : percentage >= 80
      ? "Excellent match"
      : percentage >= 60
      ? "Strong match"
      : percentage >= 40
      ? "Potential match"
      : "Low match";

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">

        {jobId && (
          <Link
            href={`/jobs/${jobId}`}
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400"
          >
            Ã¢â€ Â Back to Candidate Matching
          </Link>
        )}

        <section className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10 text-2xl font-semibold text-cyan-400">
                {initials}
              </div>

              <div>
                <p className="text-sm font-medium tracking-[0.25em] text-cyan-400">
                  TALENTGRAPH
                </p>

                <h1 className="mt-2 text-4xl font-bold">
                  {candidate.name}
                </h1>

                <p className="mt-2 text-xl text-zinc-400">
                  {candidate.title}
                </p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm text-zinc-500">
                  <span>Ã°Å¸â€œÂ {candidate.location}</span>
                  <span>Ã°Å¸â€™Â¼ {candidate.experience} years experience</span>
                  <span>Ã°Å¸â€â€” {candidate.skills.length} skills</span>
                </div>
              </div>
            </div>

            {match && (
              <div className="min-w-[260px] rounded-2xl border border-zinc-800 bg-black p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-zinc-500">
                    Match
                  </span>

                  <span className="text-3xl font-bold text-cyan-400">
                    {percentage}%
                  </span>
                </div>

                <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-cyan-400 transition-all"
                    style={{
                      width: `${Math.min(
                        Math.max(percentage ?? 0, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-right text-sm text-zinc-500">
                  {matchLabel}
                </p>
              </div>
            )}
          </div>
        </section>

        {match && (
          <section className="mt-8">
            <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Candidate Intelligence
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    {matchLabel}
                  </h2>

                  <p className="mt-2 text-sm text-zinc-400">
                    {match.matchedSkillCount} of {match.requiredSkillCount} required
                    skills matched for {match.jobTitle}.
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-4xl font-bold text-cyan-400">
                    {percentage}%
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Graph-based match score
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-emerald-400">
                    Matched
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {match.matchedSkillCount}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-900/50 bg-amber-950/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-amber-400">
                    Missing
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {match.missingSkills.length}
                  </p>
                </div>

                <div className="rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4">
                  <p className="text-xs uppercase tracking-wider text-cyan-400">
                    Experience
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {candidate.experience} yrs
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-black/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Hiring Recommendation
                </p>

                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  {(percentage ?? 0) >= 80
                    ? "High-priority candidate. The candidate demonstrates strong alignment with the required skills and should be considered for the next hiring stage."
                    : (percentage ?? 0) >= 60
                    ? "Promising candidate. The candidate has good skill alignment, but the missing requirements should be reviewed before advancing."
                    : (percentage ?? 0) >= 40
                    ? "Potential candidate. Consider the candidate if the missing skills can be developed or are not critical for the role."
                    : "Low alignment. The candidate currently has limited overlap with the required skills for this position."}
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold">
              Why This Candidate Matches
            </h2>

            <p className="mt-2 text-zinc-500">
              Graph-based comparison against{" "}
              <span className="text-zinc-300">
                {match.jobTitle}
              </span>
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-emerald-900/60 bg-emerald-950/20 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-emerald-400">
                    Matched Skills
                  </h3>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                    {match.matchedSkillCount}/
                    {match.requiredSkillCount}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {match.matchedSkills.length > 0 ? (
                    match.matchedSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full border border-emerald-800 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300"
                      >
                        Ã¢Å“â€œ {skill.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-zinc-500">
                      No required skills matched.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-amber-900/60 bg-amber-950/20 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-400">
                    Missing Skills
                  </h3>

                  <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
                    {match.missingSkills.length}
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {match.missingSkills.length > 0 ? (
                    match.missingSkills.map((skill) => (
                      <span
                        key={skill.id}
                        className="rounded-full border border-amber-800 bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
                      >
                        ! {skill.name}
                      </span>
                    ))
                  ) : (
                    <p className="text-emerald-400">
                      Ã¢Å“â€œ No missing required skills.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Candidate Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {candidate.skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3"
              >
                <p className="font-medium">
                  {skill.name}
                </p>

                {skill.category && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {skill.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold">
            Projects
          </h2>

          {candidate.projects.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-500">
              No project information available.
            </div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {candidate.projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                >
                  <h3 className="text-xl font-semibold">
                    {project.name}
                  </h3>

                  {project.description && (
                    <p className="mt-3 leading-7 text-zinc-500">
                      {project.description}
                    </p>
                  )}

                  {project.technologies?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-cyan-400"
                        >
                          {technology}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 pb-16">
          <h2 className="text-2xl font-semibold">
            Companies
          </h2>

          {candidate.companies.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-500">
              No company information available.
            </div>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {candidate.companies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                >
                  <h3 className="text-xl font-semibold">
                    {company.name}
                  </h3>

                  {company.industry && (
                    <p className="mt-2 text-zinc-500">
                      {company.industry}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-10 pb-16">
          <GraphExplorer candidateId={candidateId} />
        </section>
      </div>
    </main>
  );
}


