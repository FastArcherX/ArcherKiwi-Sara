import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  FolderPlus,
  Search,
  FileText,
  Folder,
  Settings,
  Trash2,
} from "lucide-react";

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

interface AppSidebarProps {
  notes: Note[];
  folders: Folder[];
  selectedNoteId?: string;
  searchQuery: string;
  onNoteSelect: (noteId: string) => void;
  onNoteCreate: () => void;
  onFolderCreate: (name: string) => void;
  onSearchChange: (query: string) => void;
  onNoteDelete: (noteId: string) => void;
}

export function AppSidebar({
  notes,
  folders,
  selectedNoteId,
  searchQuery,
  onNoteSelect,
  onNoteCreate,
  onFolderCreate,
  onSearchChange,
  onNoteDelete,
}: AppSidebarProps) {
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate(newFolderName.trim());
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const notesInFolder = (folderId?: string) =>
    filteredNotes.filter(note => note.folderId === folderId);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">ArcherKiwi</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNoteCreate}
              data-testid="button-create-note"
            >
              <PlusCircle className="w-4 h-4" />
            </Button>
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-create-folder"
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name..."
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                    data-testid="input-folder-name"
                  />
                  <Button onClick={handleCreateFolder} data-testid="button-confirm-create-folder">
                    Create
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notes..."
            className="pl-9"
            data-testid="input-search-notes"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* All Notes */}
        <SidebarGroup>
          <SidebarGroupLabel>All Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {notesInFolder().map((note) => (
                <SidebarMenuItem key={note.id}>
                  <SidebarMenuButton
                    onClick={() => onNoteSelect(note.id)}
                    isActive={selectedNoteId === note.id}
                    className="group"
                    data-testid={`note-item-${note.id}`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{note.title || "Untitled"}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 ml-auto h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNoteDelete(note.id);
                      }}
                      data-testid={`button-delete-note-${note.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Folders */}
        {folders.map((folder) => (
          <SidebarGroup key={folder.id}>
            <SidebarGroupLabel>
              <Folder className="w-4 h-4 mr-2" />
              {folder.name}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {notesInFolder(folder.id).map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <SidebarMenuButton
                      onClick={() => onNoteSelect(note.id)}
                      isActive={selectedNoteId === note.id}
                      className="group"
                      data-testid={`folder-note-item-${note.id}`}
                    >
                      <FileText className="w-4 h-4" />
                      <span className="truncate">{note.title || "Untitled"}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 ml-auto h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNoteDelete(note.id);
                        }}
                        data-testid={`button-delete-folder-note-${note.id}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Settings */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton data-testid="button-settings">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}