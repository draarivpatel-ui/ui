---
"@ui-sdk/core": patch
---

An agent's step that changes a value its component commits, like a Slider's or a Number Input's, now calls `onValueCommit` once, when the step has taken, with `source: "agent"`. It never fired for an agent, so an app that saves on commit missed an agent's change. A step that fails commits nothing, and a value set from code commits nothing, as before.
