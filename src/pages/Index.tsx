import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Blank App</h1>
        <p className="text-xl text-muted-foreground mb-8">Start building your amazing project here!</p>
        <Link to="/security-dashboard">
          <Button className="gap-2">
            <Shield className="h-4 w-4" />
            View Security Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
