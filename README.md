# JurisIQ — Supreme Court Case Law & Precedent Research Platform

**JurisIQ** is a modern, light-theme legal intelligence and judgment research tool designed for Indian advocates, judicial clerks, law students, and legal researchers. It provides comprehensive access to authenticated **Supreme Court of India judgments** (1950 – Present) with equivalent citations, coram composition, and interactive precedent analysis.

---

## Key Features

- **Multi-Mode Search Engine**:
  - **Topic & Keyword Search**: Natural legal queries (e.g., *"Right to Privacy Aadhaar"*, *"Anticipatory bail PMLA"*, *"Arbitration Section 11"*).
  - **Party / Case Name Search**: Instant lookup by case title (e.g., *"Kesavananda Bharati"*, *"Navtej Singh Johar"*, *"Maneka Gandhi"*).
  - **Official Citation Search**: Direct lookup by reported citations (`1973 4 SCC 225`, `AIR 2017 SC 4161`, `(2018) 10 SCC 1`).
  - **Advanced Bench & Date Filters**: Narrow by Judge / Bench Coram and year range (1950 – 2026).
- **True Judgment Reader**:
  - Full authentic judgment text with paragraph breakdowns and individual judicial opinions.
  - Coram & Bench composition display.
  - Equivalent Citations (SCC, AIR, SCR) with one-click clipboard copying.
  - **Interactive Cross-References**: Statutory sections and prior rulings cited in the text are hyperlinked—clicking any precedent immediately loads it inside JurisIQ.
  - **Typographic Customization**: Serif (Law Report) vs. Sans mode with 4-step font size adjustments.
  - **Print / PDF Formatter**: Dedicated law-report print stylesheet for court submissions and research notes.
- **Curated Constitutional Landmark Benches**:
  - Instant access to foundational Supreme Court decisions including Basic Structure, Privacy, Due Process, Decriminalization of Sec 377, and Arbitrariness doctrines.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Parser**: [Cheerio](https://cheerio.js.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/R-Crypt/JurisIQ.git
   cd JurisIQ
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

MIT License. Designed for legal research and education.
