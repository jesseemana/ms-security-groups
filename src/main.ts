import 'dotenv/config'
import express, { Request, Response } from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

const PORT = parseInt(process.env.PORT as string) || 8080

app.use(cors())

app.get('/healthz', (_req: Request, res: Response) => {
  res.status(200).json({ msg: 'Health OK!' })
})

app.get('/api/security-groups', async (req: Request, res: Response) => {
  const token = req.body
  try {
    const results = await axios.get('https://graph.microsoft.com/v1.0/me/memberOf', 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const groups = results.data
    res.status(200).json({ data: groups })
  } catch (error) {
    // @ts-ignore
    console.error('Failed to get security groups.', error.message)
    res.status(500).json({ msg: 'Internal Server Error' })
    return
  }
})

function main() {
  app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`)
  })
}

main()
