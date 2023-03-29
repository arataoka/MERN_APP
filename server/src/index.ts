import express from 'express'
import * as mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import CryptoJS from 'crypto-js'
import { User } from './v1/models/user.ts'
import JWT from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'

const PORT = 8000
const app = express()
console.log(CryptoJS.AES)
dotenv.config()
app.use(express.json()) // これが無いとjsonとして認識がされないため、正常にrequestを送ることができない

const MONGO_DB_URL = process.env.MONGO_DB_URL ?? ''
const SECRET_KEY = process.env.SECRET_KEY ?? ''
const TOKEN_KEY = process.env.TOKEN_SECRET_KEY ?? ''
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
app.post('/api/v1/register', body('username').isLength({ min: 8 }).withMessage('ユーザー名は8文字以上である必要があります'), async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  console.log(req.body.password)
  res.send(req.body.password)

  const { password } = req.body
  try {
    req.body.password = CryptoJS.AES.encrypt(password, SECRET_KEY)
    const user = await User.create(req.body) // mongoDBにuserを格納
    console.log(user)
    const token = JWT.sign({ id: user._id }, TOKEN_KEY, { expiresIn: '24h' })
    console.log(token)
    return res.status(200).json({ user, token })
  } catch (error) {
    return res.status(500).json(error)
    console.log(error)
  }
})
