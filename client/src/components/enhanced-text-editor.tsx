import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Palette,
  Highlighter,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Save,
  X,
  Sparkles,
  Mic,
} from "lucide-react";

interface EnhancedTextEditorProps {
  note?: {
    id: string;
    title: string;
    content: string;
    folderId?: string;
  };
  onSave: (note: { title: string; content: string; folderId?: string }) => void;
  onClose: () => void;
}

const COLORS = [
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
  '#FF0000', '#FF6600', '#FFCC00', '#33FF00', '#00CCFF', '#0066FF',
  '#6600FF', '#FF00CC', '#FF3366', '#66FF33', '#33CCFF', '#CC33FF'
];

const HIGHLIGHT_COLORS = [
  '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFB6C1', '#FFA500',
  '#98FB98', '#87CEEB', '#DDA0DD', '#F0E68C'
];

export function EnhancedTextEditor({ note, onSave, onClose }: EnhancedTextEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState("16");
  const [selectedFontFamily, setSelectedFontFamily] = useState("Inter");
  const editorRef = useRef<HTMLDivElement>(null);
  const recognition = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'it-IT';

      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        if (editorRef.current) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(' ' + transcript));
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        setHasUnsavedChanges(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleSpeechToText = () => {
    if (!recognition.current) {
      alert('Il riconoscimento vocale non è supportato in questo browser');
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

  const applyColor = (color: string) => {
    applyFormat('foreColor', color);
  };

  const applyHighlight = (color: string) => {
    applyFormat('backColor', color);
  };

  const applyFontSize = (size: string) => {
    applyFormat('fontSize', size);
    setSelectedFontSize(size);
  };

  const applyFontFamily = (family: string) => {
    applyFormat('fontName', family);
    setSelectedFontFamily(family);
  };

  const insertLink = () => {
    const url = prompt('Inserisci URL:');
    if (url) {
      applyFormat('createLink', url);
    }
  };

  const handleSave = () => {
    onSave({
      title: title || "Nota Senza Titolo",
      content: editorRef.current?.innerHTML || content,
      folderId: note?.folderId,
    });
    setHasUnsavedChanges(false);
  };

  const handleAIAssist = () => {
    console.log('AI assist triggered for content:', editorRef.current?.innerHTML);
    // TODO: Implement AI writing assistance
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300">
      <div className="border-b p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setHasUnsavedChanges(true);
            }}
            placeholder="Titolo della nota..."
            className="text-2xl font-semibold border-none p-0 focus-visible:ring-0"
            data-testid="input-note-title"
          />
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAIAssist}
              className="hover-elevate"
              data-testid="button-ai-assist"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="hover-elevate"
              data-testid="button-save-note"
            >
              <Save className="w-4 h-4 mr-2" />
              Salva
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

        {/* Font Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={selectedFontFamily} onValueChange={applyFontFamily}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times</SelectItem>
              <SelectItem value="Courier New">Courier</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedFontSize} onValueChange={applyFontSize}>
            <SelectTrigger className="w-16">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="16">16</SelectItem>
              <SelectItem value="18">18</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="32">32</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format Controls */}
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            className="hover-elevate"
            data-testid="button-format-bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            className="hover-elevate"
            data-testid="button-format-italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            className="hover-elevate"
            data-testid="button-format-underline"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('strikeThrough')}
            className="hover-elevate"
            data-testid="button-format-strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hover-elevate">
                <Palette className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="grid grid-cols-6 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-border hover-elevate"
                    style={{ backgroundColor: color }}
                    onClick={() => applyColor(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="hover-elevate">
                <Highlighter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid grid-cols-5 gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-border hover-elevate"
                    style={{ backgroundColor: color }}
                    onClick={() => applyHighlight(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'h1')}
            className="hover-elevate"
            data-testid="button-format-h1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'h2')}
            className="hover-elevate"
            data-testid="button-format-h2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'h3')}
            className="hover-elevate"
            data-testid="button-format-h3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('insertUnorderedList')}
            className="hover-elevate"
            data-testid="button-format-list"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('insertOrderedList')}
            className="hover-elevate"
            data-testid="button-format-ordered-list"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'blockquote')}
            className="hover-elevate"
            data-testid="button-format-quote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('formatBlock', 'pre')}
            className="hover-elevate"
            data-testid="button-format-code"
          >
            <Code className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('justifyLeft')}
            className="hover-elevate"
          >
            <AlignLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('justifyCenter')}
            className="hover-elevate"
          >
            <AlignCenter className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('justifyRight')}
            className="hover-elevate"
          >
            <AlignRight className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="hover-elevate"
            data-testid="button-insert-link"
          >
            <Link className="w-4 h-4" />
          </Button>

          <Button
            variant={isListening ? "destructive" : "ghost"}
            size="sm"
            onClick={handleSpeechToText}
            className="hover-elevate"
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
          className="min-h-full w-full focus:outline-none text-foreground text-base leading-relaxed"
          style={{ 
            whiteSpace: 'pre-wrap',
            fontFamily: selectedFontFamily,
            fontSize: `${selectedFontSize}px`
          }}
          onInput={(e) => {
            setContent(e.currentTarget.innerHTML || '');
            setHasUnsavedChanges(true);
          }}
          data-placeholder="Inizia a scrivere la tua nota..."
          data-testid="editor-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>

      {hasUnsavedChanges && (
        <div className="border-t p-2 bg-muted/50 animate-in slide-in-from-bottom duration-200">
          <p className="text-sm text-muted-foreground text-center">
            Hai modifiche non salvate
          </p>
        </div>
      )}
    </div>
  );
}