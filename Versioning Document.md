# Meme Machine — Version Roadmap (Frontend-Only)

This document defines the evolution of Meme Machine starting from the shipped MVP (v1), assuming a **pure frontend architecture inside Adobe Express**.

No backend. No servers. No persistence beyond local state.

---

## v1 — Keyword Search MVP (Shipped)

**Status:** Implemented
**Purpose:** Fast keyword-based meme/GIF discovery and insertion inside Adobe Express.

**Flow**
Type → Search → Browse → Insert

**Architecture**

* UI runtime only
* Tenor API called directly from frontend
* No AI
* No automation

---

## v2 — Image Upload → Understand → Editable Search

**Goal:** Let users derive search intent from an image, without removing control.

**Flow**
Upload image → AI suggests meaning → search auto-fills → user edits → Search

### Features

* Manual image upload button (file picker)
* Frontend sends image directly to Gemini
* Gemini returns:

  * short caption
  * objects
  * emotion
* Search input auto-filled with caption
* User can edit before searching
* No automatic execution

### Architecture

* `geminiService.js`
* Image read as blob/base64 in browser
* Direct Gemini API calls
* Client-side parsing and normalization

---

## v3 — Add “Scan from Canvas” → Understand → Editable Search

**Goal:** Add convenience without removing existing workflows.

**Flow**
Scan from canvas → AI suggests meaning → search auto-fills → user edits → Search

### Features

* New **“Scan from Canvas”** button (in addition to upload)
* Capture current canvas or screen region
* Manual scan trigger (no auto capture)
* Frame passed to Gemini
* Search box is auto-filled and editable
* Subtle UI hint that text is editable

### Architecture

* Browser capture APIs or Express canvas export
* Frame → blob/base64 → Gemini
* Reuse `geminiService`

---

## v4 — Stickers + Multi-Tab

**Goal:** Turn intent into creative components.

### Features

* Tabs: Search | Stickers | Scan
* Sticker suggestions from intent
* Drag & drop stickers
* Resize / rotate

### Architecture

* `stickerService.js`
* Direct provider integration
* Client-side ranking

---

## v5 — Illustrations

**Goal:** Enable creative generation.

### Features

* Illustrations tab
* Style selector
* Generate / remix
* Add to canvas
* Export

### Architecture

* `illustrationService.js`
* Frontend calls generation provider
* Prompt constructed from search text

---

## v6 — Product Polish

**Goal:** Make it delightful and robust.

### Features

* Draft saving (localStorage)
* History panel
* Quick-share formats
* Performance tuning
* UI polish

---

## Core Principles

* No servers.
* No hidden automation.
* AI suggests, user decides.
* Search box is the control surface.
* Every version is usable on its own.

---

## Summary

| Version | Focus                 |
| ------- | --------------------- |
| v1      | Keyword search        |
| v2      | Upload image → intent |
| v3      | Add scan from canvas  |
| v4      | Stickers              |
| v5      | Illustrations         |
| v6      | Polish                |