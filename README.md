# Cherry Pick 🍒

> **"Don't just guess. Cherry pick."**

Cherry Pick is a real-time multiplayer strategy game based on the "Keynesian Beauty Contest" economic concept, wrapped in a soft, "supermarket fresh" aesthetic.

## 🎮 The Game
Players must select a number between **0 and 100**. The winner is the player closest to **80% of the average** of all numbers. 

**The Twist:** If anyone selects **0**, the winning target flips to **100**.

### Modes
1.  **Fruit Fight (1v1):** A duel against a friend (plus 2 server-controlled bots to disrupt the math).
2.  **Party Bowl (Multiplayer):** A standard Battle Royale for 3-5 players.

---

## 🏗 Architecture

This project is structured as a Monorepo.

```text
cherry-pick/
├── client/     # React (Vite) + Tailwind CSS v4
└── server/     # Node.js + Express + Socket.io
```

### Tech Stack

**Frontend (`/client`)**
* **Framework:** React 18 (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React + Microsoft Fluent 3D Emojis
* **Networking:** Socket.io Client

**Backend (`/server`)**
* **Runtime:** Node.js
* **Framework:** Express
* **Networking:** Socket.io v4
* **State Management:** In-Memory Game Store (Singleton Pattern)

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* npm (v9+)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/cherry-pick.git](https://github.com/your-username/cherry-pick.git)
    cd cherry-pick
    ```

2.  **Install Server Dependencies:**
    ```bash
    cd server
    npm install
    cd ..
    ```

3.  **Install Client Dependencies:**
    ```bash
    cd client
    npm install
    cd ..
    ```

### Running Locally

You will need two terminal tabs running simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
# Server will start on http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
# Vite will expose the app (usually http://localhost:5173)
```

---

## 📂 Credits & Assets
* **Visual Assets:** [Microsoft Fluent UI Emoji](https://github.com/microsoft/fluentui-emoji) (MIT License).
* **Font:** Varela Round (Google Fonts).

---

## 📝 License
MIT