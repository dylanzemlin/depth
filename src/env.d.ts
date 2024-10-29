declare namespace NodeJS {
    interface ProcessEnv {
        IRON_COOKIE: string;
        IRON_PASSWORD: string;

        GOOGLE_CLIENT_SECRET: string;
        GITHUB_CLIENT_SECRET: string;

        NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
        NEXT_PUBLIC_GOOGLE_REDIRECT: string;

        NEXT_PUBLIC_GITHUB_CLIENT_ID: string;
        NEXT_PUBLIC_GITHUB_REDIRECT: string;

        NEXT_PUBLIC_APP_URL: string;
    }
}