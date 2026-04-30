// ─── Button ───────────────────────────────────────────────────────────────────
// Shared button component used across all screens.
//
// Variants:
//   primary   — dark fill  (New Game, Play Again, confirm actions)
//   secondary — ghost/outline (Back to Home, Exit)
//   higher    — green fill  (Bet Higher)
//   lower     — red fill    (Bet Lower)

const BASE =
  "inline-flex items-center justify-center font-sans font-medium rounded-[8px] " +
  "transition-all duration-200 cursor-pointer select-none " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary " +
  "disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]";

const VARIANTS = {
  primary:
    "bg-primary text-white hover:opacity-80 focus-visible:outline-primary",
  secondary:
    "bg-surface text-primary border border-border hover:border-primary hover:bg-background focus-visible:outline-primary",
  higher:
    "bg-success text-white hover:opacity-80 focus-visible:outline-success",
  lower:
    "bg-error text-white hover:opacity-80 focus-visible:outline-error",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

/**
 * @param {{ variant?: 'primary'|'secondary'|'higher'|'lower', size?: 'sm'|'md'|'lg' }} props
 */
const Button = ({
  children,
  onClick,
  variant  = "primary",
  size     = "md",
  disabled = false,
  className = "",
  ...rest
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button;
