# MANUAL TASK - To Be Added to Task Master

**ID:** TBD
**Title:** Fix TypeScript Configuration for React Hook Testing
**Status:** pending
**Priority:** high
**Dependencies:** []

**Description:**
Investigate and resolve the root cause of the TypeScript/Vite/Vitest configuration issue that prevents type inference in React hook tests. The goal is to remove the need for any workarounds (like triple-slash directives) and have a clean, reliable testing setup.

**Details:**
The agent encountered persistent linter and TypeScript errors when attempting to test React hooks using Vitest and React Testing Library. The errors suggest a misconfiguration that prevents the test environment from correctly inferring the return types of custom hooks.

**Acceptance Criteria:**
- All linter errors in `.test.tsx` files are resolved.
- Tests for `useApi` and other custom hooks can be written and run successfully without type errors.
- The need for triple-slash directives (`/// <reference types="vitest/globals" />`) is eliminated.
- The solution is clean and does not introduce unnecessary complexity to the build/test configuration. 