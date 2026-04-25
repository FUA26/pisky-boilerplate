"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

export interface AttachmentFile {
  file: File
  uploadedUrl?: string
}

interface AttachmentUploadProps {
  maxFiles: number
  value: AttachmentFile[]
  onFilesChange: (files: AttachmentFile[]) => void
  onClose: () => void
  uploadEndpoint: string
}

export function AttachmentUpload({
  maxFiles,
  value,
  onFilesChange,
  onClose,
  uploadEndpoint,
}: AttachmentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const remaining = Math.max(maxFiles - value.length, 0)

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true)
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const metaRes = await fetch("/api/files/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              filename: file.name,
              mimeType: file.type || "application/octet-stream",
              size: file.size,
              category:
                uploadEndpoint === "message-attachment" ? "DOCUMENT" : "OTHER",
            }),
          })

          if (!metaRes.ok) {
            throw new Error("Failed to prepare upload")
          }

          const { file: fileRecord, uploadUrl } = await metaRes.json()
          const putRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
            body: file,
          })

          if (!putRes.ok) {
            throw new Error("Failed to upload file")
          }

          return {
            file,
            uploadedUrl: `/api/files/${fileRecord.id}/serve`,
          }
        })
      )

      onFilesChange([...value, ...uploaded])
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Attach files</div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
      <Input
        type="file"
        multiple
        disabled={remaining === 0}
        onChange={async (event) => {
          const files = Array.from(event.target.files ?? []).slice(0, remaining)
          if (files.length > 0) {
            await uploadFiles(files)
          }
          event.currentTarget.value = ""
        }}
      />
      <p className="text-xs text-muted-foreground">
        {isUploading
          ? "Uploading..."
          : `Selected ${value.length}/${maxFiles} files`}
      </p>
    </div>
  )
}
