'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { setStoredGithubToken } from '@/lib/tokenStorage'

const githubTokenSchema = z.object({
  token: z
    .string()
    .min(1, 'Token is required.')
    .startsWith('ghp_', 'Token must start with ghp_'),
})

type GitHubTokenFormData = z.infer<typeof githubTokenSchema>

type AddGithubTokenDialogProps = {
  onSuccess: () => void
}

export default function AddGithubTokenDialog({
  onSuccess,
}: AddGithubTokenDialogProps) {
  const [isSaving, setIsSaving] = useState(false)

  const form = useForm({
    defaultValues: {
      token: '',
    } as GitHubTokenFormData,
    onSubmit: async ({ value }) => {
      try {
        setIsSaving(true)
        const trimmedToken = value.token.trim()
        setStoredGithubToken(trimmedToken)
        onSuccess()
      } catch (error) {
        console.error('Failed to store GitHub token', error)
      } finally {
        setIsSaving(false)
      }
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add GitHub token</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your GitHub token</DialogTitle>
          <DialogDescription>
            Raise your rate limit by using a personal access token. The token
            stays on your device and is never sent to our servers.{' '}
            <Link
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Learn how to create one.
            </Link>
          </DialogDescription>
        </DialogHeader>

        <form
          id="github-token-form"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="grid gap-4">
            <form.Field
              name="token"
              validators={{
                onSubmit: z
                  .string()
                  .min(1, 'Token is required.')
                  .startsWith(
                    'github_pat_',
                    'Token must start with github_pat_',
                  )
                  .length(93, 'Token must be 93 characters long'),
              }}
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="github-token">GitHub token</FieldLabel>
                    <Input
                      id="github-token"
                      type="password"
                      placeholder="github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                      autoComplete="off"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="github-token-form"
            disabled={isSaving || form.state.isSubmitting}
          >
            {isSaving || form.state.isSubmitting ? 'Saving…' : 'Save token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
