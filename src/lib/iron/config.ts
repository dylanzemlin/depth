import { SessionOptions } from "iron-session";

const ironConfig = {
    cookieName: process.env.IRON_COOKIE,
    password: process.env.IRON_PASSWORD,
    secure: process.env.NODE_ENV === "production",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    }
} as SessionOptions;

export default ironConfig;