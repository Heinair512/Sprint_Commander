# Sprint Commander

Ein interaktives Spiel zur Simulation von Agile-Szenarien und Teammanagement, entwickelt mit Vue 3, TypeScript und Vite.

## Features

- **Authentifizierung**: Sicheres Login-System
- **Interaktive Events**: Verschiedene Szenarien mit Entscheidungsmöglichkeiten
- **Team-Interaktion**: Chat-System mit KI-gesteuerten Teammitgliedern
- **Live-Feedback**: Echtzeit-Bewertung von Entscheidungen
- **Retro CRT-Design**: Einzigartiges visuelles Design mit CRT-Effekten

## Technologie-Stack

- Vue 3 mit Composition API
- TypeScript für typsichere Entwicklung
- Vite als Build-Tool
- Tailwind CSS für Styling
- OpenAI GPT-4 für Team-Interaktionen
- Express.js Backend für Chat-API
- Vue Toastification für Benachrichtigungen

## Lokale Entwicklung

### Voraussetzungen

- Node.js (Version 18 oder höher)
- npm oder yarn als Paketmanager

### Installation

1. Repository klonen oder Projekt-Dateien herunterladen
2. Abhängigkeiten installieren:
```bash
npm install
```

### Umgebungsvariablen

Erstellen Sie eine `.env` Datei im Wurzelverzeichnis mit folgenden Variablen:

```env
OPENAI_API_KEY=your-api-key
FRONTEND_URL=http://localhost:5173
```

### Entwicklungsserver starten

Frontend starten:
```bash
npm run dev
```

Backend-Server starten:
```bash
npm run server
```

## Projektstruktur

```
sprint-commander/
├── src/
│   ├── components/     # Vue Komponenten
│   ├── views/          # Vue Views
│   ├── data/          # JSON Datendateien
│   ├── routes/        # Express.js Routen
│   └── assets/        # Statische Assets
├── public/            # Öffentliche Dateien
└── dist/             # Build-Output
```

## Spielmechanik

- **Score-System**: Entscheidungen beeinflussen den Spieler-Score
- **Team-Interaktion**: Vier verschiedene Team-Charaktere mit eigenen Persönlichkeiten
- **Event-System**: Verschiedene Szenarien mit mehreren Lösungsmöglichkeiten
- **News-Ticker**: Dynamische Nachrichten-Anzeige

## Team-Charaktere

- **Lars Byte** (Developer)
- **Grace Grid** (UX Designer)
- **Scrumlius** (Coach)
- **Maggie Money** (Stakeholder)

## Deployment

Die Anwendung ist für das Deployment auf Netlify optimiert. Das Frontend wird automatisch deployed, während das Backend separat gehostet werden muss.

## Lizenz

Alle Rechte vorbehalten.