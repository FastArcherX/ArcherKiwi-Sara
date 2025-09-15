import { ThemeProvider } from "@/components/theme-provider";
import { NoteEditor } from "@/components/note-editor";
import { useState } from "react";

export default function NoteEditorExample() {
  const [isOpen, setIsOpen] = useState(true);

  const sampleNote = {
    id: "sample",
    title: "Sample Note",
    content: "This is a sample note with some <b>bold</b> text and <i>italics</i>. You can format text using the toolbar above.",
    folderId: "personal",
  };

  const handleSave = (noteData: { title: string; content: string; folderId?: string }) => {
    console.log('Note saved:', noteData);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <ThemeProvider>
        <div className="p-4 text-center">
          <p>Note saved! Check the console for saved data.</p>
          <button onClick={() => setIsOpen(true)} className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded">
            Open Editor Again
          </button>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen">
        <NoteEditor
          note={sampleNote}
          onSave={handleSave}
          onClose={() => setIsOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}