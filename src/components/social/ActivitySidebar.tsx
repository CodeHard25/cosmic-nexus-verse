
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ActivitySidebar = () => {
  return (
    <div className="lg:col-span-1">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <h3 className="text-white font-semibold">Recent Activity</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm">
            <p className="text-white/70">
              Welcome to UniVerse! Start connecting with others.
            </p>
            <p className="text-white/50 text-xs">Just now</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitySidebar;
