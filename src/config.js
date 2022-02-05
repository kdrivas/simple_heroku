import dotenv  from "dotenv"

dotenv.config()

const bdType = process.env.DB_OPTION
const configBD = {
  'FILE': process.env.URI_FILE,
  'MONGO': process.env.URI_MONGO,
}

export { bdType, configBD }