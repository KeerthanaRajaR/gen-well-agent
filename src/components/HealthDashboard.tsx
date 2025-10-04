import { useState } from "react";
import { User, CGMReading, MoodEntry } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Activity, Brain, Utensils, TrendingUp, Sparkles, Send } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface HealthDashboardProps {
  user: User;
  cgmHistory?: CGMReading[];
  moodHistory?: MoodEntry[];
}

export const HealthDashboard = ({ user, cgmHistory, moodHistory }: HealthDashboardProps) => {
  const { toast } = useToast();
  const [foodLog, setFoodLog] = useState("");
  const [isGeneratingMealPlan, setIsGeneratingMealPlan] = useState(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<Array<{
    meal: string;
    time: string;
    description: string;
    macros: { carbs: number; protein: number; fat: number; calories: number };
  }> | null>(null);

  // Mock data for demonstration
  const mockCGMData = cgmHistory || Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    value: Math.floor(Math.random() * 100) + 80
  }));

  const mockMoodData = moodHistory || Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000),
    mood: ["Happy", "Excited", "Neutral", "Tired", "Stressed"][Math.floor(Math.random() * 5)]
  }));

  const cgmChartData = mockCGMData.map(reading => ({
    date: reading.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    glucose: reading.value
  }));

  const moodValues: Record<string, number> = {
    "Happy": 5, "Excited": 5, "Neutral": 3, "Tired": 2, "Stressed": 2, "Anxious": 1
  };

  const moodChartData = mockMoodData.map(entry => ({
    date: entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: moodValues[entry.mood] || 3,
    label: entry.mood
  }));

  const getGlucoseStatus = (value: number) => {
    if (value < 80) return { text: "Low", color: "text-destructive" };
    if (value > 180) return { text: "High", color: "text-accent" };
    return { text: "Normal", color: "text-secondary" };
  };

  const status = getGlucoseStatus(user.latest_cgm);

  const handleLogFood = () => {
    if (!foodLog.trim()) {
      toast({
        title: "Error",
        description: "Please enter food details before logging.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would call the Food Intake Agent
    toast({
      title: "Food Logged",
      description: `Logged: ${foodLog}`,
    });
    setFoodLog("");
  };

  const handleGenerateMealPlan = () => {
    setIsGeneratingMealPlan(true);
    
    // Simulate API call to Meal Planner Agent
    setTimeout(() => {
      // Generate mock meal plan based on user's dietary preference
      const mealPlans = {
        vegetarian: [
          {
            meal: "Breakfast",
            time: "8:00 AM",
            description: "Oatmeal with berries, almonds, and Greek yogurt",
            macros: { carbs: 45, protein: 15, fat: 12, calories: 350 }
          },
          {
            meal: "Lunch",
            time: "1:00 PM",
            description: "Quinoa Buddha bowl with roasted vegetables, chickpeas, and tahini dressing",
            macros: { carbs: 52, protein: 18, fat: 16, calories: 420 }
          },
          {
            meal: "Dinner",
            time: "7:00 PM",
            description: "Lentil curry with brown rice and steamed broccoli",
            macros: { carbs: 58, protein: 20, fat: 10, calories: 400 }
          }
        ],
        vegan: [
          {
            meal: "Breakfast",
            time: "8:00 AM",
            description: "Smoothie bowl with banana, spinach, chia seeds, and plant-based protein",
            macros: { carbs: 48, protein: 20, fat: 14, calories: 380 }
          },
          {
            meal: "Lunch",
            time: "1:00 PM",
            description: "Tofu stir-fry with mixed vegetables and quinoa",
            macros: { carbs: 50, protein: 22, fat: 15, calories: 410 }
          },
          {
            meal: "Dinner",
            time: "7:00 PM",
            description: "Black bean tacos with avocado, salsa, and corn tortillas",
            macros: { carbs: 55, protein: 18, fat: 16, calories: 425 }
          }
        ],
        "non-vegetarian": [
          {
            meal: "Breakfast",
            time: "8:00 AM",
            description: "Scrambled eggs with whole wheat toast and avocado",
            macros: { carbs: 35, protein: 25, fat: 18, calories: 400 }
          },
          {
            meal: "Lunch",
            time: "1:00 PM",
            description: "Grilled chicken breast with sweet potato and green beans",
            macros: { carbs: 45, protein: 35, fat: 12, calories: 440 }
          },
          {
            meal: "Dinner",
            time: "7:00 PM",
            description: "Baked salmon with quinoa and roasted asparagus",
            macros: { carbs: 42, protein: 38, fat: 20, calories: 500 }
          }
        ]
      };

      const selectedPlan = mealPlans[user.dietary_preference as keyof typeof mealPlans] || mealPlans["non-vegetarian"];
      setGeneratedMealPlan(selectedPlan);
      
      toast({
        title: "Meal Plan Generated",
        description: `Personalized meal plan created for ${user.first_name} based on ${user.dietary_preference} diet and glucose level of ${user.latest_cgm} mg/dL.`,
      });
      setIsGeneratingMealPlan(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Glucose</p>
              <p className="text-2xl font-bold">{user.latest_cgm}</p>
              <p className={`text-xs font-medium ${status.color}`}>{status.text}</p>
            </div>
            <Activity className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Mood</p>
              <p className="text-2xl font-bold">{user.mood}</p>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <Brain className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Diet Type</p>
              <p className="text-xl font-semibold capitalize">{user.dietary_preference}</p>
              <p className="text-xs text-muted-foreground">Preference</p>
            </div>
            <Utensils className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Health Status</p>
              <p className="text-xl font-semibold">Tracking</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Glucose Readings (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={cgmChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                domain={[60, 300]} 
                fontSize={12}
                label={{ value: 'Glucose (mg/dL)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="glucose" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            Mood Trends (7 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={moodChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                domain={[0, 5]} 
                fontSize={12}
                label={{ value: 'Mood Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card p-3 rounded-lg border shadow-lg">
                        <p className="font-medium">{payload[0].payload.label}</p>
                        <p className="text-sm text-muted-foreground">{payload[0].payload.date}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="mood" 
                fill="hsl(var(--secondary))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log Food Form */}
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-accent" />
            Log Food Intake
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="food-log">What did you eat?</Label>
              <Textarea
                id="food-log"
                placeholder="e.g., Grilled chicken breast with quinoa and steamed vegetables"
                value={foodLog}
                onChange={(e) => setFoodLog(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>
            <Button 
              onClick={handleLogFood}
              className="w-full gap-2"
            >
              <Send className="w-4 h-4" />
              Log Food
            </Button>
          </div>
        </Card>

        {/* Meal Plan Generator */}
        <Card className="p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Meal Planner
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate a personalized meal plan based on your health profile, current glucose levels, and dietary preferences.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diet Type:</span>
                <span className="font-medium capitalize">{user.dietary_preference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Glucose:</span>
                <span className="font-medium">{user.latest_cgm} mg/dL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Current Mood:</span>
                <span className="font-medium">{user.mood}</span>
              </div>
            </div>
            <Button 
              onClick={handleGenerateMealPlan}
              disabled={isGeneratingMealPlan}
              className="w-full gap-2"
              size="lg"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingMealPlan ? "Generating..." : "Generate Meal Plan"}
            </Button>

            {/* Display Generated Meal Plan */}
            {generatedMealPlan && (
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-sm">Your Personalized Meal Plan</h4>
                {generatedMealPlan.map((meal, index) => (
                  <Card key={index} className="p-4 bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-semibold">{meal.meal}</h5>
                        <p className="text-xs text-muted-foreground">{meal.time}</p>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{meal.description}</p>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <p className="font-medium text-primary">{meal.macros.carbs}g</p>
                        <p className="text-muted-foreground">Carbs</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-secondary">{meal.macros.protein}g</p>
                        <p className="text-muted-foreground">Protein</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-accent">{meal.macros.fat}g</p>
                        <p className="text-muted-foreground">Fat</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{meal.macros.calories}</p>
                        <p className="text-muted-foreground">Calories</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* User Info */}
      <Card className="p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Health Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Medical Conditions</p>
            <p className="font-medium">{user.medical_conditions}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Physical Limitations</p>
            <p className="font-medium">{user.physical_limitations}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{user.city}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{user.user_id}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
