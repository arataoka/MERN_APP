import express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import CryptoJS from 'crypto-js'
import { User } from './v1/models/user.ts'

const PORT = 8000
const app = express()
console.log(CryptoJS.AES)
dotenv.config()
app.use(express.json()) // これが無いとjsonとして認識がされないため、正常にrequestを送ることができない

const MONGO_DB_URL = process.env.MONGO_DB_URL ?? ''
const SECRET_KEY = process.env.SECRET_KEY ?? ''
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

// 新規登録
// TODO
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/api/v1/register', async (req, res) => {
  console.log(req.body.password)
  res.send(req.body.password)

  const { password } = req.body
  try {
    req.body.password = CryptoJS.AES.encrypt(password, SECRET_KEY)
    const user = await User.create(req.body)
    console.log(user)
  } catch (e) {
    console.log(e)
  }
})
