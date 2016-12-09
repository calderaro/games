import path from 'path'
import express from 'express'
import compress from 'compression'
import helmet from 'helmet'

const app = express()

app
  .use(helmet())
  .use(compress())
  .use('/build', express.static(path.join(__dirname, '../build')))
  .use('/static', express.static(path.join(__dirname, '../static')))
  .get('*', (req, res) => res.sendFile(path.join(__dirname, './index.html')))
  .listen(3000, err => console.log(err || 'Listening at port 3000 in production'))
