import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

function App() {
  const [name, setName] = useState('')
  const [count, setCount] = useState(0)

  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Your App</h1>
          <p className="text-muted-foreground mt-2">
            Built with Vite, React, TypeScript, Tailwind CSS, and Shadcn UI
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Counter Example</CardTitle>
              <CardDescription>Test the button component</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-2xl font-semibold">Count: {count}</p>
              <div className="flex gap-2">
                <Button onClick={() => setCount(count + 1)}>Increment</Button>
                <Button variant="outline" onClick={() => setCount(count - 1)}>
                  Decrement
                </Button>
                <Button variant="destructive" onClick={() => setCount(0)}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Example</CardTitle>
              <CardDescription>Test the input component</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                {name && <p className="text-muted-foreground text-sm">Hello, {name}!</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" onClick={() => setName('')}>
                Clear
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>All available button styles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-muted/50 text-muted-foreground rounded-lg border p-4 text-center text-sm">
          Edit <code className="bg-muted rounded px-2 py-1">src/App.tsx</code> to get started
        </div>
      </div>
    </div>
  )
}

export default App
