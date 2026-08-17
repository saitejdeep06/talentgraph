"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GraphEvidence from "@/components/graph/GraphEvidence";
import CandidateComparison from "@/components/candidates/CandidateComparison";
import MatchAnalytics from "@/components/matching/MatchAnalytics";

type DashboardStats = {
  candidates: number;
  jobs: number;
  skills: number;
  projects: number;
  technologies: number;
  companies: number;
};

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
};

type CandidateMatch = {
  candidateId: string;
  candidateName: string;
  candidateTitle: string;
  location: string;
  experience: number;
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchPercentage: number;
};
type MatchSkill = {
  id: string;
  name: string;
  category: string;
};

type MatchExplanation = {
  matchedSkills: MatchSkill[];
  missingSkills: MatchSkill[];
  matchedSkillCount: number;
  requiredSkillCount: number;
  matchPercentage: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");

  const [matches, setMatches] = useState<CandidateMatch[]>([]);
  const [explanations, setExplanations] = useState<
  Record<string, MatchExplanation>
>({});

  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const [error, setError] = useState("");

  /*
   * Load dashboard statistics
   */
  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Failed to load dashboard statistics");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Dashboard API failed");
        }

        setStats(data.stats);
      } catch (error) {
        console.error("Dashboard stats error:", error);
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoadingStats(false);
      }
    }

    loadStats();
  }, []);

  /*
   * Load jobs
   */
  useEffect(() => {
    async function loadJobs() {
      try {
        const response = await fetch("/api/jobs");

        if (!response.ok) {
          throw new Error("Failed to load jobs");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Jobs API failed");
        }

        setJobs(data.jobs || []);

        /*
         * Automatically select the first available job.
         */
        if (data.jobs?.length > 0) {
          setSelectedJobId(data.jobs[0].id);
        }
      } catch (error) {
        console.error("Jobs loading error:", error);
        setError("Unable to load jobs.");
      } finally {
        setLoadingJobs(false);
      }
    }

    loadJobs();
  }, []);

  /*
   * Load candidate matches whenever the selected job changes.
   */
  useEffect(() => {
    if (!selectedJobId) {
      setMatches([]);
      return;
    }

    async function loadMatches() {
      setLoadingMatches(true);

      try {
        const response = await fetch(
          `/api/jobs/${selectedJobId}/matches`
        );

        if (!response.ok) {
          throw new Error("Failed to load candidate matches");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Candidate matching API failed"
          );
        }

        /*
         * Neo4j integer values can arrive as { low, high }.
         * Convert them safely to normal JavaScript numbers.
         */
        const normalizedMatches = (data.matches || []).map(
          (candidate: any) => ({
            candidateId: candidate.candidateId,
            candidateName: candidate.candidateName,
            candidateTitle: candidate.candidateTitle,
            location: candidate.location,
            experience: toNumber(candidate.experience),
            matchedSkillCount: toNumber(
              candidate.matchedSkillCount
            ),
            requiredSkillCount: toNumber(
              candidate.requiredSkillCount
            ),
            matchPercentage: toNumber(
              candidate.matchPercentage
            ),
          })
        );

        setMatches(normalizedMatches);
      } catch (error) {
        console.error("Candidate matching error:", error);
        setMatches([]);
        setError("Unable to load candidate recommendations.");
      } finally {
        setLoadingMatches(false);
      }
    }

    loadMatches();
  }, [selectedJobId]);

  /*
   * Load explainable match information for each candidate.
   */
  useEffect(() => {
    if (!selectedJobId || matches.length === 0) {
      setExplanations({});
      return;
    }

    async function loadExplanations() {
      try {
        const results = await Promise.all(
          matches.map(async (candidate) => {
            const response = await fetch(
              `/api/candidates/${candidate.candidateId}/match?jobId=${selectedJobId}`
            );

            if (!response.ok) {
              throw new Error(
                `Failed to load explanation for ${candidate.candidateId}`
              );
            }

            const data = await response.json();

            if (!data.success) {
              throw new Error(
                data.message || "Match explanation API failed"
              );
            }

            return {
              candidateId: candidate.candidateId,
              explanation: {
                matchedSkills: data.matchedSkills || [],
                missingSkills: data.missingSkills || [],
                matchedSkillCount: toNumber(data.matchedSkillCount),
                requiredSkillCount: toNumber(data.requiredSkillCount),
                matchPercentage: toNumber(data.matchPercentage),
              },
            };
          })
        );

        const explanationMap: Record<string, MatchExplanation> = {};

        results.forEach(({ candidateId, explanation }) => {
          explanationMap[candidateId] = explanation;
        });

        setExplanations(explanationMap);
      } catch (error) {
        console.error("Match explanation loading error:", error);
        setExplanations({});
      }
    }

    loadExplanations();
  }, [matches, selectedJobId]);
  function toNumber(value: any): number {
    if (
      value &&
      typeof value === "object" &&
      typeof value.low === "number"
    ) {
      return value.low;
    }

    if (value && typeof value.toNumber === "function") {
      return value.toNumber();
    }

    return Number(value ?? 0);
  }

  function getMatchLabel(percentage: number) {
    if (percentage >= 90) {
      return "Excellent match";
    }

    if (percentage >= 70) {
      return "Strong match";
    }

    if (percentage >= 50) {
      return "Potential match";
    }

    return "Low match";
  }

  const statCards = [
    {
      label: "Candidates",
      value: stats?.candidates ?? 0,
    },
    {
      label: "Jobs",
      value: stats?.jobs ?? 0,
    },
    {
      label: "Skills",
      value: stats?.skills ?? 0,
    },
    {
      label: "Projects",
      value: stats?.projects ?? 0,
    },
    {
      label: "Technologies",
      value: stats?.technologies ?? 0,
    },
    {
      label: "Companies",
      value: stats?.companies ?? 0,
    },
  ];

  const selectedJob = jobs.find(
    (job) => job.id === selectedJobId
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-10">
          <p className="text-sm font-semibold tracking-[0.25em] text-cyan-400">
            TALENTGRAPH
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Talent Intelligence Dashboard
          </h1>

          <p className="mt-3 max-w-3xl text-gray-400">
            Graph-powered candidate discovery, intelligent matching,
            and explainable recommendations using Neo4j.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* LIVE GRAPH STATISTICS */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-sm text-gray-400">
                {stat.label}
              </p>

              <p className="mt-3 text-3xl font-bold">
                {loadingStats ? "..." : stat.value}
              </p>
            </div>
          ))}

        </section>

        {/* JOB SELECTOR */}
        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-7">

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-sm font-semibold tracking-wider text-cyan-400">
                INTELLIGENT MATCHING
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Select a Job
              </h2>

              <p className="mt-2 text-gray-400">
                Choose a job and TalentGraph will calculate candidate
                recommendations directly from the Neo4j graph.
              </p>
            </div>

            <div className="w-full md:w-96">

              <label
                htmlFor="job"
                className="mb-2 block text-sm text-gray-400"
              >
                Job
              </label>

              <select
                id="job"
                value={selectedJobId}
                onChange={(event) =>
                  setSelectedJobId(event.target.value)
                }
                disabled={loadingJobs}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-cyan-400"
              >
                {loadingJobs ? (
                  <option value="">
                    Loading jobs...
                  </option>
                ) : (
                  jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.id} — {job.title}
                    </option>
                  ))
                )}
              </select>

            </div>

          </div>

          {selectedJob && (
            <div className="mt-6 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-5">

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                <div>
                  <p className="text-sm text-cyan-400">
                    SELECTED JOB
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    {selectedJob.title}
                  </h3>

                  <p className="mt-1 text-gray-400">
                    {selectedJob.company} · {selectedJob.location}
                  </p>
                </div>

                <Link
                  href={`/jobs/${selectedJob.id}`}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold transition hover:border-cyan-400 hover:text-cyan-400"
                >
                  Open full matching →
                </Link>

              </div>

            </div>
          )}

        </section>

        {/* LIVE RECOMMENDATIONS */}
        <section className="mt-10">

          <div className="mb-6">
            <p className="text-sm font-semibold tracking-wider text-cyan-400">
              GRAPH RECOMMENDATIONS
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Recommended Candidates
            </h2>

            <p className="mt-2 text-gray-400">
              Ranked using connected candidate skills and the selected
              job requirements.
            </p>
          </div>

          {loadingMatches ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-gray-400">
                Calculating graph-based matches...
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
              <p className="text-gray-400">
                No matching candidates found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {matches.map((candidate, index) => (
                <Link
                  key={candidate.candidateId}
                  href={`/candidates/${candidate.candidateId}?jobId=${selectedJobId}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/40 hover:bg-white/10"
                >

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                    {/* RANK */}
                    <div className="flex items-center gap-4 lg:w-80">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 font-bold">
                        #{index + 1}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold">
                          {candidate.candidateName}
                        </h3>

                        <p className="text-sm text-gray-400">
                          {candidate.candidateTitle}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                          <span>
                            📍 {candidate.location}
                          </span>

                          <span>
                            💼 {candidate.experience} years
                          </span>

                          <span>
                            🔗 {candidate.matchedSkillCount}/
                            {candidate.requiredSkillCount} skills
                          </span>
                        </div>
                      </div>

                    </div>

                    {/* MATCH */}
                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <span className="text-xs text-gray-500">
                          GRAPH MATCH
                        </span>

                        <span className="text-2xl font-bold text-cyan-400">
                          {candidate.matchPercentage}%
                        </span>

                      </div>

                      <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">

                        <div
                          className="h-full rounded-full bg-cyan-400 transition-all"
                          style={{
                            width: `${Math.min(
                              candidate.matchPercentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      <p className="mt-2 text-right text-xs text-gray-500">
                        {getMatchLabel(candidate.matchPercentage)}
                      </p>

                    </div>

                  </div>

                </Link>
              ))}

            </div>
          )}

        </section>

        {/* GRAPH PIPELINE */}
        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-7">

          <p className="text-sm font-semibold tracking-wider text-cyan-400">
            GRAPH INTELLIGENCE
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Recommendation Pipeline
          </h2>

          <p className="mt-3 text-gray-400">
            The recommendation is produced from relationships stored
            in the Neo4j graph.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">

            {[
              "Candidate",
              "Skills",
              "Projects",
              "Job Requirements",
              "Recommendation",
            ].map((item, index) => (
              <div key={item} className="relative">

                <div className="rounded-xl border border-white/10 bg-black p-4 text-center">

                  <p className="text-sm text-gray-500">
                    Step {index + 1}
                  </p>

                  <p className="mt-2 font-semibold">
                    {item}
                  </p>

                </div>

                {index < 4 && (
                  <div className="hidden md:block absolute left-full top-1/2 w-4 -translate-y-1/2 text-center text-cyan-400">
                    →
                  </div>
                )}

              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}