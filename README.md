# structboard

> Collaborative folder structure canvas and blueprint planner built with Next.js 15, TypeScript, and Socket.IO.

**structboard** is a Figma-like, real-time web application designed for developer teams to architect, visualize, review, and export complex project directory trees before writing a single line of code.

---

## ✨ Features

* 🎨 **Interactive Recursive Canvas:** Create, nested sub-folders, files, and config files with deep hierarchy support.
* ✋ **Drag-and-Drop Structure:** Smoothly reorder nodes or migrate subfolders between root and nested directories.
* ⚡ **Real-Time Collaboration:** Multi-user presence, state synchronization, and live canvas interactions via Socket.IO.
* 🔄 **Approval Workflows:** Status tracking (`Draft` → `In Review` → `Approved`) with direct node comment threads.
* 📦 **Multi-Format Blueprint Export:** Generate instantly downloadable structure files:
  * `structguard.yaml` (automated structure validation schema)
  * Executable Shell Scripts (`.sh` / `.bat`)
  * JSON Schema
  * Mermaid.js diagrams for documentation
* ⚡ **Ultra-Fast UI:** Powered by Next.js 15 App Router, Tailwind CSS, and Zustand immutable tree stores.

---

## 🛠️ Tech Stack

* **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Drag and Drop:** [`@hello-pangea/dnd`](https://github.com/hello-pangea/dnd)
* **Real-time Sync:** [Socket.IO](https://socket.io/)
* **Database & Auth:** [Supabase](https://supabase.com/) / Prisma

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
* **Node.js**: `18.x` or higher
* **npm** or **yarn** / **pnpm**

  ```mermaid
  graph TD
      %% Client Layer
      subgraph Client ["Next.js 15 Client Layer"]
          Page["Board Page (/board/[id])"]
          Navbar["Navbar Component"]
          Canvas["TreeCanvas"]
          Node["TreeNode (Recursive)"]
          Modal["CreateBoardModal"]
      end
  
      %% State & Sync Layer
      subgraph State ["State Management & Socket"]
          Store["Zustand Store (useCanvasStore)"]
          Sync["Socket.IO Client"]
      end
  
      %% Export & Backend Layer
      subgraph Export ["Exporter & Backend"]
          Exporter["Multi-Format Exporter"]
          Server["Socket.IO / DB Backend"]
      end
  
      %% Relationships
      Page --> Navbar
      Page --> Canvas
      Navbar --> Modal
      Modal -->|Creates Board| Store
      Canvas --> Node
      Node -->|Recursive Render| Node
  
      Canvas -->|Drag & Drop / Select| Store
      Node -->|Add / Rename / Delete / Move| Store
  
      Store -->|State Updates| Sync
      Sync <-->|Real-time Events| Server
  
      Canvas -->|Export Action| Exporter
      Exporter -->|Generate| Shell["Shell (.sh/.bat)"]
      Exporter -->|Generate| YAML["structguard.yaml"]
      Exporter -->|Generate| JSON["JSON Tree"]
      Exporter -->|Generate| Mermaid["Mermaid Diagram"]
  
  ```

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/structboard.git](https://github.com/bhkbdbhatt/structboard.git)
   cd structboard


   Distributed under the MIT License. See LICENSE for more information.
