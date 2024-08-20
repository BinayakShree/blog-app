# Blogging App - Full Stack Project

Welcome to my first full-stack project! This repository contains the codebase for a blogging application that I built to enhance my skills in web development. I have made this website with the latest technologies & followed best practices.

## Live Demo
Check out the live version of the app: [binayakshree.vercel.app](https://binayakshree.vercel.app/)

## Features
- **Frontend**: 
  - Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
  - Written in [TypeScript](https://www.typescriptlang.org/) for type safety and improved code quality
  - State management with [Redux Toolkit](https://redux-toolkit.js.org/)
  - Styled with [Tailwind CSS](https://tailwindcss.com/) and [Flowbite](https://flowbite.com/)
  - Icons from [React Icons](https://react-icons.github.io/react-icons/)
  - Mobile-responsive design for all screen sizes 📱
  - Signup and signin using email or Google OAuth
  - Advanced admin dashboard for managing posts and users
  - Comment feature for engaging with posts
  - Profile update feature for users
  - Rich text editor integration using [React Quill](https://github.com/zenoamaro/react-quill) for writing posts
  - User profile picture upload feature
  
- **Backend**:
  - Serverless backend powered by [Hono](https://honojs.dev/) and deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
  - Written in [TypeScript](https://www.typescriptlang.org/) for consistent type checking and maintainability
  - Input validation with [Zod](https://zod.dev/) to ensure data integrity and security
  - Authentication using JWT with advanced cookie handling
  - Database managed with [Prisma](https://www.prisma.io/) and [Neon DB](https://neon.tech/)
  - Image upload handling using Firebase Cloud Storage
  - Advanced database design to support various features
  
- **Deployment**:
  - Frontend deployed on [Vercel](https://vercel.com/)
  - Backend deployed on Cloudflare Workers

## Key Learnings
Throughout this project, I have gained valuable experience in:
- Managing a full-stack project from start to finish
- Implementing advanced cookie-based authentication with JWT
- Handling image uploads in a secure and efficient manner
- Implementing pagination for better user experience
- Integrating [Flowbite](https://flowbite.com/) for enhanced UI components
- Setting up Google OAuth for seamless user authentication
- Integrating a rich text editor ([React Quill](https://github.com/zenoamaro/react-quill)) for blog content
- Designing an advanced database schema to support various blogging features
- Creating a mobile-responsive interface for a seamless experience across devices
- Developing a feature-rich admin dashboard to manage the application efficiently
- Validating backend input data with Zod for better security and reliability

## Getting Started
To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/BinayakShree/blog-app.git
    ```
2. Install the dependencies:
    ```bash
    cd blog-app
    npm run install:all
    ```
3. Set up environment variables for the frontend as mentioned in `.env.example` and `wrangler.toml` in the backend.
4. Run the development server:
    ```bash
    npm run dev
    ```
5. Access the app locally.


Note: This is the clone repo of the original deployment repo

## Author
**BinayakShree**

Connect with me on [LinkedIn](https://www.linkedin.com/in/binayak-shrestha-2aa22a322/) and check out my [portfolio](https://binayakshree.vercel.app/).
