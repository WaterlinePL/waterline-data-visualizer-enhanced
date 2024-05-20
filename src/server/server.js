const handler = require('serve-handler');
const http = require('http');
const url = require('url');
const fs = require('fs');


const STATIONS_DIR = "data/stations";
const TIMESERIES_DIR = "data/timeseries";

const listFilesInDir = function(dir) {
  const files = [];
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith(".json")) {
      let id = file.split(".")[0];
      const dataEntry = {
        id: id,
      };
      files.push(dataEntry);
    }
  });
  return files;
}


const createJsonResponse = function(response, data) {
  response.writeHead(200, {'Content-Type': 'application/json'});
  response.write(JSON.stringify(data));
  response.end();
}


const listDatasets = function(response, dir, readName = false) {
  const data = {datasets: listFilesInDir(dir, readName)};
  return createJsonResponse(response, data);
}


const readJsonFile = function(filepath) {
  const fileData = fs.readFileSync(filepath);
  return JSON.parse(fileData);
}


const readDataResponse = function(response, datasetName) {
  const data = readJsonFile(`${datasetName}.json`);
  return createJsonResponse(response, data)
}


const server = http.createServer((request, response) => {
  if (request.method === "GET") {
    const endpoint = url.parse(request.url).pathname;
    console.log(endpoint);
    
    switch(endpoint) {
      case "/stations":
        return listDatasets(response, STATIONS_DIR);
      case "/timeseries":
        return listDatasets(response, TIMESERIES_DIR);
    }

    if (endpoint.startsWith("/stations/")) {
      const station = endpoint.split('/')[2];
      return readDataResponse(response, `${STATIONS_DIR}/${station}`);
    } else if (endpoint.startsWith("/timeseries/")) {
      const timeseries = endpoint.split('/')[2];
      return readDataResponse(response, `${TIMESERIES_DIR}/${timeseries}`);
    }
  }
  
  return handler(request, response);
});


let port = 8080;
if (process.argv.length >= 3) {
  port = parseInt(process.argv[2]);
}

server.listen(port, () => {
  console.log(`Running at http://localhost:${port}`);
});