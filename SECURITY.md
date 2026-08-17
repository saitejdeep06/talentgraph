 # TalentGraph - Security Checklist

## Environment Variables

Sensitive environment variables must remain in .env.local or the deployment platform.

## Neo4j Credentials

Neo4j credentials must remain server-side.

## API Security

API routes should validate required parameters and return appropriate HTTP status codes.

## Database Security

Neo4j queries should use parameters instead of directly concatenating user input.

## Source Control

Sensitive environment files must not be committed to Git.

## Production Checklist

- Environment variables configured
- Neo4j credentials protected
- API parameters validated
- Database queries parameterized
- Production errors protected
- TypeScript check passes
- Production build passes
