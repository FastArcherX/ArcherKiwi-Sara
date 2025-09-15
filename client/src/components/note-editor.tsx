import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Mic,
  Save,
  X,
  Sparkles,
} from "lucide-react";

// Declare webkitSpeechRecognition for TypeScript
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface NoteEditorProps {
  note?: {
    id: string;
    title: string;
    content: string;
    folderId?: string;
  };
  onSave: (note: { title: string; content: string; folderId?: string }) => void;
  onClose: () => void;
}

export function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isListening, setIsListening] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setContent(prev => prev + ' ' + transcript);
        setHasUnsavedChanges(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSpeechToText = () => {
    if (!recognition.current) {
      alert('Speech recognition is not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.current.stop();
      setIsListening(false);
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };

  const applyFormat = (command: string, value?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = () => {
    onSave({
      title: title || "Untitled Note",
      content,
      folderId: note?.folderId,
    });
    setHasUnsavedChanges(false);
  };

  const handleAIAssist = () => {
    // AI assistance placeholder - would integrate with OpenAI
    console.log('AI assist triggered for content:', content);
    // TODO: Implement AI writing assistance
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Note title..."
            className="text-2xl font-semibold border-none p-0 focus-visible:ring-0"
            data-testid="input-note-title"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIAssist}
              data-testid="button-ai-assist"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              data-testid="button-save-note"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-editor"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            data-testid="button-format-bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            data-testid="button-format-italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            data-testid="button-format-underline"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'h1')}
            data-testid="button-format-h1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'h2')}
            data-testid="button-format-h2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('insertUnorderedList')}
            data-testid="button-format-list"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('insertOrderedList')}
            data-testid="button-format-ordered-list"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            onClick={handleSpeechToText}
            data-testid="button-speech-to-text"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div
          ref={editorRef}
          contentEditable
          className="min-h-full w-full focus:outline-none prose prose-lg max-w-none"
          style={{ whiteSpace: 'pre-wrap' }}
          onInput={(e) => {
            setContent(e.currentTarget.textContent || '');
            setHasUnsavedChanges(true);
          }}
          data-placeholder="Start writing your note..."
          data-testid="editor-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {hasUnsavedChanges && (
        <div className="border-t p-2 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            You have unsaved changes
          </p>
        </div>
      )}
    </div>
  );
}