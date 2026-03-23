// lib/health-logic.ts

/**
 * Calculates the financial health score based on expenses and budget limit.
 * Returns a score between 0 and 100.
 * If no budget limit is set or it's 0, returns 100 as safe.
 */
export function calculateHealthScore(expense: number, budgetLimit?: number): number {
  if (!budgetLimit || budgetLimit <= 0) {
    return 100; // No limit set, assume safe.
  }

  const ratio = expense / budgetLimit;
  
  if (ratio >= 1) {
    return 0; // Over budget or matched exactly
  }

  // Linear scaling from 0% spent = 100 score, to 100% spent = 0 score
  return Math.max(0, Math.round((1 - ratio) * 100));
}

/**
 * Determines the color state based on the health score.
 * Score >= 50: safe (Aqua Blue/Cyan)
 * Score < 50: warning (Yellow/Amber)
 */
export function getHealthColor(score: number): "safe" | "warning" {
  return score >= 50 ? "safe" : "warning";
}

/**
 * Returns the CSS variable corresponding to the health state.
 */
export function getHealthColorVar(score: number): string {
  return getHealthColor(score) === "safe" ? "var(--income)" : "var(--expense)";
}
