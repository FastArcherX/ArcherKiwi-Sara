import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sparkles,
  Upload,
  FileText,
  Mic,
  Video,
  Image as ImageIcon,
  Loader2,
  Copy,
  CheckCircle,
} from "lucide-react";
import { aiApi, type AIAnalysisResult } from "@/lib/api-client";

interface AIPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResultSelect: (result: string) => void;
  noteContent?: string;
}

export function AIPanel({ open, onOpenChange, onResultSelect, noteContent }: AIPanelProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "youtube" | "summarize">("upload");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      let analysisResult: AIAnalysisResult;
      
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      if (file.type.startsWith('image/')) {
        analysisResult = await aiApi.analyzeImage(file);
      } else if (file.type === 'application/pdf') {
        analysisResult = await aiApi.analyzePDF(file);
      } else if (file.type.startsWith('audio/')) {
        analysisResult = await aiApi.analyzeAudio(file);
      } else {
        throw new Error("Tipo di file non supportato");
      }

      clearInterval(progressInterval);
      setProgress(100);
      setResult(analysisResult);
    } catch (error) {
      console.error("Errore analisi file:", error);
      setResult({
        summary: "Errore durante l'analisi del file",
        keyPoints: [],
        confidence: 0,
        type: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleYouTubeAnalysis = async () => {
    if (!youtubeUrl.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      const analysisResult = await aiApi.analyzeYouTube(youtubeUrl);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(analysisResult);
    } catch (error) {
      console.error("Errore analisi YouTube:", error);
      setResult({
        summary: "Errore durante l'analisi del video YouTube",
        keyPoints: [],
        confidence: 0,
        type: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNoteSummary = async () => {
    if (!noteContent?.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setResult(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 150);

      const analysisResult = await aiApi.summarizeNote(noteContent);
      
      clearInterval(progressInterval);
      setProgress(100);
      setResult(analysisResult);
    } catch (error) {
      console.error("Errore riassunto nota:", error);
      setResult({
        summary: "Errore durante il riassunto della nota",
        keyPoints: [],
        confidence: 0,
        type: "error"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' });
        
        setIsAnalyzing(true);
        try {
          const analysisResult = await aiApi.analyzeAudio(audioFile);
          setResult(analysisResult);
        } catch (error) {
          console.error("Audio analysis error:", error);
          setResult({
            summary: "Errore durante l'analisi dell'audio",
            keyPoints: [],
            confidence: 0,
            type: "error"
          });
        }
        setIsAnalyzing(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Errore registrazione audio:", error);
      alert("Impossibile accedere al microfono");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  const insertResult = () => {
    if (result) {
      const resultText = `${result.summary}\n\nPunti chiave:\n${result.keyPoints.map(point => `• ${point}`).join('\n')}`;
      onResultSelect(resultText);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Assistente AI ArcherKiwi
          </DialogTitle>
          <DialogDescription>
            Analizza contenuti multimediali e genera riassunti intelligenti
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b">
            <Button
              variant={activeTab === "upload" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("upload")}
              className="hover-elevate"
            >
              <Upload className="w-4 h-4 mr-2" />
              Carica File
            </Button>
            <Button
              variant={activeTab === "youtube" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("youtube")}
              className="hover-elevate"
            >
              <Video className="w-4 h-4 mr-2" />
              YouTube
            </Button>
            <Button
              variant={activeTab === "summarize" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("summarize")}
              className="hover-elevate"
              disabled={!noteContent?.trim()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Riassumi Nota
            </Button>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">Analisi File</CardTitle>
                <CardDescription>
                  Carica immagini, PDF o file audio per l'analisi AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 hover-elevate"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                  >
                    <ImageIcon className="w-8 h-8" />
                    Immagini/PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2 hover-elevate"
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isAnalyzing}
                  >
                    <Mic className={`w-8 h-8 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                    {isRecording ? 'Ferma Registrazione' : 'Registra Audio'}
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}

          {/* YouTube Tab */}
          {activeTab === "youtube" && (
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">Analisi Video YouTube</CardTitle>
                <CardDescription>
                  Inserisci un link YouTube per ottenere un riassunto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="youtube-url">URL Video YouTube</Label>
                  <Input
                    id="youtube-url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    disabled={isAnalyzing}
                  />
                </div>
                <Button
                  onClick={handleYouTubeAnalysis}
                  disabled={!youtubeUrl.trim() || isAnalyzing}
                  className="w-full hover-elevate"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analizzando...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Analizza Video
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Summarize Tab */}
          {activeTab === "summarize" && (
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-lg">Riassumi Nota Corrente</CardTitle>
                <CardDescription>
                  Genera un riassunto intelligente della nota che stai scrivendo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleNoteSummary}
                  disabled={!noteContent?.trim() || isAnalyzing}
                  className="w-full hover-elevate"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Riassumendo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Genera Riassunto
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Progress Bar */}
          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analisi in corso...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="animate-pulse" />
            </div>
          )}

          {/* Results */}
          {result && !isAnalyzing && (
            <Card className="border-primary/20 bg-primary/5 animate-in slide-in-from-bottom duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Risultato Analisi
                  </CardTitle>
                  <Badge variant={result.type === "error" ? "destructive" : "secondary"}>
                    {result.type}
                  </Badge>
                </div>
                <CardDescription>
                  Confidenza: {Math.round(result.confidence * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Riassunto</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {result.summary}
                  </p>
                </div>
                
                {result.keyPoints.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Punti Chiave</h4>
                    <ul className="space-y-1">
                      {result.keyPoints.map((point, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={insertResult}
                    className="flex-1 hover-elevate"
                    data-testid="button-insert-ai-result"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Inserisci nella Nota
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(result.summary)}
                    className="hover-elevate"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}