export function HeartIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9.50001C2.00002 8.38721 2.33759 7.30059 2.96813 6.38367C3.59867 5.46675 4.49252 4.76267 5.53161 4.36441C6.5707 3.96615 7.70616 3.89245 8.78801 4.15305C9.86987 4.41365 10.8472 4.99629 11.591 5.82401C11.6434 5.88002 11.7067 5.92468 11.7771 5.95521C11.8474 5.98574 11.9233 6.00149 12 6.00149C12.0767 6.00149 12.1526 5.98574 12.2229 5.95521C12.2933 5.92468 12.3566 5.88002 12.409 5.82401C13.1504 4.99091 14.128 4.40338 15.2116 4.13961C16.2952 3.87585 17.4335 3.94836 18.4749 4.34749C19.5163 4.74663 20.4114 5.45346 21.0411 6.37391C21.6708 7.29436 22.0053 8.38477 22 9.50001C22 11.79 20.5 13.5 19 15L13.508 20.313C13.3217 20.527 13.0919 20.6989 12.834 20.8173C12.5762 20.9357 12.296 20.9979 12.0123 20.9997C11.7285 21.0015 11.4476 20.9428 11.1883 20.8277C10.9289 20.7126 10.697 20.5436 10.508 20.332L5 15C3.5 13.5 2 11.8 2 9.50001Z" />
    </svg>
  );
}

export function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.9922 16.3423C3.13924 16.7132 3.17198 17.1196 3.0862 17.5093L2.02118 20.7994C1.98686 20.9662 1.99574 21.1391 2.04696 21.3015C2.09818 21.464 2.19004 21.6107 2.31385 21.7276C2.43766 21.8446 2.5893 21.9281 2.75439 21.97C2.91949 22.012 3.09256 22.0111 3.2572 21.9674L6.67026 20.9694C7.03798 20.8964 7.4188 20.9283 7.76928 21.0614C9.9047 22.0586 12.3237 22.2696 14.5995 21.6571C16.8754 21.0446 18.8617 19.648 20.2082 17.7137C21.5546 15.7794 22.1747 13.4316 21.9588 11.0847C21.743 8.73784 20.7052 6.54258 19.0285 4.88628C17.3519 3.22997 15.1441 2.21907 12.7947 2.03193C10.4454 1.84478 8.10542 2.49342 6.18769 3.8634C4.26997 5.23338 2.89773 7.23666 2.31308 9.5198C1.72843 11.8029 1.96895 14.2192 2.9922 16.3423Z" />
    </svg>
  );
}

export function ShareIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-1 -3 28 28"
      width="22"
      height="22"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={0.5}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.9315 1.6995C24.2675 0.691429 23.3085 -0.267656 22.3005 0.068323L0.881754 7.20798C-0.321049 7.60887 -0.283763 9.32293 0.935233 9.67115L11.3524 12.6476L14.3287 23.0647C14.677 24.2839 16.391 24.3212 16.7919 23.1182L23.9315 1.6995ZM22.2523 2.65954L15.5686 22.7105L12.598 12.3137L22.2523 2.65954ZM21.3404 1.74768L11.6863 11.4018L1.28958 8.43134L21.3404 1.74768Z"
      />
    </svg>
  );
}

export function BookmarkIcon({
  filled,
  className,
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="21"
      height="21"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path d="M6 3.5h12a1 1 0 0 1 1 1V21l-7-4.2L5 21V4.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
  );
}

export function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        d="M15 18l-6-6 6-6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      className={className}
      fill="currentColor"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function CompassIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <circle cx="12" cy="12" r="9" strokeLinejoin="round" />
      <path
        d="M15.5 8.5l-2 5-5 2 2-5 5-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ImageStackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <rect x="4" y="4" width="13" height="13" rx="2.5" strokeLinejoin="round" />
      <path
        d="M7.5 13.5l2.4-2.6a1 1 0 0 1 1.5.05L13 13l1.3-1.5a1 1 0 0 1 1.5 0l1.2 1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.3" cy="8" r="1.1" fill="currentColor" stroke="none" />
      <path
        d="M20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
    >
      <path
        d="M11.5 3.5h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.6 1.4l-7.9 7.9a2 2 0 0 1-2.8 0L3.2 15.8a2 2 0 0 1 0-2.8l7.9-7.9a2 2 0 0 1 .4-.4Z"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
