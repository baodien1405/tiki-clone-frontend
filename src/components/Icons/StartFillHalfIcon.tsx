import { IconProps } from '@/types'

export const StartFillHalfIcon = ({ width = '24px', height = '24px', className, onClick }: IconProps) => (
  <svg
    className={className}
    height={height}
    width={width}
    stroke='currentColor'
    fill='currentColor'
    strokeWidth='0'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    onClick={onClick}
  >
    <path d='M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z'></path>
  </svg>
)
