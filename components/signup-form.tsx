import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/auth-store"
import { signupSchema, type SignupFormData } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export function SignupForm(props: React.ComponentPropsWithoutRef<"div">) {
  const { className, ...rest } = props
  const { signup, googleLogin, loading, token, error, clearError } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  useEffect(() => {
    if (token) {
      router.replace("/dashboard")
    }
  }, [token, router])

  useEffect(() => {
    // Clear any previous errors when component mounts
    clearError()
  }, [clearError])

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName
      })
      reset()
    } catch {
      // Error handling is done in the auth store
    }
  }

  const handleGoogleSignup = async () => {
    try {
      await googleLogin()
    } catch {
      // Error handling is done in the auth store
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...rest}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button variant="outline" className="w-full" type="button" disabled={loading} onClick={handleGoogleSignup}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></span>
                      Signing up with Google...
                    </span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 mr-2">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Sign up with Google
                    </>
                  )}
                </Button>
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with email
                </span>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      disabled={loading || isSubmitting}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      disabled={loading || isSubmitting}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email")}
                    disabled={loading || isSubmitting}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    {...register("password")}
                    disabled={loading || isSubmitting}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    {...register("confirmPassword")}
                    disabled={loading || isSubmitting}
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={loading || isSubmitting}>
                  {loading || isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></span>
                      Creating account...
                    </span>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
      </div>
    </div>
  )
}