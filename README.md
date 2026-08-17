# TalentGraph

## Overview

TalentGraph is a graph-powered talent intelligence application built with Next.js, TypeScript and CognoDB.

The application helps recruiters explore candidates, skills, jobs, projects, technologies and companies through graph relationships.

## Why a graph database?

Talent relationships are naturally connected. A candidate can have multiple skills, work on multiple projects, use different technologies and work at different companies. Jobs also require skills and belong to companies.

A graph database makes these relationships and multi-hop questions natural to query. For example, TalentGraph can connect a candidate to skills, projects, technologies and companies and use those relationships for candidate intelligence and matching.

## Graph Data Model

`	ext
Candidate -[HAS_SKILL]-> Skill
Candidate -[WORKED_ON]-> Project
Candidate -[WORKS_AT]-> Company
Project -[USES]-> Technology
Job -[REQUIRES]-> Skill
Job -[AT_COMPANY]-> Company
` 

## CognoDB Setup

Create a CognoDB Cloud instance and obtain the Bolt connection URI and password.

Store connection details in environment variables and never commit them to Git.

Example environment configuration:

`	ext
COGNODB_URI=bolt+s://your-instance.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-password
` 

## Installation

`powershell
npm install
` 

## Development

`powershell
npm run dev
` 

Open the application at:

`	ext
http://localhost:3000
` 

## Production Build

`powershell
npm run build
npm start
` 

## Main Graph Queries

### Candidate skills

`cypher
MATCH (c:Candidate {id: })-[:HAS_SKILL]->(s:Skill)
RETURN c, s
` 

### Job required skills

`cypher
MATCH (j:Job {id: })-[:REQUIRES]->(s:Skill)
RETURN j, s
` 

### Candidate match

TalentGraph compares candidate skills with the skills required by a selected job and returns matched skills, missing skills and a match percentage.

## Candidate Intelligence

The candidate intelligence page displays:

- Match percentage
- Matched skills
- Missing skills
- Experience
- Hiring recommendation
- Graph-based candidate information

## API Routes

- /api/candidates`r
- /api/candidates/[id]`r
- /api/candidates/[id]/graph`r
- /api/candidates/[id]/match`r
- /api/candidates/[id]/projects`r
- /api/jobs`r
- /api/jobs/[id]/matches`r

## Screenshots

Add screenshots of the dashboard, candidate intelligence page and graph visualization before submitting the assignment.

## Hosted Demo

Add the final hosted application URL here after deployment.

## Screen Recording

Add the final screen recording link here before submitting.

## Security

Environment variables containing database credentials must never be committed to the repository.

## Testing

TypeScript validation:

npx tsc --noEmit

Production validation:

npm run build

Both checks currently pass.

