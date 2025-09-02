# MCP Servers

## Available Tools

- **Figma Dev Mode**: Design-to-code generation and asset management
- **Supabase**: Database operations and backend integration
- **Context7**: Documentation and library reference lookup

## Figma Dev Mode MCP Rules

- The Figma Dev Mode MCP Server provides an assets endpoint which can serve image and SVG assets
- IMPORTANT: If the Figma Dev Mode MCP Server returns a localhost source for an image or an SVG, use that image or SVG source directly
- IMPORTANT: DO NOT import/add new icon packages, all the assets should be in the Figma payload
- IMPORTANT: do NOT use or create placeholders if a localhost source is provided

## CRITICAL: Component Reuse Protocol

**MANDATORY BEFORE ANY IMPLEMENTATION**: Always read `context/component-reuse-analysis.md` for component reuse guidelines and MCP Figma tool limitations. This document contains critical. Read the entire folder and `context/` to learn from your past errors. information about:

- Component composition priorities
- Existing pattern identification requirements
- MCP Figma tool limitations in detecting nested components
- Mandatory search protocols before creating any UI

**Rule**: Never create custom implementations when reusable components exist. Always search existing screens for similar patterns first.

## Supabase MCP Guidelines

- Use for database queries, migrations, and backend operations
- Available operations: list tables, execute SQL, apply migrations, get logs, advisors
- Can manage Edge Functions and development branches
- Always check advisors for security and performance recommendations

## Context7 MCP Usage

- Always call resolve-library-id first before getting documentation
- Use for up-to-date framework and library documentation
- Specify topic parameter to focus documentation retrieval
- Supports versioned library documentation
