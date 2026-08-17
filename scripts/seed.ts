import neo4j from "neo4j-driver";

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error("CognoDB environment variables are missing.");
}

const driver = neo4j.driver(
  uri,
  neo4j.auth.basic(username, password)
);

const candidates = [
  {
    id: "C001",
    name: "Aarav Sharma",
    title: "Senior Backend Engineer",
    location: "Bengaluru",
    experience: 5,
  },
  {
    id: "C002",
    name: "Ananya Rao",
    title: "Machine Learning Engineer",
    location: "Hyderabad",
    experience: 4,
  },
  {
    id: "C003",
    name: "Rohan Mehta",
    title: "Full Stack Developer",
    location: "Pune",
    experience: 3,
  },
  {
    id: "C004",
    name: "Priya Nair",
    title: "Data Engineer",
    location: "Bengaluru",
    experience: 6,
  },
  {
    id: "C005",
    name: "Vikram Singh",
    title: "Cloud Engineer",
    location: "Delhi",
    experience: 5,
  },
];

const skills = [
  { id: "S001", name: "Python", category: "Programming" },
  { id: "S002", name: "JavaScript", category: "Programming" },
  { id: "S003", name: "TypeScript", category: "Programming" },
  { id: "S004", name: "React", category: "Frontend" },
  { id: "S005", name: "Node.js", category: "Backend" },
  { id: "S006", name: "Machine Learning", category: "AI" },
  { id: "S007", name: "SQL", category: "Database" },
  { id: "S008", name: "Docker", category: "DevOps" },
  { id: "S009", name: "AWS", category: "Cloud" },
  { id: "S010", name: "Neo4j", category: "Database" },
];

const technologies = [
  { id: "T001", name: "Python" },
  { id: "T002", name: "React" },
  { id: "T003", name: "Node.js" },
  { id: "T004", name: "PostgreSQL" },
  { id: "T005", name: "Docker" },
  { id: "T006", name: "AWS" },
  { id: "T007", name: "Neo4j" },
  { id: "T008", name: "TensorFlow" },
];

const companies = [
  {
    id: "CO001",
    name: "TechNova Labs",
    industry: "Software",
  },
  {
    id: "CO002",
    name: "CloudSphere",
    industry: "Cloud Computing",
  },
  {
    id: "CO003",
    name: "DataWorks AI",
    industry: "Artificial Intelligence",
  },
];

const projects = [
  {
    id: "P001",
    name: "Talent Analytics Platform",
    description: "Graph-based platform for discovering technical talent.",
  },
  {
    id: "P002",
    name: "AI Recommendation Engine",
    description: "Machine learning system for personalized recommendations.",
  },
  {
    id: "P003",
    name: "Cloud Migration Platform",
    description: "Infrastructure platform for migrating applications to AWS.",
  },
  {
    id: "P004",
    name: "Developer Collaboration Hub",
    description: "Platform connecting developers, projects and technologies.",
  },
];

const jobs = [
  {
    id: "J001",
    title: "Backend Engineer",
    company: "TechNova Labs",
    location: "Bengaluru",
  },
  {
    id: "J002",
    title: "Machine Learning Engineer",
    company: "DataWorks AI",
    location: "Hyderabad",
  },
  {
    id: "J003",
    title: "Cloud Engineer",
    company: "CloudSphere",
    location: "Bengaluru",
  },
];

const candidateSkills: Record<string, string[]> = {
  C001: ["S001", "S005", "S007", "S008", "S010"],
  C002: ["S001", "S006", "S007", "S010"],
  C003: ["S002", "S003", "S004", "S005", "S007"],
  C004: ["S001", "S007", "S008", "S009"],
  C005: ["S001", "S008", "S009", "S007"],
};

const employment: Record<string, string> = {
  C001: "CO001",
  C002: "CO003",
  C003: "CO001",
  C004: "CO003",
  C005: "CO002",
};

const candidateProjects: Record<string, string[]> = {
  C001: ["P001", "P004"],
  C002: ["P002"],
  C003: ["P001", "P004"],
  C004: ["P002"],
  C005: ["P003"],
};

const projectTechnologies: Record<string, string[]> = {
  P001: ["T007", "T001", "T003"],
  P002: ["T001", "T008"],
  P003: ["T005", "T006"],
  P004: ["T002", "T003", "T007"],
};

const companyTechnologies: Record<string, string[]> = {
  CO001: ["T001", "T003", "T007"],
  CO002: ["T005", "T006"],
  CO003: ["T001", "T008", "T004"],
};

