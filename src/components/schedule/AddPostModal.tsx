
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AddPostModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] text-white">
        <DialogHeader>
          <DialogTitle className="text-white">Schedule New Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-[#E0E0E0]">Title</Label>
            <Input id="title" placeholder="Enter post title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-[#E0E0E0]">Content</Label>
            <Textarea id="content" placeholder="Write your post content..." className="text-white placeholder:text-[#B0B0B0]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="platform" className="text-[#E0E0E0]">Platform</Label>
            <Select>
              <SelectTrigger className="text-white">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur-sm">
                <SelectItem value="linkedin" className="text-white">LinkedIn</SelectItem>
                <SelectItem value="twitter" className="text-white">Twitter</SelectItem>
                <SelectItem value="instagram" className="text-white">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date" className="text-[#E0E0E0]">Schedule Date</Label>
            <Input id="date" type="datetime-local" />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <DialogTrigger asChild>
            <Button variant="outline" className="text-white">Cancel</Button>
          </DialogTrigger>
          <Button className="text-white">Schedule Post</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
