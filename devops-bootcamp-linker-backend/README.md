## Linker Backend

This repository contains the backend service for the DevOps Bootcamp Demo project Linker.
It is built with NestJS and serves as the backend for the Linker Frontend Application which will be used by the community for their projects.

### Tech & Tools

This project is built with the following technologies:

- NestJS — backend framework
- Node.js & TypeScript
- npm for dependency management
- Folder structure follows best practices for scalability

### Getting Started
Follow these steps to run the backend locally:
1.	Clone the repository
    ```
    git clone https://github.com/DevOps-Bootcamp-2026/devops-bootcamp-linker-backend.git
    ```
2.	Navigate into the project folder
    ```
    cd devops-bootcamp-linker-backend
    ```
3.	Install dependencies
    ```
    npm inatall
    ```
4. Edit .env file

    Rename the .env.example file to .env
    ```
    # Database
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE?schema=public"
    PORT=3001
    # NextAuth
    NEXTAUTH_SECRET="changeme"
    NEXTAUTH_URL="http://localhost:3000"

    # Cloudinary (keep your existing values)
    CLOUDINARY_CLOUD_NAME="changeme"
    CLOUDINARY_API_KEY="changeme"
    CLOUDINARY_API_SECRET="changeme"
    ```

5. Run Data Migration

    ```
    npx prisma migrate dev
    ```

6. Start Application

    ```
    npm run dev
    ```

    ![Alt text](images/api.png)
> The backend service will start on the default NestJS port (http://localhost:3001).