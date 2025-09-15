import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { EnhancedTextEditor } from "@/components/enhanced-text-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginDialog } from "@/components/auth/login-dialog";
import { AIPanel } from "@/components/ai-panel";
import { SettingsPage } from "@/components/settings-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { subscribeToNotes, subscribeToFolders, saveNote, deleteNote } from "@/lib/firebase";
import { useOptionalAuth } from "@/hooks/useOptionalAuth";
import {
  PlusCircle,
  Search,
  Sparkles,
  FileText,
  Mic,
  Video,
  Image as ImageIcon,
  Settings,
  Home as HomeIcon,
  ArrowRight,
  Brain,
  Zap,
  Shield,
  LogIn,
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface Folder {
  id: string;
  name: string;
}

export function EnhancedHome() {
  // Usa il hook sicuro per l'autenticazione opzionale
  const [user, loading] = useOptionalAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"home" | "editor" | "settings">("home");

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  // Mock data for non-authenticated users
  useEffect(() => {
    if (!user && !loading) {
      setNotes([
        {
          id: "demo1",
          title: "Benvenuto in ArcherKiwi! 🏹🥝",
          content: "<h2>La tua app di appunti intelligente</h2><p>Questa è una nota di benvenuto che ti mostra le potenzialità di ArcherKiwi. Puoi scrivere, formattare il testo e utilizzare l'<strong>intelligenza artificiale</strong> per migliorare i tuoi appunti.</p><h3>Funzionalità principali:</h3><ul><li>Editor di testo ricco con formattazione avanzata</li><li>Analisi AI di immagini, PDF e audio</li><li>Riassunti automatici delle note</li><li>Sincronizzazione cloud con Firebase</li></ul>",
          createdAt: new Date(),
        },
        {
          id: "demo2",
          title: "Idee per il Progetto Alpha",
          content: "<h2>Brainstorming Sessione</h2><p>Raccolta di idee innovative per il nuovo progetto:</p><ul><li><strong>Design UI/UX:</strong> Interfaccia pulita e intuitiva</li><li><strong>Funzionalità AI:</strong> Integrazione con GPT-5 per assistenza intelligente</li><li><strong>Mobile-first:</strong> Ottimizzazione per dispositivi mobili</li></ul><blockquote>Ricorda: l'innovazione nasce dalla semplicità</blockquote>",
          createdAt: new Date(Date.now() - 86400000),
        },
        {
          id: "demo3",
          title: "Ricerca: Tendenze Tecnologiche 2025",
          content: "<h2>Tendenze Emergenti</h2><p>Le tecnologie che stanno modellando il futuro:</p><ol><li><strong>AI Generativa:</strong> Modelli sempre più sofisticati</li><li><strong>Quantum Computing:</strong> Progressi nell'hardware quantistico</li><li><strong>Edge Computing:</strong> Elaborazione distribuita</li></ol><p><em>Fonte: Report Tech Insights 2025</em></p>",
          createdAt: new Date(Date.now() - 172800000),
          folderId: "research",
        },
      ]);
      
      setFolders([
        { id: "work", name: "Lavoro" },
        { id: "personal", name: "Personale" },
        { id: "research", name: "Ricerca" },
      ]);
    }
  }, [user, loading]);

  // Firebase subscriptions for authenticated users
  useEffect(() => {
    if (user) {
      const unsubscribeNotes = subscribeToNotes(user.uid, (firebaseNotes) => {
        const formattedNotes = firebaseNotes.map(note => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: note.updatedAt ? new Date(note.updatedAt) : undefined,
        }));
        setNotes(formattedNotes);
      });
      
      const unsubscribeFolders = subscribeToFolders(user.uid, setFolders);

      return () => {
        unsubscribeNotes();
        unsubscribeFolders();
      };
    }
  }, [user]);

  const handleNoteCreate = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "",
      content: "",
      createdAt: new Date(),
    };
    
    if (user) {
      saveNote(user.uid, newNote);
    } else {
      setNotes(prev => [newNote, ...prev]);
    }
    
    setSelectedNoteId(newNote.id);
    setCurrentView("editor");
  };

  const handleNoteSave = async (noteData: { title: string; content: string; folderId?: string }) => {
    if (selectedNoteId) {
      const updatedNote = {
        id: selectedNoteId,
        ...noteData,
        createdAt: selectedNote?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      if (user) {
        await saveNote(user.uid, updatedNote);
      } else {
        setNotes(prev => prev.map(note =>
          note.id === selectedNoteId ? updatedNote : note
        ));
      }
    }
    setCurrentView("home");
  };

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setCurrentView("editor");
  };

  const handleNoteDelete = async (noteId: string) => {
    if (user) {
      await deleteNote(user.uid, noteId);
    } else {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    }
    
    if (selectedNoteId === noteId) {
      setSelectedNoteId(undefined);
      setCurrentView("home");
    }
  };

  const handleFolderCreate = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
    };
    setFolders(prev => [...prev, newFolder]);
  };

  const handleAIResultInsert = (result: string) => {
    console.log("AI result to insert:", result);
    // TODO: Insert into current editor
  };

  // Navigation handlers
  const goHome = () => {
    setCurrentView("home");
    setSelectedNoteId(undefined);
  };

  const openSettings = () => {
    setCurrentView("settings");
  };

  // Custom sidebar width
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Caricamento ArcherKiwi...</p>
        </div>
      </div>
    );
  }

  // Settings View
  if (currentView === "settings") {
    return <SettingsPage onBack={goHome} />;
  }

  // Editor View
  if (currentView === "editor" && selectedNote) {
    return (
      <div className="h-screen">
        <EnhancedTextEditor
          note={selectedNote}
          onSave={handleNoteSave}
          onClose={goHome}
        />
        <AIPanel
          open={isAIPanelOpen}
          onOpenChange={setIsAIPanelOpen}
          onResultSelect={handleAIResultInsert}
          noteContent={selectedNote.content}
        />
      </div>
    );
  }

  // Main Home View
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full bg-background">
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
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <Button
                variant="ghost"
                size="sm"
                onClick={goHome}
                className="hover-elevate"
                data-testid="button-home"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAIPanelOpen(true)}
                className="hover-elevate"
                data-testid="button-ai-panel"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI
              </Button>
              
              {user ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openSettings}
                    className="hover-elevate"
                    data-testid="button-settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsLoginOpen(true)}
                    className="hover-elevate"
                    data-testid="button-login"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Accedi
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openSettings}
                    className="hover-elevate"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto p-8 space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
                <div className="space-y-4">
                  <Badge variant="secondary" className="mb-4 hover-elevate">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Powered by AI
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                    Benvenuto in{" "}
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      ArcherKiwi
                    </span>
                  </h1>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    La tua app di appunti intelligente con funzionalità AI avanzate. 
                    Scrivi, organizza e analizza i tuoi contenuti con l'aiuto dell'intelligenza artificiale.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={handleNoteCreate}
                    className="hover-elevate group"
                    data-testid="button-create-first-note"
                  >
                    <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                    Crea la Tua Prima Nota
                  </Button>
                  {!user && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsLoginOpen(true)}
                      className="hover-elevate"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Accedi per Sincronizzare
                    </Button>
                  )}
                </div>
              </div>

              {/* Features Section */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
                <Card className="hover-elevate group cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Editor Ricco</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      Formatta il testo con colori, font, dimensioni e stili avanzati per esprimere le tue idee.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover-elevate group cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">AI Avanzata</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      Analisi di foto, PDF, audio e video YouTube con riassunti automatici intelligenti.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover-elevate group cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Veloce & Fluido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      Interfaccia reattiva con animazioni fluide e sincronizzazione in tempo reale.
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="hover-elevate group cursor-pointer transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Sicuro & Privato</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center leading-relaxed">
                      I tuoi dati sono protetti con Firebase e crittografia avanzata.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>

              {/* AI Features Showcase */}
              <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 animate-in fade-in slide-in-from-bottom duration-700 delay-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl flex items-center justify-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Funzionalità AI
                  </CardTitle>
                  <CardDescription>
                    Scopri tutto quello che l'intelligenza artificiale può fare per le tue note
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-background rounded-lg mx-auto w-fit">
                        <ImageIcon className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium">Analisi Foto/PDF</h4>
                      <p className="text-sm text-muted-foreground">
                        Estrai testo e concetti da immagini e documenti
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-background rounded-lg mx-auto w-fit">
                        <Mic className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium">Audio Intelligente</h4>
                      <p className="text-sm text-muted-foreground">
                        Registra, trascrivi e analizza contenuti audio
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-background rounded-lg mx-auto w-fit">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium">YouTube Riassunti</h4>
                      <p className="text-sm text-muted-foreground">
                        Ottieni riassunti di video YouTube tramite link
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="p-3 bg-background rounded-lg mx-auto w-fit">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-medium">Smart Riassunti</h4>
                      <p className="text-sm text-muted-foreground">
                        Genera riassunti automatici delle tue note
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => setIsAIPanelOpen(true)}
                      className="hover-elevate group"
                    >
                      <Sparkles className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Prova le Funzioni AI
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Notes */}
              {notes.length > 0 && (
                <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-400">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Note Recenti</h2>
                    <Button
                      variant="ghost"
                      onClick={() => console.log("View all notes")}
                      className="hover-elevate"
                    >
                      Vedi Tutte
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.slice(0, 6).map((note) => (
                      <Card
                        key={note.id}
                        className="cursor-pointer hover-elevate transition-all duration-300 hover:scale-105 group"
                        onClick={() => handleNoteSelect(note.id)}
                        data-testid={`note-card-${note.id}`}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg truncate group-hover:text-primary transition-colors">
                            {note.title || "Nota Senza Titolo"}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {note.createdAt.toLocaleDateString('it-IT')} • {note.createdAt.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {note.content.replace(/<[^>]*>/g, '').substring(0, 120)}
                            {note.content.length > 120 ? '...' : ''}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Dialogs */}
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <AIPanel
        open={isAIPanelOpen}
        onOpenChange={setIsAIPanelOpen}
        onResultSelect={handleAIResultInsert}
        noteContent=""
      />
    </SidebarProvider>
  );
}