// =========================================================================
// ZeroToSaaS Error Lens Interactive Test Demo
// =========================================================================
// In this file, TypeScript / Linter diagnostics are printed directly
// INLINE at the end of broken code lines in high-contrast Panic/Warning badges!

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// 🔴 ERROR: Missing property 'email'
const userAccount: UserProfile = {
  id: "usr_994182410a",
  name: "Sarah Jenkins"
};

// 🔴 ERROR: Type 'number' is not assignable to type 'string'
const userIdentifier: string = 100492;

// 🔴 ERROR: Cannot find name 'unresolvedFunction'
const result = unresolvedFunction();

// 🟠 WARNING / UNUSED: Unused variable
const unusedComputation = 42 * 100;

function computeDiscount(price: number): number {
  if (price > 100) {
    return price * 0.9;
  }
  // 🔴 ERROR: Not all code paths return a value
}
