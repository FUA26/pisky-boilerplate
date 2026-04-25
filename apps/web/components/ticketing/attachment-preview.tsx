"use client"

import { Badge } from "@workspace/ui/components/badge"

export interface AttachmentPreviewItem {
  url: string
  name: string
  type?: string
  size?: number
}

interface AttachmentPreviewProps {
  attachments: AttachmentPreviewItem[]
  className?: string
}

export function AttachmentPreview({
  attachments,
  className,
}: AttachmentPreviewProps) {
  if (attachments.length === 0) return null

  return (
    <div className={className ?? "space-y-2"}>
      {attachments.map((attachment) => (
        <a
          key={`${attachment.url}-${attachment.name}`}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-muted"
        >
          <span className="truncate">{attachment.name}</span>
          <Badge variant="secondary">File</Badge>
        </a>
      ))}
    </div>
  )
}
