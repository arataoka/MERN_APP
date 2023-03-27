import express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'

const PORT = 8000
const app = express()

dotenv.config()

const MONGO_DB_URL = process.env.MONGO_DB_URL ?? ''
try {
  await mongoose.connect(MONGO_DB_URL)
  console.log('DB 接続中')
} catch (e) {
  console.log(e)
}

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
  res.send('sample')
})
