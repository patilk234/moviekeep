# 🎬 Movie Watchlist PWA

A beautiful, modern Progressive Web App for managing your movie watchlists. Built with React, TypeScript, Vite, and Firebase, featuring integration with TMDB for movie data.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.2-purple?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.7-orange?logo=firebase)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **📋 Create & Manage Watchlists** - Organize movies into custom watchlists
- **🔍 Browse & Search Movies** - Search millions of movies via TMDB API
- **🔐 Google Authentication** - Secure sign-in with Google
- **☁️ Cloud Sync** - Real-time data sync across devices with Firebase Firestore
- **📱 PWA Support** - Install as a native app on any device
- **🎨 Beautiful UI** - Modern dark theme with smooth animations
- **📴 Offline Support** - Works offline with service worker caching

---

## 📋 Table of Contents

- [Prerequisites](#-prerequisites)
- [Getting API Keys](#-getting-api-keys)
  - [TMDB API Key](#tmdb-api-key)
  - [Firebase Setup](#firebase-setup)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Docker Deployment](#-docker-deployment)
- [Project Structure](#-project-structure)
- [Scripts](#-scripts)
- [GitHub Actions CI/CD](#-github-actions-cicd)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔧 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (or yarn/pnpm)
- **Docker** (optional, for containerized deployment)
- **Docker Compose** (optional, for easier container management)

---

## 🔑 Getting API Keys

### TMDB API Key

The Movie Database (TMDB) provides free movie data. Here's how to get your API key:

1. **Create an Account**
   - Go to [https://www.themoviedb.org/signup](https://www.themoviedb.org/signup)
   - Sign up for a free account or log in

2. **Request an API Key**
   - Navigate to [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api)
   - Click **"Create"** under "Request an API Key"
   - Select **"Developer"** option
   - Accept the terms of use

3. **Fill Application Details**
   - **Application Name**: Movie Watchlist App (or any name)
   - **Application URL**: http://localhost:5173 (for development)
   - **Application Summary**: Personal movie watchlist management app

4. **Copy Your API Key**
   - After approval (usually instant), copy the **API Key (v3 auth)**
   - This is your `VITE_TMDB_API_KEY`

---

### Firebase Setup

Firebase provides authentication and database services. Follow these steps:

#### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Create a project"** (or **"Add project"**)
3. Enter a project name (e.g., "movie-watchlist-app")
4. Optionally disable Google Analytics (not needed for this app)
5. Click **"Create Project"** and wait for it to initialize

#### 2. Enable Google Authentication

1. In your Firebase project, go to **Build > Authentication**
2. Click **"Get Started"**
3. Under **Sign-in method**, click on **"Google"**
4. Toggle **Enable** to ON
5. Select your **Support email** from the dropdown
6. Click **"Save"**

#### 3. Create a Firestore Database

1. Go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose a location closest to your users
4. Start in **Production mode** (we'll set up rules next)
5. Click **"Create"**

#### 4. Set Up Firestore Security Rules

1. In Firestore, go to the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

#### 5. Register Your Web App

1. Go to **Project Settings** (gear icon) > **General**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Enter an app nickname (e.g., "Movie Watchlist Web")
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**

#### 6. Copy Firebase Configuration

After registration, you'll see your Firebase config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Copy these values for your environment variables.

#### 7. Add Authorized Domains

1. Go to **Authentication > Settings**
2. Under **"Authorized domains"**, add any domains where your app will be hosted:
   - `localhost` (for development - usually pre-added)
   - Your production domain (e.g., `your-app.com`)
   - Your Docker host domain if applicable

---

## 🌍 Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

> [!CAUTION]
> **Never commit your `.env` file to version control!**
> The `.env` file contains sensitive API keys. Make sure it's listed in `.gitignore`.

### Environment File Template

A template file `.env.example` is provided for reference:

```bash
# Copy this file to .env and fill in your values
# .env is gitignored and will not be committed

# TMDB API Key - Get from https://www.themoviedb.org/settings/api
VITE_TMDB_API_KEY=

# Firebase Config - Get from Firebase Console > Project Settings
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/movie-watchlist.git
cd movie-watchlist
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your API keys
# Use your preferred editor (code, nano, vim, etc.)
code .env
```

### 4. Update Firebase Configuration (Important!)

The Firebase configuration in `src/services/firebase.ts` should reference environment variables. Update the `firebaseConfig` object:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

---

## ▶️ Running the Application

### Development Server

```bash
npm run dev
```

This starts the Vite development server at [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🐳 Docker Deployment

### Prerequisites

- Docker Engine 20.x+
- Docker Compose v2.x+

### Using Docker Compose (Recommended)

1. **Create your `.env` file** with all required environment variables (see above)

2. **Build and start the container:**

```bash
docker-compose up -d --build
```

3. **Access the application** at [http://localhost:5100](http://localhost:5100)

4. **Stop the container:**

```bash
docker-compose down
```

### Using Docker Directly

1. **Build the image:**

```bash
docker build \
  --build-arg VITE_TMDB_API_KEY=your_tmdb_api_key \
  --build-arg VITE_FIREBASE_API_KEY=your_firebase_api_key \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com \
  --build-arg VITE_FIREBASE_PROJECT_ID=your-project-id \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=123456789 \
  --build-arg VITE_FIREBASE_APP_ID=1:123456789:web:abc123 \
  -t movie-watchlist .
```

2. **Run the container:**

```bash
docker run -d -p 5100:80 --name movie-watchlist movie-watchlist
```

3. **Access the application** at [http://localhost:5100](http://localhost:5100)

### Docker Compose File Reference

```yaml
version: '3.8'

services:
  movie-watchlist:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_TMDB_API_KEY=${VITE_TMDB_API_KEY}
        - VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
        - VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
        - VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
        - VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
        - VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
        - VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
    ports:
      - "5100:80"
    restart: unless-stopped
    container_name: movie-watchlist
```

---

## 📁 Project Structure

```
movie-watchlist/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and icons
│   ├── components/         # Reusable React components
│   │   ├── Layout/         # Layout components (AppLayout, etc.)
│   │   ├── Movie/          # Movie-related components
│   │   └── ui/             # Base UI components (Button, Input, etc.)
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services (Firebase, TMDB)
│   ├── test/               # Test utilities and setup
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Root application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables (gitignored)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration for production
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── vitest.config.ts        # Vitest test configuration
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |
| `npm run test:coverage` | Run tests with coverage report |

---

## 🔒 Security Notes

> [!IMPORTANT]
> **Keep your credentials safe!**

1. **Never commit `.env` files** - They contain sensitive API keys
2. **Use `.env.example`** - Share this template without actual values
3. **Firebase API keys** - While Firebase API keys are typically safe to expose in frontend apps (they're restricted by Firebase Security Rules), it's best practice to keep them private
4. **Firestore Rules** - Always set up proper security rules to protect user data
5. **Domain restrictions** - Configure authorized domains in Firebase Console

---

## 🚀 GitHub Actions CI/CD

This project includes automated CI/CD using GitHub Actions. The workflow runs on every push and pull request to the `main` branch.

### Workflow Jobs

1. **Test** - Runs linting and all tests
2. **Build Verification** - Verifies the production bundle compiles successfully
3. **Docker Build Verification** - Verifies the Docker image builds successfully

### Security Note

> [!IMPORTANT]
> The CI workflow uses **placeholder values** for API keys to verify builds compile correctly without exposing your real credentials. This is intentional for open-source projects.
>
> - No artifacts with real credentials are published
> - No Docker images with real credentials are pushed
> - Real credentials should only be used in your private deployment environment

### For Private Deployments

If you fork this repository for private use and want to build with real credentials:

1. Go to your GitHub repository
2. Navigate to **Settings > Secrets and variables > Actions**
3. Add your secrets (see Environment Variables section)
4. Modify the workflow to use `${{ secrets.VITE_* }}` instead of placeholders

### Adding Build Status Badge

Add this badge to show CI status in your README:

```markdown
![CI](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/ci.yml/badge.svg)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Firebase](https://firebase.google.com/) for authentication and database
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

<p align="center">
  Made with ❤️ by the community
</p>
