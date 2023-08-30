import { IconProps } from '@/types'

export const UserIcon = ({ width = '24px', height = '24px', className }: IconProps) => (
  <svg
    className={className}
    height={height}
    width={width}
    strokeWidth='0'
    stroke='currentColor'
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'></path>
  </svg>
)
