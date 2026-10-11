---
name: Artifact workflow port collisions
description: What to do when a managed artifact workflow reports that its port is already in use.
---

When an artifact workflow reports a port collision, the listener may be an older process from the same artifact even if the managed workflow is marked failed. Stop the exact managed workflow and check the listener again before considering manual process termination.

**Why:** A failed restart left a wedding-site preview answering on its assigned port; stopping the managed workflow released it, and the previously observed process ID was already gone.

**How to apply:** For artifact-owned services, inspect the exact workflow logs and port, stop it through workflow management, then confirm the port is free before restarting. Do not configure a duplicate workflow.
