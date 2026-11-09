"use client"

import * as React from "react"
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  closeOnClickOutside?: boolean
  backdropClassName?: string
  className?: string
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  closeOnClickOutside = false,
  backdropClassName = "bg-black/60",
  className,
}: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogPortal>
        <DialogOverlay
          className={cn(
            "backdrop-blur-xs transition-opacity",
            backdropClassName
          )}
        />
        <DialogContent
          className={cn(
            "fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
            className
          )}
          onPointerDownCapture={(e) => {
            if (!closeOnClickOutside) {
              e.stopPropagation()
            }
          }}
        >
          <DialogHeader className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3">
              {icon && <div className="text-primary">{icon}</div>}
              <DialogTitle className="text-lg leading-none font-semibold tracking-tight">
                {title}
              </DialogTitle>
            </div>
            {subtitle && (
              <DialogDescription className="text-sm text-muted-foreground">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-2">{children}</div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
