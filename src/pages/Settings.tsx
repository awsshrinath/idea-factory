
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/components/ui/use-toast';
=======

import { Sidebar } from "@/components/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangelogSection } from "@/components/settings/ChangelogSection";
import { RoadmapSection } from "@/components/settings/RoadmapSection";
import { WorkflowsSection } from "@/components/settings/WorkflowsSection";
import { TechStackSection } from "@/components/settings/TechStackSection";
import { MultimediaPremiumBackground } from "@/components/ui/multimedia-premium-background";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";


export function Settings() {
  const { profile, loading, error, updateProfile } = useProfile();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setUsername(profile.username || '');
    }

  }, [profile]);

  };

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden w-full relative">
      <MultimediaPremiumBackground />
      <Sidebar />
      <main className={cn(
        "flex-1 animate-fadeIn w-full max-w-full pb-20 relative z-10",
        "p-6 md:p-8 lg:p-10",
        isMobile ? "ml-0 pt-20" : "ml-64 pl-8", 
      )}>
        <div className="max-w-5xl mx-auto">
          <h1 className={cn(
            "text-4xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
            isMobile && "text-2xl text-center"
          )}>
            Settings & Documentation
          </h1>
          
          <Tabs defaultValue="changelog" className="w-full">
            <TabsList className={cn(
              "mb-4 bg-card border border-white/10",
              isMobile && "flex flex-wrap overflow-x-auto max-w-full"
            )}>
              <TabsTrigger 
                value="changelog"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Changelog
              </TabsTrigger>
              <TabsTrigger 
                value="roadmap"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Roadmap
              </TabsTrigger>
              <TabsTrigger 
                value="workflows"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Workflows
              </TabsTrigger>
              <TabsTrigger 
                value="tech"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                Tech
              </TabsTrigger>
              <TabsTrigger 
                value="integrations"
                className={cn(
                  "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
                  isMobile && "flex-1 min-w-[32%] py-3"
                )}
              >
                API
              </TabsTrigger>
            </TabsList>

            <TabsContent value="changelog">
              <ChangelogSection />
            </TabsContent>


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, username });
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading profile: {(error as Error).message}</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Manage your profile settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
