export function Icon({ name, className = "ic", ...props }) {
  return (
    <svg className={className} aria-hidden="true" {...props}>
      <use href={`#i-${name}`} />
    </svg>
  );
}
