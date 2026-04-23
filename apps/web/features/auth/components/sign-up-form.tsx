"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
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
  signUpSchema,
  type SignUpInput,
} from "@/features/auth/lib/auth-validation"

export function SignUpForm() {
  const router = useRouter()

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: SignUpInput) => {
    try {
      const result = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (result.ok) {
        toast.success("Account created successfully")
        router.push("/sign-in")
      } else {
        const error = await result.json()
        toast.error(error.message || "Failed to create account")
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
            Start building
          </h1>
          <p className="text-base text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
            Create an account and skip the boilerplate
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            placeholder="Your name"
            autoComplete="name"
            {...form.register("name")}
            disabled={form.formState.isSubmitting}
          />
          {form.formState.errors.name && (
            <FieldDescription className="text-destructive">
              {form.formState.errors.name.message}
            </FieldDescription>
          )}
        </Field>
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
          <FieldLabel htmlFor="password">Password</FieldLabel>
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
            {form.formState.isSubmitting
              ? "Creating account..."
              : "Create account"}
          </Button>
        </Field>
        <FieldDescription className="text-center text-[oklch(0.55_0.008_165)] dark:text-[oklch(0.70_0.005_165)]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-[oklch(0.508_0.118_165.612)] underline-offset-4 transition-opacity hover:opacity-70"
          >
            Sign in
          </Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
