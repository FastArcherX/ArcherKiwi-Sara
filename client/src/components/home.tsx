import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteEditor } from "@/components/note-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, PlusCircle, Search, Sparkles } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: Date;
}

interface Folder {
  id: string;
  name: string;
}

export function Home() {
  // Mock data for demonstration - TODO: remove mock functionality
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Welcome to ArcherKiwi",
      content: "This is your first note! Start writing to experience the power of AI-enhanced note-taking.",
      createdAt: new Date(),
    },
    {
      id: "2",
      title: "Meeting Notes - Project Alpha",
      content: "<h2>Key Discussion Points</h2><ul><li>Budget allocation for Q2</li><li>Team member assignments</li><li>Deadline considerations</li></ul>",
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: "3", 
      title: "Research Ideas",
      content: "Exploring the intersection of AI and productivity tools. Voice notes integration could be a game-changer.",
      createdAt: new Date(Date.now() - 172800000),
    },
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: "work", name: "Work" },
    { id: "personal", name: "Personal" },
  ]);

  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  const handleNoteCreate = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);
    setIsEditorOpen(true);
  };

  const handleNoteSave = (noteData: { title: string; content: string; folderId?: string }) => {
    if (selectedNoteId) {
      setNotes(prev => prev.map(note =>
        note.id === selectedNoteId
          ? { ...note, ...noteData }
          : note
      ));
    }
    setIsEditorOpen(false);
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditorOpen(true);
  };

  const handleNoteDelete = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNoteId === noteId) {
      setSelectedNoteId(undefined);
      setIsEditorOpen(false);
    }
  };

  const handleFolderCreate = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  // Custom sidebar width for note-taking app
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (isEditorOpen && selectedNote) {
    return (
      <div className="h-screen">
        <NoteEditor
          note={selectedNote}
          onSave={handleNoteSave}
          onClose={() => setIsEditorOpen(false)}
        />
      </div>
    );
  }

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar
          notes={notes}
          folders={folders}
          selectedNoteId={selectedNoteId}
          searchQuery={searchQuery}
          onNoteSelect={handleNoteSelect}
          onNoteCreate={handleNoteCreate}
          onFolderCreate={handleFolderCreate}
          onSearchChange={setSearchQuery}
          onNoteDelete={handleNoteDelete}
        />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-hidden">
            {selectedNoteId ? (
              <div className="h-full p-8 overflow-auto">
                <Card className="h-full p-6">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                      {selectedNote?.title || "Untitled Note"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Click to start editing this note
                    </p>
                    <Button onClick={() => setIsEditorOpen(true)} data-testid="button-edit-note">
                      Edit Note
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full p-8 overflow-auto">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Welcome to ArcherKiwi</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                      Your intelligent note-taking companion with AI-powered features
                    </p>
                    <Button
                      size="lg"
                      onClick={handleNoteCreate}
                      data-testid="button-create-first-note"
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Create Your First Note
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="p-6 hover-elevate">
                      <div className="flex items-center mb-4">
                        <FileText className="w-8 h-8 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">Rich Text Editing</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Format your notes with bold, italic, headers, lists and more. Express your ideas with style.
                      </p>
                    </Card>

                    <Card className="p-6 hover-elevate">
                      <div className="flex items-center mb-4">
                        <Sparkles className="w-8 h-8 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">AI-Powered</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Get writing suggestions, summaries, and smart assistance to enhance your productivity.
                      </p>
                    </Card>

                    <Card className="p-6 hover-elevate">
                      <div className="flex items-center mb-4">
                        <Search className="w-8 h-8 text-primary mr-3" />
                        <h3 className="text-lg font-semibold">Smart Search</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Find any note instantly with powerful search across all your content and folders.
                      </p>
                    </Card>
                  </div>

                  {notes.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-semibold mb-6">Recent Notes</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {notes.slice(0, 6).map((note) => (
                          <Card
                            key={note.id}
                            className="p-4 cursor-pointer hover-elevate"
                            onClick={() => handleNoteSelect(note.id)}
                            data-testid={`note-card-${note.id}`}
                          >
                            <h3 className="font-semibold mb-2 truncate">
                              {note.title || "Untitled"}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {note.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {note.createdAt.toLocaleDateString()}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}