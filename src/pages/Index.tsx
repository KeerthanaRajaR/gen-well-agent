import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { parseCSV } from "@/utils/csvParser";
import { UserLogin } from "@/components/UserLogin";
import { ChatInterface } from "@/components/ChatInterface";
import { HealthDashboard } from "@/components/HealthDashboard";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetch('/src/data/Users.csv');
        const csvText = await response.text();
        const parsedUsers = await parseCSV(csvText);
        setUsers(parsedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-wellness flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Healthcare AI...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <UserLogin users={users} onLogin={setCurrentUser} />;
  }

  return (
    <div className="min-h-screen gradient-wellness">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent gradient-primary bg-gradient-to-r from-primary to-primary-glow">
                HealthCare AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {currentUser.first_name} {currentUser.last_name}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 shadow-md">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <HealthDashboard user={currentUser} />
          </TabsContent>

          <TabsContent value="chat">
            <div className="max-w-4xl mx-auto">
              <ChatInterface user={currentUser} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
