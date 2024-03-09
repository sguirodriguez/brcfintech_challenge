const dotenv = require("dotenv");

dotenv.config();

interface Config {
  port: number;
  database: {
    name: string;
    username: string;
    password: string;
    host: string;
    port: number;
  };
  corsOrigin: string;
  jwtSecret: string;
}

const configuration: Config = {
  port: Number(process.env.PORT),
  database: {
    name: String(process.env.DB_DATABASE),
    username: String(process.env.DB_USERNAME),
    password: String(process.env.DB_PASSWORD),
    host: String(process.env.DB_HOST),
    port: Number(process.env.DB_PORT),
  },
  corsOrigin: String(process.env.CORS_ORIGIN),
  jwtSecret: String(process.env.JWT_SECRET),
};

export default configuration;
