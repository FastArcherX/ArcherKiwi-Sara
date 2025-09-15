import { type User, type InsertUser, type Note, type InsertNote, type Folder, type InsertFolder } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Notes
  getNotesByUserId(userId: string): Promise<Note[]>;
  getNote(id: string, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>, userId: string): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  
  // Folders
  getFoldersByUserId(userId: string): Promise<Folder[]>;
  getFolder(id: string, userId: string): Promise<Folder | undefined>;
  createFolder(folder: InsertFolder): Promise<Folder>;
  updateFolder(id: string, folder: Partial<InsertFolder>, userId: string): Promise<Folder | undefined>;
  deleteFolder(id: string, userId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private notes: Map<string, Note>;
  private folders: Map<string, Folder>;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.folders = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Note methods
  async getNotesByUserId(userId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.userId === userId
    ).sort((a, b) => {
      const dateA = b.updatedAt ? new Date(b.updatedAt) : new Date(b.createdAt!);
      const dateB = a.updatedAt ? new Date(a.updatedAt) : new Date(a.createdAt!);
      return dateA.getTime() - dateB.getTime();
    });
  }

  async getNote(id: string, userId: string): Promise<Note | undefined> {
    const note = this.notes.get(id);
    return note && note.userId === userId ? note : undefined;
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: now, 
      updatedAt: now,
      folderId: insertNote.folderId || null
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, noteUpdate: Partial<InsertNote>, userId: string): Promise<Note | undefined> {
    const existingNote = await this.getNote(id, userId);
    if (!existingNote) return undefined;

    const updatedNote: Note = {
      ...existingNote,
      ...noteUpdate,
      updatedAt: new Date()
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const note = await this.getNote(id, userId);
    if (!note) return false;
    
    return this.notes.delete(id);
  }

  // Folder methods
  async getFoldersByUserId(userId: string): Promise<Folder[]> {
    return Array.from(this.folders.values()).filter(
      (folder) => folder.userId === userId
    ).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFolder(id: string, userId: string): Promise<Folder | undefined> {
    const folder = this.folders.get(id);
    return folder && folder.userId === userId ? folder : undefined;
  }

  async createFolder(insertFolder: InsertFolder): Promise<Folder> {
    const id = randomUUID();
    const folder: Folder = { 
      ...insertFolder, 
      id, 
      createdAt: new Date() 
    };
    this.folders.set(id, folder);
    return folder;
  }

  async updateFolder(id: string, folderUpdate: Partial<InsertFolder>, userId: string): Promise<Folder | undefined> {
    const existingFolder = await this.getFolder(id, userId);
    if (!existingFolder) return undefined;

    const updatedFolder: Folder = {
      ...existingFolder,
      ...folderUpdate
    };
    this.folders.set(id, updatedFolder);
    return updatedFolder;
  }

  async deleteFolder(id: string, userId: string): Promise<boolean> {
    const folder = await this.getFolder(id, userId);
    if (!folder) return false;
    
    // Also delete all notes in this folder
    const notesToDelete = Array.from(this.notes.values()).filter(
      note => note.folderId === id && note.userId === userId
    );
    
    for (const note of notesToDelete) {
      this.notes.delete(note.id);
    }
    
    return this.folders.delete(id);
  }
}

export const storage = new MemStorage();