const express = require("express")
const nunjucks = require("nunjucks")
const db = require("./database/db")

const server = express()
const port = 3000
server.use(express.static("public"))

server.use(express.urlencoded({ extended: true })) // Habilita o uso do req.body

nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    req.query

    return res.render("create-point.html")
})

server.get("/search-results", (req, res) => {
    const search = req.query.search

    if (search == "") {
        return res.render("search-results.html", { places: [], total: 0 })
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if (err) {
            return console.log(err)
        }

        const total = rows.length

        return res.render("search-results.html", { places: rows, total })
    })
})

server.post("/savepoint", (req, res) => {
    const dados = req.body

    console.log(dados)

    db.run(`
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT,
            name TEXT,
            address TEXT,
            address2 TEXT,
            state TEXT,
            city TEXT,
            items TEXT
        );
    `)

    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `

    const values = [
        dados.image,
        dados.name,
        dados.address,
        dados.address2,
        dados.state,
        dados.city,
        dados.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send({ error: "Erro no cadastro" })
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }   

    db.run(query, values, afterInsertData)
})

console.log(`Server listening in the port ${port}`)
server.listen(port)