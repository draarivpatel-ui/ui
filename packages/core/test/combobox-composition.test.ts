import { describe, expect, test } from "vitest"
import { combobox } from "../src/components/combobox/combobox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "astro", label: "Astro" },
]

const event = (type: string, target: { value: string }, isComposing = false) =>
  ({ type, target, isComposing }) as unknown as Event

describe("combobox input method composition", () => {
  test("the query keeps updating while composing, flagged as composing", () => {
    const changes: { query: string; composing: boolean }[] = []
    const instance = combobox({
      id: "c",
      items: frameworks,
      onQueryChange: (query, details) =>
        changes.push({ query, composing: details.composing }),
    })
    const input = { value: "" }
    const inputEvent = (value: string) => {
      input.value = value
      instance.api.internal.onInput(event("input", input, true))
    }
    inputEvent("か")
    inputEvent("かと")
    inputEvent("加藤")
    expect(instance.api.getQuery()).toBe("加藤")
    expect(changes).toEqual([
      { query: "か", composing: true },
      { query: "かと", composing: true },
      { query: "加藤", composing: true },
    ])
  })

  test("compositionend reports the committed text once, not composing", () => {
    const changes: { query: string; composing: boolean }[] = []
    const instance = combobox({
      id: "c",
      items: frameworks,
      onQueryChange: (query, details) =>
        changes.push({ query, composing: details.composing }),
    })
    const input = { value: "" }
    const inputEvent = (value: string) => {
      input.value = value
      instance.api.internal.onInput(event("input", input, true))
    }
    inputEvent("か")
    inputEvent("加藤")
    instance.api.internal.onCompositionEnd(event("compositionend", input))
    // WebKit follows with one more input of the same text, which reports nothing.
    instance.api.internal.onInput(event("input", input))
    expect(changes).toEqual([
      { query: "か", composing: true },
      { query: "加藤", composing: true },
      { query: "加藤", composing: false },
    ])
  })

  test("compositionend reports the commit when no composing input arrived", () => {
    const changes: { query: string; composing: boolean }[] = []
    const instance = combobox({
      id: "c",
      items: frameworks,
      onQueryChange: (query, details) =>
        changes.push({ query, composing: details.composing }),
    })
    const input = { value: "加藤" }
    instance.api.internal.onCompositionEnd(event("compositionend", input))
    expect(changes).toEqual([{ query: "加藤", composing: false }])
  })
})
