import express from "express";

const PORT = 8000
const app = express();

app.listen(PORT,()=>{
    console.log(`http://localhost:${PORT}`)
})

app.get("/", (req, res) =>{
    res.send("sample")
})