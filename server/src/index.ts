import express, { Express } from "express";
import { listFiles, loadContent, saveContent } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/saveContent", saveContent);
app.get("/api/loadContent", loadContent);
app.get("/api/listFiles", listFiles);
app.listen(port, () => console.log(`Server listening on ${port}`));
