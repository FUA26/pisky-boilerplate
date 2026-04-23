"use client"

import Link from "next/link"
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
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/features/auth/lib/auth-validation"

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    try {
      const result = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (result.ok) {
        toast.success("Password reset email sent")
        form.reset()
      } else {
        const error = await result.json()
        toast.error(error.message || "Failed to send reset email")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    }
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
            Reset your password
          </h1>
          <p className="text-base text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...form.register("email")}
            disabled={form.formState.isSubmitting}
          />
          {form.formState.errors.email && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.email.message}
            </FieldDescription>
          )}
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
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
