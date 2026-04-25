"use client"

import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"

interface LogoUploadProps {
  value: string | null | undefined
  logoUrl: string | null
  onChange: (value: string | null) => void
  disabled?: boolean
}

export function LogoUpload({
  value,
  logoUrl,
  onChange,
  disabled,
}: LogoUploadProps) {
  const [inputValue, setInputValue] = useState(value ?? "")
  const [isUploading, setIsUploading] = useState(false)

  const uploadLogo = async (file: File) => {
    setIsUploading(true)
    try {
      const metaRes = await fetch("/api/files/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type || "image/png",
          size: file.size,
          category: "IMAGE",
          isPublic: false,
        }),
      })

      if (!metaRes.ok) {
        throw new Error("Failed to prepare upload")
      }

      const { file: fileRecord, uploadUrl } = await metaRes.json()
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "image/png" },
        body: file,
      })

      if (!putRes.ok) {
        throw new Error("Failed to upload logo")
      }

      onChange(fileRecord.id)
      setInputValue(fileRecord.id)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border p-4">
      {logoUrl ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logoUrl}
          alt="Logo preview"
          className="h-16 w-16 rounded-md object-cover"
        />
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value)
            onChange(event.target.value || null)
          }}
          disabled={disabled}
          placeholder="File ID"
        />
        <Input
          type="file"
          accept="image/*"
          disabled={disabled || isUploading}
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (file) {
              await uploadLogo(file)
            }
            event.currentTarget.value = ""
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={disabled || isUploading}
          onClick={() => {
            setInputValue("")
            onChange(null)
          }}
        >
          Clear
        </Button>
      </div>
    </div>
  )
}
