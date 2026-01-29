"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { registerUser } from "@/services/auth"
import { SuccessToast, ErrorToast } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  phone: z.string().min(11, {
    message: "Please enter a valid phone number (at least 11 digits).",
  }),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    try {
      const result = await registerUser(data)
      
      if (result?.success) {
        SuccessToast("Registration successful! Please login to continue.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 1500)
      } else {
        ErrorToast(result?.message || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration failed:", error)
      ErrorToast("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Join Smart Surveyor to manage your survey data efficiently
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="John Doe"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="name@example.com"
                            type="email"
                            className="pl-10"
                            {...field}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="+8801700000000"
                            className="pl-10"
                            {...field}
                        />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Create a strong password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4" loading={isLoading} loadingText="Creating Account...">
              Sign Up
            </Button>
            <div className="text-center text-sm text-muted-foreground mt-4">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Sign In
                </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
