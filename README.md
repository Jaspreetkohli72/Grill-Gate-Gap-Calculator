# Grill & Gate Gap Calculator

A Next.js web application built for metal fabricators, welders, carpenters, and railing specialists to calculate equal rod/pipe spacing inside a frame using both standard inches and the traditional **Soot** measurement unit ($1\text{ inch} = 8\text{ soot}$).

![Grill & Gate Gap Calculator](https://img.shields.io/badge/Framework-Next.js%2014-black?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue?style=flat&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue?style=flat&logo=typescript)

---

## 🎯 Features

- **Soot & Inch Measurement Engine**: Precise calculations with $1\text{ inch} = 8\text{ soot} = 25.4\text{ mm}$.
- **Prominent Outputs**:
  - Exact number of rods/pipes needed (with interactive $+/-$ micro-adjustment).
  - Exact internal gap in inches and soot (with fractional breakdown & mm).
  - Number of internal gaps created.
- **Interactive 2D Visualizer**: Real-time proportional SVG cross-section of the frame, filler rods, gap callouts, and center-to-center pitch lines.
- **Workshop Layout & Marking Guide**: Tape measure offset table for marking cut-lines and centerline punch points directly from the left inner edge.
- **Quick Presets**: Window grills, main gates, balcony safety railings, and stair balusters.
- **Soot Reference Matrix & Converter**: Interactive 2-way converter for soot, inches, and millimeters.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/grill-gate-gap-calculator.git

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📐 Formulas & Logic

- **Total Frame Width ($W_{\text{in}}$)**: $\text{Inches} + \frac{\text{Soot}}{8}$
- **Filler Width in Inches ($W_{\text{rod}}$)**: $\frac{\text{Rod (mm)}}{25.4}$
- **Ideal Rod Count ($N_{\text{ideal}}$)**: $\frac{W_{\text{in}} - G_{\text{target}}}{W_{\text{rod}} + G_{\text{target}}}$
  - *Gap can be more than needed*: $N = \lfloor N_{\text{ideal}} \rfloor$
  - *Max gap limit*: $N = \lceil N_{\text{ideal}} \rceil$
- **Actual Gap**: $\frac{W_{\text{in}} - (N \times W_{\text{rod}})}{N + 1}$
