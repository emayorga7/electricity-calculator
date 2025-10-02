import { DESCRIPTIONS } from "../constants/descriptions";

export function enrichDescriptions(breakdown) {
  const enriched = {};
  for (const key in breakdown) {
    enriched[key] = {
      ...breakdown[key],
      description: DESCRIPTIONS[key] || "",
    };
  }
  return enriched;
}
