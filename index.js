const connectToMongo = require('./db');
const express = require('express')
connectToMongo();
var cors = require('cors')

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


app.use('/api/notes', require('./routes/notes'))
app.use('/api/auth', require('./routes/auth'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})


