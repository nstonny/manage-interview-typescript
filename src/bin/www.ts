import * as dotenv from "dotenv-safe";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env"});
}
// get the current environment
const env: any = process.env.NODE_ENV;
// convert to uppercase
const envString: string = env.toUpperCase();

process.env.MONGODB_URI = process.env["MONGODB_URI_" + envString];
process.env.PORT = process.env["PORT_" + envString];
process.env.JWT_SECRET = process.env["JWT_SECRET_" + envString];

import "../index";
