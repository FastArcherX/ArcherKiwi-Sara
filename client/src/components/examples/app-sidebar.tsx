import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppSidebarExample() {
  const [selectedNoteId, setSelectedNoteId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const mockNotes = [
    {
      id: "1",
      title: "Welcome Note",
      content: "Welcome to ArcherKiwi! This is your first note.",
      createdAt: new Date(),
    },
    {
      id: "2", 
      title: "Meeting Notes",
      content: "Important discussion points from today's meeting.",
      folderId: "work",
      createdAt: new Date(),
    },
    {
      id: "3",
      title: "Personal Ideas",
      content: "Random thoughts and creative ideas.",
      folderId: "personal", 
      createdAt: new Date(),
    },
  ];

  const mockFolders = [
    { id: "work", name: "Work" },
    { id: "personal", name: "Personal" },
  ];

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <ThemeProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-96 w-full border rounded-lg overflow-hidden">
          <AppSidebar
            notes={mockNotes}
            folders={mockFolders}
            selectedNoteId={selectedNoteId}
            searchQuery={searchQuery}
            onNoteSelect={(id) => {
              setSelectedNoteId(id);
              console.log('Note selected:', id);
            }}
            onNoteCreate={() => console.log('Create note triggered')}
            onFolderCreate={(name) => console.log('Create folder:', name)}
            onSearchChange={setSearchQuery}
            onNoteDelete={(id) => console.log('Delete note:', id)}
          />
          <div className="flex-1 p-4 bg-background">
            <p className="text-muted-foreground">
              Selected note ID: {selectedNoteId}
            </p>
            <p className="text-muted-foreground">
              Search query: "{searchQuery}"
            </p>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}