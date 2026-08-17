export const queries = {
  // 1. Get all candidates
  getCandidates: `
    MATCH (c:Candidate)
    RETURN
      c.id AS id,
      c.name AS name,
      c.title AS title,
      c.location AS location,
      c.experience AS experience
    ORDER BY c.name
  `,

  // 2. Get one candidate with their skills
  getCandidateById: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    RETURN
      c.id AS id,
      c.name AS name,
      c.title AS title,
      c.location AS location,
      c.experience AS experience,
      collect({
        id: s.id,
        name: s.name,
        category: s.category
      }) AS skills
  `,

  // 3. Multi-hop traversal:
  // Candidate -> Project -> Technology
  getCandidateProjects: `
    MATCH (c:Candidate {id: $candidateId})
          -[:WORKED_ON]->(p:Project)
          -[:USES]->(t:Technology)
    RETURN
      p.id AS projectId,
      p.name AS projectName,
      p.description AS description,
      collect(t.name) AS technologies
    ORDER BY p.name
  `,

  // 4. Candidate -> Company
  getCandidateCompanies: `
    MATCH (c:Candidate {id: $candidateId})
          -[:WORKED_AT]->(company:Company)
    RETURN
      company.id AS id,
      company.name AS name,
      company.industry AS industry
  `,

  // 5. Get all jobs
  getJobs: `
    MATCH (j:Job)
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    RETURN
      j.id AS id,
      j.title AS title,
      j.company AS company,
      j.location AS location,
      collect(s.name) AS requiredSkills
    ORDER BY j.title
  `,

  // 6. Get a job and its required skills
  getJobById: `
    MATCH (j:Job {id: $jobId})
    OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)
    RETURN
      j.id AS id,
      j.title AS title,
      j.company AS company,
      j.location AS location,
      collect({
        id: s.id,
        name: s.name,
        category: s.category
      }) AS requiredSkills
  `,

  // 7. Find candidates matching a job's required skills
  getCandidatesForJob: `
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)
    MATCH (c:Candidate)-[:HAS_SKILL]->(matched:Skill)
    WHERE matched.id = required.id
    WITH
      c,
      count(DISTINCT required) AS matchedSkills,
      count {
        (j)-[:REQUIRES]->(:Skill)
      } AS totalRequiredSkills
    RETURN
      c.id AS id,
      c.name AS name,
      c.title AS title,
      c.location AS location,
      c.experience AS experience,
      matchedSkills,
      totalRequiredSkills,
      round(
        (toFloat(matchedSkills) / totalRequiredSkills) * 100,
        1
      ) AS matchPercentage
    ORDER BY matchPercentage DESC
  `,

  // 8. Find missing skills for a candidate against a job
  getMissingSkills: `
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(candidateSkill:Skill)
    WITH
      required,
      collect(candidateSkill.id) AS candidateSkillIds
    WHERE NOT required.id IN candidateSkillIds
    RETURN
      required.id AS id,
      required.name AS name,
      required.category AS category
    ORDER BY required.name
  `,

  // 9. Interesting graph query:
  // Candidate -> Project -> Technology <- Company
  getConnectedExperience: `
    MATCH (c:Candidate {id: $candidateId})
          -[:WORKED_ON]->(p:Project)
          -[:USES]->(t:Technology)
          <-[:USES]-(company:Company)

    RETURN DISTINCT
      c.name AS candidate,
      p.name AS project,
      t.name AS technology,
      company.name AS connectedCompany
    ORDER BY project, technology
  `,

  // 10. Graph overview
  // 11. Candidate relationship graph
  getCandidateGraph: `
    MATCH (c:Candidate {id: $candidateId})

    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)

    OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)

    OPTIONAL MATCH (p)-[:USES]->(t:Technology)

    OPTIONAL MATCH (c)-[:WORKED_AT]->(company:Company)

    RETURN
      c.id AS candidateId,
      c.name AS candidateName,
      c.title AS candidateTitle,

      collect(DISTINCT {
        id: s.id,
        name: s.name,
        category: s.category
      }) AS skills,

      collect(DISTINCT {
        id: p.id,
        name: p.name,
        description: p.description
      }) AS projects,

      collect(DISTINCT {
        id: t.id,
        name: t.name
      }) AS technologies,

      collect(DISTINCT {
        id: company.id,
        name: company.name,
        industry: company.industry
      }) AS companies
  `,

  matchCandidatesToJob: `
    MATCH (j:Job {id: $jobId})-[:REQUIRES]->(required:Skill)
    MATCH (c:Candidate)-[:HAS_SKILL]->(matched:Skill)
    WHERE matched.id = required.id
    WITH
      j,
      c,
      count(DISTINCT required) AS matchedSkillCount
    OPTIONAL MATCH (j)-[:REQUIRES]->(allRequired:Skill)
    WITH
      c,
      matchedSkillCount,
      count(DISTINCT allRequired) AS requiredSkillCount
    RETURN
      c.id AS candidateId,
      c.name AS candidateName,
      c.title AS candidateTitle,
      c.location AS location,
      c.experience AS experience,
      matchedSkillCount,
      requiredSkillCount,
      CASE
        WHEN requiredSkillCount = 0 THEN 0
        ELSE 100.0 * matchedSkillCount / requiredSkillCount
      END AS matchPercentage
    ORDER BY matchPercentage DESC
  `,
  // 11. Explain candidate-to-job match
  getCandidateMatchExplanation: `
    MATCH (j:Job {id: $jobId})
    MATCH (c:Candidate {id: $candidateId})

    OPTIONAL MATCH (j)-[:REQUIRES]->(required:Skill)
    WITH
      j,
      c,
      collect(DISTINCT required) AS requiredSkills

    OPTIONAL MATCH (c)-[:HAS_SKILL]->(candidateSkill:Skill)
    WITH
      j,
      c,
      requiredSkills,
      collect(DISTINCT candidateSkill) AS candidateSkills

    WITH
      j,
      c,
      requiredSkills,
      candidateSkills,
      [skill IN requiredSkills
        WHERE skill.id IN [candidateSkill IN candidateSkills | candidateSkill.id]
      ] AS matchedSkills,
      [skill IN requiredSkills
        WHERE NOT skill.id IN [candidateSkill IN candidateSkills | candidateSkill.id]
      ] AS missingSkills

    RETURN
      c.id AS candidateId,
      c.name AS candidateName,
      j.id AS jobId,
      j.title AS jobTitle,

      [skill IN matchedSkills | {
        id: skill.id,
        name: skill.name,
        category: skill.category
      }] AS matchedSkills,

      [skill IN missingSkills | {
        id: skill.id,
        name: skill.name,
        category: skill.category
      }] AS missingSkills,

      size(matchedSkills) AS matchedSkillCount,
      size(requiredSkills) AS requiredSkillCount,

      CASE
        WHEN size(requiredSkills) = 0 THEN 0
        ELSE 100.0 * size(matchedSkills) / size(requiredSkills)
      END AS matchPercentage
  `,
  // 11. Dashboard statistics from Neo4j
  getDashboardStats: `
    CALL {
      MATCH (c:Candidate)
      RETURN count(c) AS candidates
    }
    CALL {
      MATCH (j:Job)
      RETURN count(j) AS jobs
    }
    CALL {
      MATCH (s:Skill)
      RETURN count(s) AS skills
    }
    CALL {
      MATCH (p:Project)
      RETURN count(p) AS projects
    }
    CALL {
      MATCH (t:Technology)
      RETURN count(t) AS technologies
    }
    CALL {
      MATCH (company:Company)
      RETURN count(company) AS companies
    }
    RETURN
      candidates,
      jobs,
      skills,
      projects,
      technologies,
      companies
  `,
};