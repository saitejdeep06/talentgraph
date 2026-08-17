// ============================================
// TalentGraph - Graph Schema
// ============================================

// Candidate
CREATE CONSTRAINT candidate_id_unique IF NOT EXISTS
FOR (c:Candidate)
REQUIRE c.id IS UNIQUE;

// Skill
CREATE CONSTRAINT skill_id_unique IF NOT EXISTS
FOR (s:Skill)
REQUIRE s.id IS UNIQUE;

// Job
CREATE CONSTRAINT job_id_unique IF NOT EXISTS
FOR (j:Job)
REQUIRE j.id IS UNIQUE;

// Company
CREATE CONSTRAINT company_id_unique IF NOT EXISTS
FOR (c:Company)
REQUIRE c.id IS UNIQUE;

// Project
CREATE CONSTRAINT project_id_unique IF NOT EXISTS
FOR (p:Project)
REQUIRE p.id IS UNIQUE;

// Technology
CREATE CONSTRAINT technology_id_unique IF NOT EXISTS
FOR (t:Technology)
REQUIRE t.id IS UNIQUE;