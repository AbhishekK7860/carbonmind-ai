import { login, signup, signInWithGoogle } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold text-primary">CarbonMind AI</h1>
      </div>
      
      <Card className="w-full max-w-md shadow-lg glass">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-foreground/70">
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {resolvedParams?.error && (
            <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md border border-red-500/20 text-center">
              {resolvedParams.error}
            </div>
          )}
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                className="bg-surface"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-surface"
              />
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              <Button formAction={login} className="w-full">
                Sign In
              </Button>
              <Button formAction={signup} variant="outline" className="w-full">
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface px-2 text-foreground/70">
                Or continue with
              </span>
            </div>
          </div>
          
          <form>
            <Button formAction={signInWithGoogle} variant="outline" className="w-full text-foreground/80">
              <svg aria-hidden="true" role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
              Google
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center flex-col gap-4 border-t border-border/50 pt-4">
          <p className="text-sm text-foreground/70 text-center">
            Just looking around? Try the fully populated demo.
          </p>
          <Link href="/demo/dashboard" className="w-full">
            <Button variant="secondary" className="w-full">
              Try Demo Mode
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
