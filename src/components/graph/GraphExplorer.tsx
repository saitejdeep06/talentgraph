"use client";

import { useEffect, useState } from "react";

type Candidate = {
  id: string;
  name: string;
  title: string;
};

type GraphItem = {
  id: string;
  name: string;
  category?: string;
  description?: string;
  industry?: string;
};

type GraphData = {
  candidate: Candidate;
  skills: GraphItem[];
  projects: GraphItem[];
  technologies: GraphItem[];
  companies: GraphItem[];
};

type Props = {
  candidateId: string;
};

export default function GraphExplorer({ candidateId }: Props) {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/candidates/${candidateId}/graph`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load candidate graph."
          );
        }

        setGraph(data.graph);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load candidate graph."
        );
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [candidateId]);

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          <p className="text-sm text-slate-600">
            Loading candidate graph...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">
          Graph unavailable
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {error}
        </p>
      </section>
    );
  }

  if (!graph) {
    return null;
  }

  const nodeStyle =
    "cursor-pointer rounded-xl border px-4 py-3 text-center transition hover:-translate-y-0.5 hover:shadow-md";

  const isSelected = (id: string) =>
    selectedNode === id;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Talent Graph
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Explore the relationships connecting this candidate
          to skills, projects, technologies, and companies.
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <svg
            viewBox="0 0 1000 620"
            className="h-[620px] w-full"
            role="img"
            aria-label="Candidate relationship graph"
          >
            {/* Relationship lines */}

            {graph.skills.map((skill, index) => {
              const y = 100 + index * 70;

              return (
                <g key={`skill-line-${skill.id}`}>
                  <line
                    x1="260"
                    y1="310"
                    x2="110"
                    y2={y + 25}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-300"
                  />

                  <text
                    x="170"
                    y={(310 + y + 25) / 2}
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px]"
                  >
                    HAS_SKILL
                  </text>
                </g>
              );
            })}

            {graph.projects.map((project, index) => {
              const y = 100 + index * 90;

              return (
                <g key={`project-line-${project.id}`}>
                  <line
                    x1="740"
                    y1="310"
                    x2="850"
                    y2={y + 25}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-300"
                  />

                  <text
                    x="800"
                    y={(310 + y + 25) / 2}
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px]"
                  >
                    WORKED_ON
                  </text>
                </g>
              );
            })}

            {graph.companies.map((company, index) => {
              const x = 390 + index * 180;

              return (
                <g key={`company-line-${company.id}`}>
                  <line
                    x1="500"
                    y1="390"
                    x2={x + 60}
                    y2="540"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-slate-300"
                  />

                  <text
                    x={(500 + x + 60) / 2}
                    y="470"
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px]"
                  >
                    WORKED_AT
                  </text>
                </g>
              );
            })}

            {/* Candidate node */}

            <g
              onClick={() =>
                setSelectedNode(graph.candidate.id)
              }
              className="cursor-pointer"
            >
              <rect
                x="260"
                y="250"
                width="480"
                height="120"
                rx="20"
                fill="currentColor"
                className={
                  isSelected(graph.candidate.id)
                    ? "text-slate-200"
                    : "text-slate-100"
                }
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={
                  isSelected(graph.candidate.id)
                    ? "0"
                    : "0"
                }
                style={{
                  stroke: "currentColor",
                }}
              />

              <text
                x="500"
                y="295"
                textAnchor="middle"
                className="fill-slate-900 text-[22px] font-semibold"
              >
                {graph.candidate.name}
              </text>

              <text
                x="500"
                y="325"
                textAnchor="middle"
                className="fill-slate-600 text-[14px]"
              >
                {graph.candidate.title}
              </text>

              <text
                x="500"
                y="350"
                textAnchor="middle"
                className="fill-slate-400 text-[11px]"
              >
                {graph.candidate.id}
              </text>
            </g>

            {/* Skill nodes */}

            {graph.skills.map((skill, index) => {
              const y = 100 + index * 70;

              return (
                <g
                  key={skill.id}
                  onClick={() =>
                    setSelectedNode(skill.id)
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x="20"
                    y={y}
                    width="180"
                    height="50"
                    rx="12"
                    fill="currentColor"
                    className={
                      isSelected(skill.id)
                        ? "text-slate-200"
                        : "text-white"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      stroke: "currentColor",
                    }}
                  />

                  <text
                    x="110"
                    y={y + 22}
                    textAnchor="middle"
                    className="fill-slate-800 text-[13px] font-medium"
                  >
                    {skill.name}
                  </text>

                  {skill.category && (
                    <text
                      x="110"
                      y={y + 39}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px]"
                    >
                      {skill.category}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Project nodes */}

            {graph.projects.map((project, index) => {
              const y = 100 + index * 90;

              return (
                <g
                  key={project.id}
                  onClick={() =>
                    setSelectedNode(project.id)
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x="820"
                    y={y}
                    width="160"
                    height="50"
                    rx="12"
                    fill="currentColor"
                    className={
                      isSelected(project.id)
                        ? "text-slate-200"
                        : "text-white"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      stroke: "currentColor",
                    }}
                  />

                  <text
                    x="900"
                    y={y + 22}
                    textAnchor="middle"
                    className="fill-slate-800 text-[13px] font-medium"
                  >
                    {project.name}
                  </text>

                  <text
                    x="900"
                    y={y + 39}
                    textAnchor="middle"
                    className="fill-slate-400 text-[10px]"
                  >
                    Project
                  </text>
                </g>
              );
            })}

            {/* Company nodes */}

            {graph.companies.map((company, index) => {
              const x = 390 + index * 180;

              return (
                <g
                  key={company.id}
                  onClick={() =>
                    setSelectedNode(company.id)
                  }
                  className="cursor-pointer"
                >
                  <rect
                    x={x}
                    y="540"
                    width="120"
                    height="50"
                    rx="12"
                    fill="currentColor"
                    className={
                      isSelected(company.id)
                        ? "text-slate-200"
                        : "text-white"
                    }
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      stroke: "currentColor",
                    }}
                  />

                  <text
                    x={x + 60}
                    y="562"
                    textAnchor="middle"
                    className="fill-slate-800 text-[12px] font-medium"
                  >
                    {company.name}
                  </text>

                  <text
                    x={x + 60}
                    y="578"
                    textAnchor="middle"
                    className="fill-slate-400 text-[10px]"
                  >
                    Company
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Technology list */}

      <div className="mt-6 border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-900">
          Technologies
        </h3>

        {graph.technologies.length === 0 ? (
          <p className="mt-2 text-sm text-slate-500">
            No technologies found.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {graph.technologies.map((technology) => (
              <button
                key={technology.id}
                type="button"
                onClick={() =>
                  setSelectedNode(technology.id)
                }
                className={`rounded-full border px-3 py-1.5 text-sm transition ${
                  isSelected(technology.id)
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {technology.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedNode && (
        <div
          className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4"
          aria-live="polite"
        >
          <p className="text-sm text-slate-600">
            Selected node
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {selectedNode}
          </p>
        </div>
      )}
    </section>
  );
}