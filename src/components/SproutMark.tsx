export function SproutMark({ className }: { className?: string }) {
  return (
    // Cropped tight to the artwork so the soil line sits on the box's bottom edge.
    <svg className={className} viewBox="4 4 23 26" aria-hidden="true" focusable="false">
      <path d="M16 29V15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 17c0-6-4-10-11-10 0 7 4 10 11 10z" fill="currentColor" />
      <path d="M16 14c0-5 3.5-9 10-9 0 6-3.5 9-10 9z" fill="currentColor" opacity="0.7" />
      <path d="M8 29h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
