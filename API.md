# TalentGraph - API Documentation

## Candidates

### GET /api/candidates
Returns the available candidates.

### GET /api/candidates/[id]
Returns details for a specific candidate.

### GET /api/candidates/[id]/graph
Returns graph relationships connected to the candidate.

### GET /api/candidates/[id]/projects
Returns projects associated with the candidate.

### GET /api/candidates/[id]/match?jobId=J001
Calculates the candidate's match against a job.

Response includes:
- candidateId
- candidateName
- jobId
- jobTitle
- matchedSkills
- missingSkills
- matchedSkillCount
- requiredSkillCount
- matchPercentage

## Match Calculation

Match percentage is calculated from matched required skills divided by total required skills.

Example:
3 matched skills / 4 required skills = 75%

## HTTP Status Codes

200 - Successful request
400 - Invalid request
404 - Resource not found
500 - Server error

## Error Response

API errors return a structured response containing success and message fields.

Example:
{ "success": false, "message": "Resource not found" }
