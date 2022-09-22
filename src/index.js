const express = require("express");
const app = express();
const cheerio = require("cheerio");
const axios = require("axios");
// const {Telegraf} = require('telegraf')
// require("dotenv").config();

app.use(express.json());

// const bot = new Telegraf(process.env.BOT_TOKEN)

// bot.command('tasa', (ctx) => {
//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     `Tasa Monitor: ${fecha} ${valor} \nTasa BCV: ${dolar}`
//   )
// })

//url
const MONITOR_URL = "https://monitordolarvzla.com/";
const BCV_URL = "http://www.bcv.org.ve/";

//requests
// app.get('/', async (req, res) => {
const getMonitor = async () => {
  const response = await axios.get(MONITOR_URL);
  const $ = cheerio.load(response.data);

  const dolar = $(".home-primary-wrapper", response.data)
    .find(".left-column-wrapper")
    .find("div")
    .find(".post-content-wrapper")
    .find("p")
    .text();

  let fecha = dolar.substring(dolar.indexOf("Promedio"), dolar.indexOf("Bs"));
  // console.log(fecha);
  let valor = dolar.substring(dolar.indexOf("Bs"), dolar.indexOf("por"));

  // console.log("tasa Monitor:", fecha, valor);

  //return value
  let tasa = fecha + valor;
  return tasa
};

// getMonitor();
// })

const getBCV = async () => {
  const response = await axios(BCV_URL);
  const $ = cheerio.load(response.data);

  const dolar = $("#sidebar_first", response.data)
    .find("#dolar")
    .find(".recuadrotsmc")
    .find(".centrado")
    .find("strong")
    .text()
    .trim();
  
    return dolar
};
// getBCV()

app.get('/', async(req, res) => {
  const monitor = await getMonitor()
  const BCV = await getBCV()
  res.send(`Tasa Monitor: ${monitor} \nTasa BCV: ${BCV}`)
  
})

//server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
