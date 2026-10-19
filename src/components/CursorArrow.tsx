/** The little collaborator-style pointer used on chips and name tags. */
export function CursorArrow({ fill, className }: { fill: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 26" width="28" height="26" aria-hidden="true">
      <path d="M 0 0 L 12 26 L 14 13 L 28 9.5 Z" fill={fill} stroke="#111212" strokeWidth="2" />
    </svg>
  )
}
