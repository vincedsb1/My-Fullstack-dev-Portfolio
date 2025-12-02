# Vincent Desbrosses - Portfolio

<div align="center">
  <img src="public/pp.jpg" alt="Vincent Desbrosses" width="200" style="border-radius: 50%; object-fit: cover;" />
  <br />
  <h3>Full Stack Developer</h3>
</div>

## 📖 Project Overview

This is a personal portfolio website designed to showcase my skills, projects, and professional experience. Built with modern web technologies, it features a responsive design, dark mode support, and full internationalization (English & French).

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Internationalization:** `next-intl`
- **Icons:** `lucide-react`
- **Animations:** `AOS` (Animate On Scroll)
- **Theming:** `next-themes` (Dark/Light mode)

## 🛠️ Getting Started

To get the project running locally, follow these steps:

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

3.  **Build for Production:**

    ```bash
    npm run build
    ```

## 📝 Development Conventions

### Linting and Formatting

The project uses ESLint and Prettier to enforce a consistent code style.

```bash
# Check for linting errors
npm run lint

# Automatically fix linting and formatting issues
npm run fix
```

### Internationalization (i18n)

- **Locales:** `en` (English) and `fr` (French).
- **Translation Files:** Located in `src/i18n/`.

## 📂 Project Structure

- `src/app/[locale]/`: Main page structure and routes.
- `src/components/`: Reusable UI components.
- `src/i18n/`: Translation files.
- `public/`: Static assets.

---
Developed by Vincent Desbrosses.