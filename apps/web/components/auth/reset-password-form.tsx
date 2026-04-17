"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@workspace/ui/components/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field"
import { Input } from "@workspace/ui/components/input"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/auth-validation"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid reset link")
      return
    }

    try {
      const result = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token }),
      })

      if (result.ok) {
        toast.success("Password reset successfully")
        router.push("/auth/sign-in")
      } else {
        const error = await result.json()
        toast.error(error.message || "Failed to reset password")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
  }

  if (!token) {
    return (
      <form className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Invalid reset link</h1>
            <p className="text-sm text-balance text-muted-foreground">
              This password reset link is invalid or has expired.
            </p>
          </div>
          <Field>
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Request a new reset link</Link>
            </Button>
          </Field>
        </FieldGroup>
      </form>
    )
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Reset password</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <Input
            id="password"
            type="password"
            {...form.register("password")}
            className="bg-background"
          />
          {form.formState.errors.password && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">
            Confirm New Password
          </FieldLabel>
          <Input
            id="confirmPassword"
            type="password"
            {...form.register("confirmPassword")}
            className="bg-background"
          />
          {form.formState.errors.confirmPassword && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.confirmPassword.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? "Resetting password..."
              : "Reset password"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          <Link href="/auth/sign-in" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
