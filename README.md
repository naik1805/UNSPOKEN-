# UNSPOKEN — A 3D Narrative Life Journey

An emotional 3D interactive narrative game chronicling a 10-year journey of love, unspoken dreams, and heartbreak.

## 🎮 Play & Controls
- **PC Controls**:
  - `W / A / S / D` or `Arrow Keys` — Walk & Move
  - `Space` — Continue Subtitles & Dialogues
  - `E` — Interact with characters & objects
  - `Mouse Drag` — Orbit 3D Cinematic Camera
- **Mobile Controls**:
  - **Virtual Joystick**: Drag thumbstick to walk
  - **Tap Anywhere on Screen**: Advances dialogues line-by-line
  - `[💬 TALK]` Button: Interact or continue dialogue
  - `[↺ CAM]` Button: Reset Camera
  - Right-screen touch drag: Orbit Camera

## 🚀 Deployment on Render (Static Site)
1. Log in to [Render](https://render.com/).
2. Click **New +** -> **Static Site**.
3. Connect your GitHub repository: `https://github.com/naik1805/UNSPOKEN-.git`.
4. Configure settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click **Create Static Site**.
Render will build and assign you a free live URL (e.g., `https://unspoken-xxxx.onrender.com`).

## 🛠️ Local Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
