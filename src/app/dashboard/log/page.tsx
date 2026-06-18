import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logActivity } from "@/app/actions/activity"

export default function LogActivityPage() {
  return (
    <div className="flex-1 space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Log Activity</h1>
        <p className="text-foreground/70">Record your daily actions to calculate your footprint.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
          <CardDescription>Enter the details of your activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logActivity} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                name="category" 
                id="category" 
                required
                className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
                <option value="Electricity">Electricity</option>
                <option value="Shopping">Shopping</option>
                <option value="Waste">Waste</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity_name">Activity Name</Label>
              <Input id="activity_name" name="activity_name" placeholder="e.g., Passenger Car (Gasoline)" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" placeholder="e.g., 10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input id="unit" name="unit" placeholder="e.g., miles" required />
              </div>
            </div>

            <Button type="submit" className="w-full">Calculate & Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