const jobSkills: Record<string, string[]> = {
  J001: ["S001", "S005", "S007", "S010"],
  J002: ["S001", "S006", "S007"],
  J003: ["S001", "S008", "S009"],
};

const applications: Record<string, string[]> = {
  C001: ["J001"],
  C002: ["J002"],
  C003: ["J001"],
  C004: ["J002"],
  C005: ["J003"],
};

async function seed() {
  const session = driver.session();

  try {
    console.log("🌱 Starting TalentGraph seed...");

    // Candidates
    for (const candidate of candidates) {
      await session.run(
        `
        MERGE (c:Candidate {id: $id})
        SET c.name = $name,
            c.title = $title,
            c.location = $location,
            c.experience = $experience
        `,
        candidate
      );
    }

    // Skills
    for (const skill of skills) {
      await session.run(
        `
        MERGE (s:Skill {id: $id})
        SET s.name = $name,
            s.category = $category
        `,
        skill
      );
    }

    // Technologies
    for (const technology of technologies) {
      await session.run(
        `
        MERGE (t:Technology {id: $id})
        SET t.name = $name
        `,
        technology
      );
    }

    // Companies
    for (const company of companies) {
      await session.run(
        `
        MERGE (c:Company {id: $id})
        SET c.name = $name,
            c.industry = $industry
        `,
        company
      );
    }

    // Projects
    for (const project of projects) {
      await session.run(
        `
        MERGE (p:Project {id: $id})
        SET p.name = $name,
            p.description = $description
        `,
        project
      );
    }

    // Jobs
    for (const job of jobs) {
      await session.run(
        `
        MERGE (j:Job {id: $id})
        SET j.title = $title,
            j.company = $company,
            j.location = $location
        `,
        job
      );
    }

    // Candidate -> Skill
    for (const [candidateId, skillIds] of Object.entries(candidateSkills)) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (c:Candidate {id: $candidateId})
          MATCH (s:Skill {id: $skillId})
          MERGE (c)-[:HAS_SKILL]->(s)
          `,
          { candidateId, skillId }
        );
      }
    }

    // Candidate -> Company
    for (const [candidateId, companyId] of Object.entries(employment)) {
      await session.run(
        `
        MATCH (c:Candidate {id: $candidateId})
        MATCH (company:Company {id: $companyId})
        MERGE (c)-[:WORKED_AT]->(company)
        `,
        { candidateId, companyId }
      );
    }

    // Candidate -> Project
    for (const [candidateId, projectIds] of Object.entries(candidateProjects)) {
      for (const projectId of projectIds) {
        await session.run(
          `
          MATCH (c:Candidate {id: $candidateId})
          MATCH (p:Project {id: $projectId})
          MERGE (c)-[:WORKED_ON]->(p)
          `,
          { candidateId, projectId }
        );
      }
    }

    // Project -> Technology
    for (const [projectId, technologyIds] of Object.entries(
      projectTechnologies
    )) {
      for (const technologyId of technologyIds) {
        await session.run(
          `
          MATCH (p:Project {id: $projectId})
          MATCH (t:Technology {id: $technologyId})
          MERGE (p)-[:USES]->(t)
          `,
          { projectId, technologyId }
        );
      }
    }

    // Company -> Technology
    for (const [companyId, technologyIds] of Object.entries(
      companyTechnologies
    )) {
      for (const technologyId of technologyIds) {
        await session.run(
          `
          MATCH (c:Company {id: $companyId})
          MATCH (t:Technology {id: $technologyId})
          MERGE (c)-[:USES]->(t)
          `,
          { companyId, technologyId }
        );
      }
    }

    // Job -> Skill
    for (const [jobId, skillIds] of Object.entries(jobSkills)) {
      for (const skillId of skillIds) {
        await session.run(
          `
          MATCH (j:Job {id: $jobId})
          MATCH (s:Skill {id: $skillId})
          MERGE (j)-[:REQUIRES]->(s)
          `,
          { jobId, skillId }
        );
      }
    }

    // Candidate -> Job
    for (const [candidateId, jobIds] of Object.entries(applications)) {
      for (const jobId of jobIds) {
        await session.run(
          `
          MATCH (c:Candidate {id: $candidateId})
          MATCH (j:Job {id: $jobId})
          MERGE (c)-[:APPLIED_TO]->(j)
          `,
          { candidateId, jobId }
        );
      }
    }

    console.log("✅ TalentGraph seed completed successfully.");
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();