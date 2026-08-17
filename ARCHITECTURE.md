# TalentGraph - Architecture

## Overview

TalentGraph is a Next.js TypeScript application backed by CognoDB using the official Neo4j driver and openCypher.

## Architecture Layers

### Presentation Layer

Next.js App Router pages provide the dashboard, jobs and candidate intelligence interfaces.

### API Layer

Next.js Route Handlers expose candidate, job, dashboard, graph, project and matching APIs.

### Graph Data Layer

The centralized Neo4j library provides parameterized Cypher execution through CognoDB.

## Graph Model

Candidate -[HAS_SKILL]-> Skill
Candidate -[WORKED_ON]-> Project
Candidate -[WORKS_AT]-> Company
Project -[USES]-> Technology
Job -[REQUIRES]-> Skill
Job -[AT_COMPANY]-> Company

## Candidate Matching

The matching API compares the skills required by a Job with the skills connected to a Candidate.

Matched skills and missing skills are returned together with the match percentage.

## Multi-Hop Graph Intelligence

TalentGraph can traverse relationships between candidates, skills, projects, technologies and companies to produce graph-based recommendations.

## Security

Database credentials are loaded from environment variables and are not committed to Git.

## Production

The application is built with Next.js and can be deployed to a Node-compatible hosting platform.

