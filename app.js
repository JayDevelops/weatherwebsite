//  Require the packages you'll use below here
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

//  Init the local port, body parser module and the app itself
const app = express();
const localPort = 3000;
app.use(bodyParser.urlencoded({ extended: true }));

//  TODO: Global functions to use for your app below
const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// TODO: START WITH THE FRONT AND BACK END HERE
//  Send the index file then get any data the user is going to post
app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

//  Let the user post data, then send back anything here to the user
app.post("/", (req, res) => {
  //  API url manipulation below
  const query = req.body.cityName;
  const units = "imperial";
  const apiKey = "d10676a6f254ed117a81173968b8c0bb";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`;

  //  TODO: Get the weather data here by passing in the URl
  https.get(url, (response) => {
    response.on("data", (data) => {
      //  Store the weather data as a javascript object
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const city = weatherData.name;
      const description = weatherData.weather[0].description;

      //  Icon manipulationt to write it into the client side browser
      const icon = weatherData.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/wn/${icon}.png`;
      const finalIcon = `<img src="${iconUrl}" alt="Weather icon in the city" style="display: block; margin-left: auto; margin-right: auto; margin-bottom: 20%; width: 4rem">`;

      //  Send the weather data to the user front end side
      res.write(
        `<h1 style="text-align: center; margin-top: 20%;">The temperature in ${city} is ${temp} degrees Fahrenheit</h1>`
      );
      res.write(
        `<p style="text-align: center; margin-top: 2%;">Weather description is ${description}.</p>`
      );
      res.write(`${finalIcon}`);

      res.send();
    });
  });
});

//  Start the app on the local machine
app.listen(localPort, () => {
  console.log(`App is running on http://localhost:${localPort}`);
});
