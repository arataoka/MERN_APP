// 新規登録
// TODO
// eslint-disable-next-line @typescript-eslint/no-misused-promises
import CryptoJS from 'crypto-js'
import { User } from '../models/user.ts'
import JWT from 'jsonwebtoken'
import { Router } from 'express'
import { body, validationResult } from 'express-validator'

const SECRET_KEY = process.env.SECRET_KEY ?? ''
const TOKEN_KEY = process.env.TOKEN_SECRET_KEY ?? ''
const router = Router()

router.post(
  'register',
  body('username')
    .isLength({ min: 8 })
    .withMessage('ユーザー名は8文字以上である必要があります'),
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    console.log(req.body.password)
    res.send(req.body.password)

    const { password } = req.body

    void (async () => {
      try {
        req.body.password = CryptoJS.AES.encrypt(password, SECRET_KEY)
        const user = await User.create(req.body) // mongoDBにuserを格納
        console.log(user)
        const token = JWT.sign({ id: user._id }, TOKEN_KEY, {
          expiresIn: '24h',
        })
        console.log(token)
        return res.status(200).json({ user, token })
      } catch (error) {
        return res.status(500).json(error)
      }
    })()
  }
)

export const authRouter = router
