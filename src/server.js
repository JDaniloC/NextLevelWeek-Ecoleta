const express = require("express")
const nunjucks = require("nunjucks")

const server = express()
const port = 3000
server.use(express.static("public"))

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.get("/search-results", (req, res) => {
    return res.render("search-results.html")
})

console.log(`Server listening in the port ${port}`)
server.listen(port)