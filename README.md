
# EchoBot - Conversational AI Chat Application

EchoBot is a modern, full-stack web application built with Next.js, React, and Genkit, showcasing a conversational AI chat interface with user authentication.

## Overview

This application provides a sleek and responsive chat experience where users can log in to interact with EchoBot, an AI assistant. EchoBot is designed to remember the context of the conversation, allowing for natural and engaging follow-up interactions. Bot responses are rendered with proper Markdown formatting, supporting elements like lists, code blocks, and links.

## Features

*   **Conversational AI Chat**: Powered by Genkit and a Google AI model, EchoBot can engage in multi-turn conversations, remembering previous messages.
*   **User Authentication**: A simple login page protects the chat interface. Authentication state is managed client-side using `localStorage` (mock authentication, any non-empty username/password works).
*   **Markdown Support**: Bot responses are rendered with full Markdown support, including code blocks, lists, links, and other formatting.
*   **Responsive Design**: The application is built with Tailwind CSS and ShadCN UI components, ensuring a great user experience across various screen sizes.
*   **Modern Tech Stack**: Utilizes Next.js 15 (App Router), React, TypeScript, and Genkit for cutting-edge performance and developer experience.
*   **Toast Notifications**: User-friendly toast notifications for actions like login, logout, and errors.
*   **Protected Routes**: The chat interface is only accessible after successful login.
*   **Loading States**: Clear visual indicators for when the bot is "thinking" or when authentication is being checked.

## Tech Stack

*   **Frontend**:
    *   Next.js 15 (App Router)
    *   React 18
    *   TypeScript
    *   Tailwind CSS
    *   ShadCN UI (for UI components)
    *   Lucide React (for icons)
    *   `react-markdown` (for rendering bot responses)
*   **AI / Backend Logic**:
    *   Genkit (for orchestrating AI flows)
    *   Google AI (e.g., Gemini, via `@genkit-ai/googleai`) - for powering the chat model
*   **Development**:
    *   Node.js
    *   npm (or yarn/pnpm)

## Prerequisites

Before you begin, ensure you have the following installed:
*   Node.js (v18 or later recommended)
*   npm (v8 or later recommended), or an alternative package manager like yarn or pnpm.

## Getting Started

Follow these steps to get the application up and running locally.

### 1. Clone the Repository (if applicable)

If you're working outside Firebase Studio, clone the repository first:
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Dependencies

Install the project dependencies using npm:
```bash
npm install
```
This will also install the Genkit CLI as a dev dependency.

### 3. Environment Variables

The application uses Genkit with Google AI. You'll need a Google AI API key.

Create a `.env` file in the root of your project and add your API key:
```env
# .env
GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
# or if specifically using Gemini:
# GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
Replace `YOUR_GOOGLE_AI_API_KEY` with your actual API key from Google AI Studio.

**Note**: The `src/ai/dev.ts` file uses `dotenv` to load these variables for local Genkit development.

### 4. Running the Development Servers

You need to run two development servers concurrently:
*   The Next.js frontend server.
*   The Genkit development server (for the AI flows).

**a. Start the Next.js Development Server:**
Open a terminal and run:
```bash
npm run dev
```
This will typically start the Next.js app on `http://localhost:9002`.

**b. Start the Genkit Development Server:**
Open another terminal and run:
```bash
npm run genkit:dev
```
Alternatively, to have Genkit automatically restart when flow files change:
```bash
npm run genkit:watch
```
This will start the Genkit development environment, typically making the Genkit Inspector available at `http://localhost:4000` and serving the AI flows.

### 5. Accessing the Application

Once both servers are running:
*   Open your browser and navigate to `http://localhost:9002` to use the application.
*   You can inspect and test your Genkit flows via the Genkit Developer UI, usually at `http://localhost:4000`.

## Building for Production

To build the application for production:

1.  **Build the Next.js App:**
    ```bash
    npm run build
    ```
    This command compiles your Next.js application into an optimized production build. Genkit flows defined with `'use server';` are typically bundled with the Next.js server-side code.

## Running in Production

After building the application, you can start it in production mode:
```bash
npm start
```
This command runs the optimized Next.js production server.

Ensure your production environment has the necessary environment variables (like `GOOGLE_API_KEY`) set.

## Key Project Structure

*   `src/app/`: Contains the Next.js App Router pages and layouts.
    *   `src/app/login/page.tsx`: The login page.
    *   `src/app/chat/page.tsx`: The main chat interface.
    *   `src/app/actions.ts`: Server Actions, including the one that calls the Genkit flow.
*   `src/ai/`: Contains all Genkit-related code.
    *   `src/ai/flows/generate-response.ts`: The Genkit flow for generating chatbot responses.
    *   `src/ai/genkit.ts`: Genkit configuration and AI model setup.
    *   `src/ai/dev.ts`: Entry point for local Genkit development server.
*   `src/components/`: Reusable React components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/ChatMessage.tsx`: Component for displaying individual chat messages.
    *   `src/components/ChatInput.tsx`: Component for user input.
*   `src/lib/`: Utility functions and libraries.
    *   `src/lib/auth.ts`: Client-side authentication helper.
    *   `src/lib/utils.ts`: General utility functions (like `cn` for classnames).
*   `public/`: Static assets.
*   `package.json`: Project dependencies and scripts.
*   `tailwind.config.ts`: Tailwind CSS configuration.
*   `next.config.ts`: Next.js configuration.

## Linting and Type Checking

*   To run ESLint:
    ```bash
    npm run lint
    ```
*   To perform a TypeScript type check:
    ```bash
    npm run typecheck
    ```
