
import express from 'express'
import bcrypt from 'bcrypt'
import cors from 'cors'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(cors())

app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { Published: true },
    include: { Author: true, Likes: true, Comment: true }
  })
  res.json(posts)
})
app.get('/feed/:id', async (req, res) => {
  const { id } = req.params
  const posts = await prisma.post.findMany({
    where: { id },
    include: {
      Author: true,
      Likes: true,
      Comment: {
        include: {
          Author: true,
          LikesComment: {
            include: { Author: true, AuthorLiked: true }
          }
        }
      }
    }
  })
  res.json(posts)
})

app.post('/post', async (req, res) => {
  const { Content, AuthorEmail, Published } = req.body

  console.log(req.body)
  const post = await prisma.post.create({
    data: {
      Content,
      Published,
      Author: { connect: { Email: AuthorEmail } }
    }
  })
  res.json(post)
})

app.put('/post/:id', async (req, res) => {
  const { id } = req.params

  const { Content, Published } = req.body
  const post = await prisma.post.update({
    where: { id },
    data: { Content, Published }
  })
  res.json(post)
})

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.delete({
    where: {
      id
    }
  })
  res.json(user)
})
app.get('/users/:id', async (req, res) => {
  const { id } = req.params

  const user = await prisma.user.findUnique({
    where: {
      id
    },
    include: {
      Posts: true,
      Likes: true,
      Comment: true
    }

  })
  res.json(user)
})
app.post('/users', async (req, res) => {
  const { Name, Username, Email, Password, Bio } = req.body
  const saltRounds = 10
  const passwordHashed = await bcrypt
    .genSalt(saltRounds)
    .then(salt => {
      console.log('Salt: ', salt)
      return bcrypt.hash(Password, salt)
    })
    .then(hash => {
      console.log('Hash: ', hash)

      return hash
    })
    .catch(err => console.error(err.message))
  console.log({ passwordHashed })
  try {
    const post = await prisma.user.create({
      data: {
        Name,
        Username,
        Password: passwordHashed,
        Email,
        Bio
      }
    })
    res.json(post)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email'
        )
      }
    }
    res.status(400).json({ message: e.message })
  }
})

app.get('/users', async (req, res) => {
  const user = await prisma.user.findMany({

  })
  res.json(user)
})

const server = app.listen(PORT)

export default server
