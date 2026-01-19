import * as React from 'react'
import { Button, type buttonVariants } from './button'
import { Spinner } from './spinner'
import type { VariantProps } from 'class-variance-authority'

interface LoadingButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loadingText?: string
  asChild?: boolean
}

function LoadingButton({
  children,
  isLoading = false,
  loadingText,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <>
          <Spinner className="mr-2" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

export { LoadingButton }
