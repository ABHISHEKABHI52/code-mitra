# CodeMitra

CodeMitra is a Local Language Code Explainer. It helps beginner programmers understand errors in simple Hindi, Hinglish, or English using a strict JSON response format.

## What This Project Does

The app takes a programming error or code snippet from the user, sends it to a backend prompt pipeline, asks OpenAI to explain it in beginner-friendly language, and renders the response in a clean React UI.

The goal is simple:
- explain the meaning of the error
- show why it happened
- give practical fix steps
- provide a minimal working example
- keep the answer easy for absolute beginners

## Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- OpenAI SDK
- dotenv
- cors

## Main Features

- Language selection: Hindi, Hinglish, English
- Beginner-first explanations
- Strict JSON response contract
- Copy button for generated example code
- Example error chips for quick testing
- Responsive and clean UI
- Safe handling for missing input or invalid language

## Project Structure

```text
CodeMitra/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── LanguageSelector.jsx
│       │   └── ResultCard.jsx
│       ├── pages/
│       │   └── Home.jsx
│       ├── services/
│       │   └── api.js
│       └── utils/
│           └── constants.js
├── server/
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── routes/
│   │   └── explainRoutes.js
│   ├── controllers/
│   │   └── explainController.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── promptService.js
│   └── utils/
│       └── languageConfig.js
├── README.md
└── package.json
```

## How It Works

### Frontend Flow

1. User pastes an error or code snippet.
2. User selects a language.
3. User clicks Explain this error.
4. Frontend sends a POST request to the backend.
5. The response is shown in a result card.

### Backend Flow

1. Express receives the request at `POST /api/explain`.
2. Controller validates `input` and `lang`.
3. Prompt builder creates a strict instruction string.
4. OpenAI generates a response.
5. Backend strips markdown fences if needed.
6. Backend parses JSON and returns it to the frontend.

## File Guide

### Root Files

- `package.json`: root dev scripts.
- `README.md`: project documentation.

### Server Files

- `server/server.js`: starts the Express app.
- `server/app.js`: configures middleware and routes.
- `server/routes/explainRoutes.js`: defines the `/api/explain` route.
- `server/controllers/explainController.js`: validates input and handles responses.
- `server/services/promptService.js`: builds the system prompt.
- `server/services/aiService.js`: calls OpenAI and parses JSON.
- `server/utils/languageConfig.js`: language instruction mapping.
- `server/.env.example`: safe env template.
- `server/.env.local`: local secret config file.

### Client Files

- `client/index.html`: Vite entry HTML.
- `client/vite.config.js`: Vite config.
- `client/postcss.config.js`: PostCSS config.
- `client/tailwind.config.js`: Tailwind config.
- `client/src/main.jsx`: React entry point.
- `client/src/App.jsx`: root app component.
- `client/src/pages/Home.jsx`: main UI page.
- `client/src/components/LanguageSelector.jsx`: language toggle buttons.
- `client/src/components/ResultCard.jsx`: rendered explanation panel.
- `client/src/services/api.js`: frontend API wrapper.
- `client/src/utils/constants.js`: sample errors and languages.
- `client/src/index.css`: Tailwind base styles.
- `client/src/styles/main.css`: custom UI styles.

## Environment Setup

### Server Environment

Create or edit `server/.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Important:
- Keep this file private.
- Do not commit real secret keys to GitHub.

### Client Environment

Create or edit `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000
```

If the frontend is deployed later, replace this with the live backend URL.

## Installation

From the project root:

```bash
npm install
npm --prefix server install
npm --prefix client install
```

## Run Locally

Start both frontend and backend:

```bash
npm run dev
```

Expected URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Reference

### Health Check

`GET /api/health`

Example response:

```json
{
  "status": "ok",
  "service": "CodeMitra API"
}
```

### Explain Error

`POST /api/explain`

Request body:

```json
{
  "input": "NameError: name 'x' is not defined",
  "lang": "Hinglish"
}
```

Valid language values:
- Hindi
- Hinglish
- English

### API Response Shape

The backend returns JSON in this structure:

```json
{
  "meaning": "...",
  "analogy": "...",
  "cause": "...",
  "fix_steps": "1. ...\n2. ...\n3. ...",
  "example_code": "...",
  "summary": "..."
}
```

### GET on `/api/explain`

If you open the route in a browser, it will not return an explanation. Use POST only.
The GET route returns a helpful message telling you to use POST with `input` and `lang`.

## Prompt Rules

The prompt pipeline is designed to keep the model output stable and beginner-friendly.

Key rules:
- avoid jargon unless it is explained simply
- keep every field filled
- use numbered fix steps
- return only raw JSON
- keep summary short
- use a minimal working example

## Troubleshooting

### `ERR_CONNECTION_REFUSED`

This usually means the dev server is not running.

Fix:
1. Run `npm run dev` from the project root.
2. Open http://localhost:5173.
3. Keep the terminal open while testing.

### `Cannot GET /api/explain`

This is normal if you open the endpoint in a browser.

Fix:
- Use `POST /api/explain` with JSON body.
- The app frontend already does this for you.

### `OPENAI_API_KEY is missing`

Fix:
1. Add the key to `server/.env.local`.
2. Restart the server.
3. Make sure the variable name is exactly `OPENAI_API_KEY`.

### JSON parsing issues

The backend strips markdown fences and falls back safely if the model does not return valid JSON.

## GitHub Push Notes

Before pushing:
- keep `.env.local` files uncommitted
- keep `node_modules` out of Git
- verify the repo is the intended one before `git push`

## Development Notes

- The backend is optimized for structured JSON output, so the temperature is kept low.
- The UI is intentionally simple so the explanation is the focus.
- The result card includes copy-to-clipboard support for the generated code.

## Suggested Future Improvements

- add more languages
- add history of previous explanations
- add streaming responses
- add tests for JSON schema validation
- add production deployment config

## Short Demo Script

1. Paste a JavaScript or Python error.
2. Select Hindi, Hinglish, and English one by one.
3. Show how the explanation becomes easier to understand.
4. Highlight that the tool explains meaning, cause, fix, and example code.

## License

No license has been set yet.
