/*
Mestrado em Engenharia Informática e Tecnologia Web
Visualização de Informação
Projeto Final
Autor: Duarte Cota - 2022
Ficheiro principal da API
*/

const express = require('express')
const path = require('path')
const app = express()

app.use(express.static('./src'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listenning on port ${port}`)
})