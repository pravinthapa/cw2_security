// server/utils/passwordValidator.js
/**
 * Checks password strength against default or supplied policy.
 * @param {string} pwd - Plain text password.
 * @param {object} policy - Optional overrides.
 * @returns {{valid:boolean,message?:string}}
 */
export const validatePassword = (
  pwd = "",
  policy = {
    minLength: 8,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSymbol: true,
  }
) => {
  const {
    minLength,
    requireUpper,
    requireLower,
    requireNumber,
    requireSymbol,
  } = policy;

  const rules = [
    {
      okay: pwd.length >= minLength,
      msg: `be at least ${minLength} characters`,
    },
    {
      okay: !requireUpper || /[A-Z]/.test(pwd),
      msg: "contain an uppercase letter",
    },
    {
      okay: !requireLower || /[a-z]/.test(pwd),
      msg: "contain a lowercase letter",
    },
    {
      okay: !requireNumber || /\d/.test(pwd),
      msg: "contain a number",
    },
    {
      okay: !requireSymbol || /[^A-Za-z0-9]/.test(pwd),
      msg: "contain a symbol",
    },
  ];

  const failed = rules.filter((r) => !r.okay);
  if (failed.length)
    return {
      valid: false,
      message: `Password must ${failed.map((f) => f.msg).join(", ")}`,
    };

  return { valid: true };
};
