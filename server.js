const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

server.use(express.static('public'))
server.use(express.urlencoded({extended: true}))

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '123',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//Template engine
nunjucks.configure("./", {
    express: server,
    noCache: true,
})


//Apresentação da pagina HTML
server.get("/", function(req, res){
    db.query('select name, email, blood from donors', function(err, result){
        if(err) return res.send("Erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", {donors})

    })
})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == "" ){
        return res.send("Todos os campos são obrigatórios!")
    }

    const query = `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]
    db.query(query, values, function(err){
        if(err) return res.send("Erro no banco de dados.")

        return res.redirect("/")
    })
})


//Startando o servidor
server.listen(3000, function(){
    console.log("Iniciando")
})
