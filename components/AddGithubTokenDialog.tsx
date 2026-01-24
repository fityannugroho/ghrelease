'use client'

import { useForm } from '@tanstack/react-form'
import Link from 'next/link'
import { useId, useState } from 'react'
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
    .nonempty('Token is required.')
    .refine(
      (token) => token.startsWith('github_pat_') || token.startsWith('ghp_'),
      'Token must start with github_pat_ or ghp_',
    ),
})

export type AddGithubTokenDialogProps = {
  onSuccess?: () => void
  onError?: (error: unknown) => void
}

export default function AddGithubTokenDialog({
  onSuccess,
  onError,
}: AddGithubTokenDialogProps) {
  const [open, setOpen] = useState(false)
  const [rememberToken, setRememberToken] = useState(false)
  const rememberId = useId()

  const form = useForm({
    defaultValues: {
      token: '',
    },
    validators: {
      onSubmit: githubTokenSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const trimmedToken = value.token.trim()
        setStoredGithubToken(trimmedToken, {
          persist: rememberToken ? 'local' : 'session',
        })
        form.reset()
        setRememberToken(false)
        setOpen(false)
        onSuccess?.()
      } catch (error) {
        onError?.(error)
      }
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          form.reset()
          setRememberToken(false)
        }
      }}
    >
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
              href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Learn how to create one.
            </Link>
            <span className="block text-xs text-muted-foreground mt-2">
              By default, the token is stored for this browser session. You can
              opt in to remember it longer on this device.
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          id="github-token-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <div className="grid gap-4">
            <form.Field
              name="token"
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
                      placeholder="xxxxxxxxxxxxxxx"
                      autoComplete="off"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        id={rememberId}
                        type="checkbox"
                        checked={rememberToken}
                        onChange={(event) =>
                          setRememberToken(event.target.checked)
                        }
                        className="h-4 w-4"
                      />
                      <label htmlFor={rememberId} className="text-xs">
                        Remember token on this device
                      </label>
                    </div>
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
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? 'Saving…' : 'Save token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
