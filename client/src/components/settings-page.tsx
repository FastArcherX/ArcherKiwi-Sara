import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { logout } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import {
  Settings,
  Palette,
  Type,
  Bell,
  Download,
  Upload,
  Trash2,
  LogOut,
  User,
  Shield,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [user] = useAuthState(auth);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState("medium");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [accentColor, setAccentColor] = useState("teal");

  const handleLogout = async () => {
    if (confirm("Sei sicuro di voler uscire?")) {
      await logout();
    }
  };

  const handleExportNotes = () => {
    console.log("Exporting notes...");
    // TODO: Implement export functionality
  };

  const handleImportNotes = () => {
    console.log("Importing notes...");
    // TODO: Implement import functionality
  };

  const handleClearData = () => {
    if (confirm("Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata.")) {
      console.log("Clearing data...");
      // TODO: Implement data clearing
    }
  };

  return (
    <div className="h-full overflow-auto animate-in slide-in-from-right duration-300">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            data-testid="button-back-settings"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8" />
              Impostazioni
            </h1>
            <p className="text-muted-foreground">Personalizza la tua esperienza ArcherKiwi</p>
          </div>
        </div>

        {/* Account Section */}
        {user && (
          <Card className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
              <CardDescription>Informazioni sul tuo account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={user.photoURL || ''}
                  alt={user.displayName || 'User'}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{user.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              </div>
              <Separator />
              <Button
                variant="outline"
                onClick={handleLogout}
                className="hover-elevate"
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Esci
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Theme & Appearance */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Tema e Aspetto
            </CardTitle>
            <CardDescription>Personalizza l'aspetto dell'app</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme">Tema</Label>
              <Select value={theme} onValueChange={(value: any) => setTheme(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Chiaro</SelectItem>
                  <SelectItem value="dark">Scuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="accent-color">Colore Accento</Label>
              <Select value={accentColor} onValueChange={setAccentColor}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teal">Verde-Blu</SelectItem>
                  <SelectItem value="blue">Blu</SelectItem>
                  <SelectItem value="purple">Viola</SelectItem>
                  <SelectItem value="green">Verde</SelectItem>
                  <SelectItem value="orange">Arancione</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Editor Settings */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Editor di Testo
            </CardTitle>
            <CardDescription>Configurazioni dell'editor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="font-family">Font Predefinito</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Times New Roman">Times</SelectItem>
                  <SelectItem value="Georgia">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="font-size">Dimensione Testo</Label>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Piccolo</SelectItem>
                  <SelectItem value="medium">Medio</SelectItem>
                  <SelectItem value="large">Grande</SelectItem>
                  <SelectItem value="xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Salvataggio Automatico</Label>
                <p className="text-sm text-muted-foreground">
                  Salva automaticamente le modifiche
                </p>
              </div>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifiche
            </CardTitle>
            <CardDescription>Gestisci le notifiche</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Notifiche Push</Label>
                <p className="text-sm text-muted-foreground">
                  Ricevi notifiche per aggiornamenti e promemoria
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Gestione Dati
            </CardTitle>
            <CardDescription>Esporta, importa o elimina i tuoi dati</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={handleExportNotes}
                className="hover-elevate"
                data-testid="button-export-notes"
              >
                <Download className="w-4 h-4 mr-2" />
                Esporta Note
              </Button>
              <Button
                variant="outline"
                onClick={handleImportNotes}
                className="hover-elevate"
                data-testid="button-import-notes"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importa Note
              </Button>
            </div>
            <Separator />
            <Button
              variant="destructive"
              onClick={handleClearData}
              className="hover-elevate"
              data-testid="button-clear-data"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Elimina Tutti i Dati
            </Button>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="hover-elevate">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Funzioni AI
            </CardTitle>
            <CardDescription>Configurazioni delle funzionalità intelligenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Analisi Foto e PDF</h4>
                <p className="text-sm text-muted-foreground">
                  Estrai testo e riassumi contenuti da immagini e documenti
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Registrazione Audio</h4>
                <p className="text-sm text-muted-foreground">
                  Trascrivi e analizza registrazioni audio
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Analisi Video YouTube</h4>
                <p className="text-sm text-muted-foreground">
                  Riassumi video di YouTube tramite link
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Riassunto Note</h4>
                <p className="text-sm text-muted-foreground">
                  Genera riassunti automatici delle tue note
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pb-8">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <h3 className="font-medium">ArcherKiwi v1.0</h3>
                <p className="text-sm text-muted-foreground">
                  La tua app di appunti intelligente con funzionalità AI avanzate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}