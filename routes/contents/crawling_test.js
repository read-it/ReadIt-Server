const express = require('express')
const router = express.Router()
const cheerio = require('cheerio')
const axios = require('axios')
const iconv = require('iconv').Iconv
const pythonShell = require('python-shell').PythonShell
const path = require('path')

const getHtml = async(requestUrl) => {
    try{
        return await axios.get(requestUrl)
    }catch(err){
        console.log(err)
    }
}
const options = {
    mode: 'text',
    pythonPath: '',
    pythonOptions: ['-u'],
    scriptPath: ''
  };

router.post('/',async (req, res) => {
    options.args = [req.body.url]
    var inputText = req.body.url
    var spawn = require('child_process').spawn
    var process = spawn('python',[path.join(__dirname,'crawl.py'),inputText])
    console.log("this")
    process.stdout.on('data',(data) => {
        console.log(data.toString())
    })
    process.stderr.on('data',(data) => {
        console.log(data.toString())
    })
})

       


module.exports = router