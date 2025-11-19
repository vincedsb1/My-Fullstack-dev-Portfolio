# GEMINI.md

## Project Overview

This is a personal portfolio website built with [Next.js](https://nextjs.org/) and TypeScript. The project is designed to showcase skills, projects, and professional experience. It is fully internationalized, supporting English and French, using the `next-intl` library. The styling is implemented with [Tailwind CSS](https://tailwindcss.com/) and includes a dark mode theme switcher. The site is responsive and uses the `lucide-react` library for icons and `AOS` for scroll animations.

## Building and Running

To get the project running locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

3.  **Build for Production:**
    ```bash
    npm run build
    ```
    This command creates an optimized production build of the application.

4.  **Run Production Server:**
    ```bash
    npm run start
    ```
    This command starts a Node.js server to serve the production build.

## Development Conventions

### Linting and Formatting

The project uses ESLint and Prettier to enforce a consistent code style.

*   **Linting:**
    ```bash
    npm run lint
    ```
    This command checks the codebase for linting errors.

*   **Fix Linting Errors:**
    ```bash
    npm run fix
    ```
    This command automatically fixes linting and formatting issues.

### Internationalization (i18n)

Internationalization is managed using `next-intl`.

*   **Locales:** The supported locales are `en` (English) and `fr` (French).
*   **Translation Files:** Translation strings are stored in JSON files located at `src/i18n/`.
*   **Usage:** The `useTranslations` hook from `next-intl` is used in components to access translated strings.

### Theming

The project supports both light and dark themes using `next-themes`. A `ThemeSwitcher` component allows users to toggle between themes.

### Component Structure

Components are located in `src/app/components/`. The main page structure is defined in `src/app/[locale]/page.tsx`, which assembles the different sections of the portfolio (Header, Skills, Projects, etc.).

### Routing

Routing is handled by Next.js and is integrated with `next-intl` to provide locale-based routing (e.g., `/en/` or `/fr/`). The `middleware.ts` file manages the routing logic.
