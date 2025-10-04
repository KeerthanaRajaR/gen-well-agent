import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { User } from "@/types/user";
import { Activity } from "lucide-react";

interface UserLoginProps {
  users: User[];
  onLogin: (user: User) => void;
}

export const UserLogin = ({ users, onLogin }: UserLoginProps) => {
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const id = parseInt(userId, 10);
    const user = users.find(u => u.user_id === id);
    
    if (!user) {
      setError("Invalid User ID. Please enter a valid ID between 1001-1100.");
      return;
    }
    
    setError("");
    onLogin(user);
  };

  return (
    <div className="min-h-screen gradient-wellness flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent gradient-primary bg-gradient-to-r from-primary to-primary-glow">
            HealthCare AI
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Your personalized health companion
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Enter Your User ID
            </label>
            <Input
              type="number"
              placeholder="e.g., 1001"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="text-lg"
            />
            {error && (
              <p className="text-destructive text-sm mt-2">{error}</p>
            )}
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
            size="lg"
          >
            Sign In
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Valid User IDs: 1001 - 1100
          </p>
        </div>
      </Card>
    </div>
  );
};
