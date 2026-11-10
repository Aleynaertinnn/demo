'use client'

import { Icon as IconifyIcon, type IconProps } from '@iconify/react/offline'

export default function Icon({ width = 20, height = 20, ...props }: IconProps) {
  return <IconifyIcon width={width} height={height} aria-hidden="true" focusable="false" {...props} />
}
