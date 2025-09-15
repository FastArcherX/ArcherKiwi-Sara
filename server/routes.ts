import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { storage } from "./storage";
import { insertNoteSchema, insertFolderSchema } from "@shared/schema";
import { 
  analyzeImageServer, 
  analyzePDFServer, 
  analyzeAudioServer, 
  analyzeYouTubeVideoServer, 
  summarizeNoteServer 
} from "./lib/ai-services";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and audio files
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf',
      'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware for JSON parsing
  app.use(express.json({ limit: '10mb' }));
  
  // Simple auth middleware (in real app, use proper JWT validation)
  const requireAuth = (req: any, res: any, next: any) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    req.userId = userId;
    next();
  };

  // Notes API
  app.get('/api/notes', requireAuth, async (req: any, res) => {
    try {
      const notes = await storage.getNotesByUserId(req.userId);
      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  app.get('/api/notes/:id', requireAuth, async (req: any, res) => {
    try {
      const note = await storage.getNote(req.params.id, req.userId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  });

  app.post('/api/notes', requireAuth, async (req: any, res) => {
    try {
      const noteData = insertNoteSchema.parse({ ...req.body, userId: req.userId });
      const note = await storage.createNote(noteData);
      res.json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(400).json({ error: 'Invalid note data' });
    }
  });

  app.put('/api/notes/:id', requireAuth, async (req: any, res) => {
    try {
      const noteData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(req.params.id, noteData, req.userId);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(400).json({ error: 'Invalid note data' });
    }
  });

  app.delete('/api/notes/:id', requireAuth, async (req: any, res) => {
    try {
      const deleted = await storage.deleteNote(req.params.id, req.userId);
      if (!deleted) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  });

  // Folders API
  app.get('/api/folders', requireAuth, async (req: any, res) => {
    try {
      const folders = await storage.getFoldersByUserId(req.userId);
      res.json(folders);
    } catch (error) {
      console.error('Error fetching folders:', error);
      res.status(500).json({ error: 'Failed to fetch folders' });
    }
  });

  app.post('/api/folders', requireAuth, async (req: any, res) => {
    try {
      const folderData = insertFolderSchema.parse({ ...req.body, userId: req.userId });
      const folder = await storage.createFolder(folderData);
      res.json(folder);
    } catch (error) {
      console.error('Error creating folder:', error);
      res.status(400).json({ error: 'Invalid folder data' });
    }
  });

  app.delete('/api/folders/:id', requireAuth, async (req: any, res) => {
    try {
      const deleted = await storage.deleteFolder(req.params.id, req.userId);
      if (!deleted) {
        return res.status(404).json({ error: 'Folder not found' });
      }
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting folder:', error);
      res.status(500).json({ error: 'Failed to delete folder' });
    }
  });

  // AI Analysis APIs (secure server-side)
  app.post('/api/ai/analyze-image', requireAuth, upload.single('image'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const result = await analyzeImageServer(req.file.path);
      
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ error: 'Failed to analyze image' });
    }
  });

  app.post('/api/ai/analyze-pdf', requireAuth, upload.single('pdf'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No PDF file provided' });
      }

      const result = await analyzePDFServer(req.file.path);
      
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error('Error analyzing PDF:', error);
      res.status(500).json({ error: 'Failed to analyze PDF' });
    }
  });

  app.post('/api/ai/analyze-audio', requireAuth, upload.single('audio'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      const result = await analyzeAudioServer(req.file.path);
      
      // Clean up uploaded file
      await fs.unlink(req.file.path).catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      res.status(500).json({ error: 'Failed to analyze audio' });
    }
  });

  app.post('/api/ai/analyze-youtube', requireAuth, async (req: any, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'No YouTube URL provided' });
      }

      const result = await analyzeYouTubeVideoServer(url);
      res.json(result);
    } catch (error) {
      console.error('Error analyzing YouTube video:', error);
      res.status(500).json({ error: 'Failed to analyze YouTube video' });
    }
  });

  app.post('/api/ai/summarize-note', requireAuth, async (req: any, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ error: 'No content provided' });
      }

      const result = await summarizeNoteServer(content);
      res.json(result);
    } catch (error) {
      console.error('Error summarizing note:', error);
      res.status(500).json({ error: 'Failed to summarize note' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}