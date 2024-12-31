import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { FileText, Image, Video, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActionCard = ({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: any;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <div className="glass p-6 rounded-xl">
    <Icon className="h-8 w-8 mb-4 text-primary" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">{description}</p>
    <Button className="w-full" onClick={onClick}>
      Get Started
    </Button>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 animate-fadeIn">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome back!</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QuickActionCard
                icon={FileText}
                title="Generate Content"
                description="Create engaging posts for your social media platforms"
                onClick={() => navigate('/content')}
              />
              <QuickActionCard
                icon={Image}
                title="Create Images"
                description="Generate unique images using AI technology"
                onClick={() => navigate('/images')}
              />
              <QuickActionCard
                icon={Video}
                title="Make Videos"
                description="Produce professional videos with AI assistance"
                onClick={() => navigate('/videos')}
              />
              <QuickActionCard
                icon={Calendar}
                title="Schedule Post"
                description="Plan and schedule your content calendar"
                onClick={() => navigate('/schedule')}
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
            <div className="glass rounded-xl p-6">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;