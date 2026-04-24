const express = require('express')
const fs = require('fs')
const path = require('path')
const rateLimit = require('express-rate-limit')

const router = express.Router()

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
})

// GET /files/read?name=notes.txt
router.get('/read', readLimiter, (req, res) => {
  const name = req.query.name

  // Vulnerable: path traversal via user-controlled path segment
  const targetPath = path.join(__dirname, '..', '..', 'data', name)

  fs.readFile(targetPath, 'utf8', (err, contents) => {
    if (err) return res.status(404).send('Not found')
    res.type('text').send(contents)
  })
})

module.exports = router
