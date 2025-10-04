import { User, CGMReading, MoodEntry } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Activity, Brain, Utensils, TrendingUp } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface HealthDashboardProps {
  user: User;
  cgmHistory?: CGMReading[];
  moodHistory?: MoodEntry[];
}

export const HealthDashboard = ({ user, cgmHistory, moodHistory }: HealthDashboardProps) => {
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
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[60, 300]} fontSize={12} />
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
              <XAxis dataKey="date" fontSize={12} />
              <YAxis domain={[0, 5]} fontSize={12} />
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
