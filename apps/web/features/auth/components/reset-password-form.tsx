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
import { PasswordInput } from "@/features/auth/components/password-input"
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/features/auth/lib/auth-validation"

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
        router.push("/sign-in")
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
          <div className="flex flex-col gap-3">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[oklch(0.205_0.006_165)] dark:text-[oklch(0.985_0.002_165)]">
              Invalid reset link
            </h1>
            <p className="text-base text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
              This link has expired or doesn&apos;t work.
            </p>
          </div>
          <Field>
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request a new link</Link>
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
      noValidate
    >
      <FieldGroup>
        <div className="flex flex-col gap-3">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[oklch(0.205_0.006_165)] dark:text-[oklch(0.985_0.002_165)]">
            Set a new password
          </h1>
          <p className="text-base text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
            Choose something secure you&apos;ll remember
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            {...form.register("password")}
            disabled={form.formState.isSubmitting}
          />
          {form.formState.errors.password && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.password.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
            disabled={form.formState.isSubmitting}
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
            {form.formState.isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </Field>
        <FieldDescription className="text-center text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
          <Link
            href="/sign-in"
            className="font-medium text-[oklch(0.508_0.118_165.612)] underline-offset-4 transition-opacity hover:opacity-70"
          >
            Back to sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
