require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser")
const https=require("https");

const app=express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
console.log(process.env.API_KEY);
app.get("/",function(req,res){
 res.sendFile(__dirname+"/index.html");
});

app.post("/",function(req,res){
  // console.log(req.body.cityName);
  const query=req.body.cityName;
  const appid=process.env.API_KEY;
  const unit="metric";
  const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&units="+unit+"&appid="+appid ;
  https.get(url,function(response){
    console.log(response.statusCode + ' OK');
    response.on("data",function(data){
      const weatherData=JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const humidity =weatherData.main.humidity;
      const pressure = weatherData.main.pressure;
      const icon = weatherData.weather[0].icon;
      const imageURL = 'http://openweathermap.org/img/wn/' + icon + '@2x.png';

      res.write("<h1>The temperature of the "+ query +" is : "+ temperature + " degree Celsius.</h1>");
      res.write("<hr>")
      res.write("Humidity :  " + humidity);
      res.write("<hr>")
      res.write("<hr>Pressure :  " + pressure);
      res.write("<hr>")
      res.write("The Weather Description is : " + description);
      res.write("<hr>")
      res.write("<img src="+ imageURL+">");
      res.send();
    })
  })
})


app.listen(3000,function(req,res){
  console.log("server is running");
})
