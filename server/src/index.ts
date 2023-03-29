import express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import CryptoJS from 'crypto-js'
import { authRouter } from './v1/routes/auth.ts'

const PORT = 8000
const app = express()
console.log(CryptoJS.AES)
dotenv.config()
app.use(express.json()) // これが無いとjsonとして認識がされないため、正常にrequestを送ることができない
app.use('/api/v1/', authRouter)

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
