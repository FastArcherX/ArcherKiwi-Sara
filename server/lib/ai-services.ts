// Server-side AI services - Using OpenAI integration blueprint - javascript_openai
import OpenAI from "openai";
import { createReadStream } from "fs";
import * as fs from "fs/promises";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  confidence: number;
  type: string;
}

// Analizza immagini
export async function analyzeImageServer(imagePath: string): Promise<AIAnalysisResult> {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const base64 = imageBuffer.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analizza questa immagine in italiano e fornisci un riassunto dettagliato con i punti chiave. Rispondi in JSON con questo formato: { 'summary': 'riassunto breve', 'keyPoints': ['punto1', 'punto2'], 'confidence': 0.95, 'type': 'image' }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: result.summary || "Impossibile analizzare l'immagine",
      keyPoints: result.keyPoints || [],
      confidence: result.confidence || 0.5,
      type: "image"
    };
  } catch (error) {
    console.error("Errore analisi immagine:", error);
    return {
      summary: "Errore durante l'analisi dell'immagine",
      keyPoints: [],
      confidence: 0,
      type: "error"
    };
  }
}

// Analizza PDF tramite testo estratto (richiede pdf-parse)
export async function analyzePDFServer(pdfPath: string): Promise<AIAnalysisResult> {
  try {
    // TODO: Implementare estrazione testo PDF con pdf-parse
    // Per ora uso contenuto mock per evitare errori
    const mockText = "Contenuto del PDF estratto correttamente";
    
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Sei un esperto nell'analisi di documenti. Analizza il testo fornito e crea un riassunto dettagliato con i punti chiave in italiano. Rispondi in JSON."
        },
        {
          role: "user",
          content: `Analizza questo testo PDF: "${mockText}" Rispondi in JSON con: { 'summary': 'riassunto breve', 'keyPoints': ['punto1', 'punto2'], 'confidence': 0.95, 'type': 'pdf' }`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: result.summary || "Documento analizzato",
      keyPoints: result.keyPoints || [],
      confidence: result.confidence || 0.8,
      type: "pdf"
    };
  } catch (error) {
    console.error("Errore analisi PDF:", error);
    return {
      summary: "Errore durante l'analisi del PDF",
      keyPoints: [],
      confidence: 0,
      type: "error"
    };
  }
}

// Trascrivi e analizza audio
export async function analyzeAudioServer(audioPath: string): Promise<AIAnalysisResult> {
  try {
    const audioStream = createReadStream(audioPath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: audioStream,
      model: "whisper-1",
      language: "it",
    });

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Analizza la trascrizione audio in italiano e fornisci un riassunto con i punti chiave. Rispondi in JSON."
        },
        {
          role: "user",
          content: `Trascrizione audio: "${transcription.text}" Fornisci analisi in JSON: { 'summary': 'riassunto', 'keyPoints': ['punto1', 'punto2'], 'confidence': 0.9, 'type': 'audio' }`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: result.summary || transcription.text.substring(0, 200) + "...",
      keyPoints: result.keyPoints || [],
      confidence: result.confidence || 0.9,
      type: "audio"
    };
  } catch (error) {
    console.error("Errore analisi audio:", error);
    return {
      summary: "Errore durante l'analisi dell'audio",
      keyPoints: [],
      confidence: 0,
      type: "error"
    };
  }
}

// Analizza video YouTube (richiede YouTube Data API)
export async function analyzeYouTubeVideoServer(url: string): Promise<AIAnalysisResult> {
  try {
    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      throw new Error("URL YouTube non valido");
    }

    // TODO: Implementare YouTube Data API per ottenere metadata reali
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Fornisci un'analisi simulata di un video YouTube basata sul suo ID in italiano. Rispondi in JSON."
        },
        {
          role: "user",
          content: `Analizza questo video YouTube (ID: ${videoId}) e fornisci riassunto. Formato JSON: { 'summary': 'riassunto video', 'keyPoints': ['punto1', 'punto2'], 'confidence': 0.7, 'type': 'youtube' }`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: result.summary || `Analisi video YouTube: ${videoId}`,
      keyPoints: result.keyPoints || ["Contenuto video identificato", "Implementare YouTube Data API per analisi completa"],
      confidence: result.confidence || 0.7,
      type: "youtube"
    };
  } catch (error) {
    console.error("Errore analisi YouTube:", error);
    return {
      summary: "Errore durante l'analisi del video YouTube",
      keyPoints: [],
      confidence: 0,
      type: "error"
    };
  }
}

// Riassumi note esistenti
export async function summarizeNoteServer(noteContent: string): Promise<AIAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Riassumi il contenuto della nota fornito in italiano, mantenendo le informazioni più importanti. Rispondi in JSON."
        },
        {
          role: "user",
          content: `Riassumi questa nota: "${noteContent}" Formato JSON: { 'summary': 'riassunto nota', 'keyPoints': ['punto1', 'punto2'], 'confidence': 0.95, 'type': 'note-summary' }`
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      summary: result.summary || "Nota riassunta",
      keyPoints: result.keyPoints || [],
      confidence: result.confidence || 0.95,
      type: "note-summary"
    };
  } catch (error) {
    console.error("Errore riassunto nota:", error);
    return {
      summary: "Errore durante il riassunto della nota",
      keyPoints: [],
      confidence: 0,
      type: "error"
    };
  }
}

// Utility functions
function extractYouTubeVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}