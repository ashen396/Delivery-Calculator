const express = require("express")
const { MongoClient } = require("mongodb")
const app = express()
const cors = require("cors")()
app.use(cors)
const mongoConnectionURL = "mongodb://127.0.0.1:27017"

async function GetData(props) {
  try {
    const client = new MongoClient(mongoConnectionURL)
    const db = client.db("CodeFusion")
    const collection = db.collection(props)
    var data = null

    client.connect()
    await collection.find().toArray().then((res) => {
      client.close()
      data = res
    })

    let jsonData = JSON.stringify(data)
    return jsonData
  } catch (ex) {
    console.log(ex)
  }
}

async function SaveData(body, props) {
  try {
    const client = new MongoClient(mongoConnectionURL)
    const db = client.db("CodeFusion")
    const collection = db.collection(props)

    client.connect()
    collection.insertOne(body).then((value) => {
      client.close()
      console.log(value)
    })
  }
  catch (ex) {
    console.log(ex)
  }
}

app.get("/states", (req, res) => {
  if (req.method === "GET") {
    GetData("States").then((data) => {
      res.write(data)
    }).finally(() => res.end())
  }
})

app.get("/cities", (req, res) => {
  if (req.method === "GET") {
    GetData("Cities").then((data) => {
      res.write(data)
    }).finally(() => res.end())
  }
})

app.post('/save', (req, res) => {
  if (req.method === "POST") {
    req.on('data', (data) => {
      // console.log(JSON.parse(data))
      // res.sendStatus(res.statusCode)
      // res.end()

      SaveData(JSON.parse(data), "Data")
      res.sendStatus(res.statusCode)
      res.end()
    })
  }
})

app.listen(3004)