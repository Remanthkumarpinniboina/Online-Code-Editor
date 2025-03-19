import http from "http";
import { exec } from "child_process";
import fs from "fs";

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/execute") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { language, code } = JSON.parse(body);
      let fileExtension = language === "python" ? "py" : language === "cpp" ? "cpp" : "js";
      let fileName = `temp.${fileExtension}`;

      fs.writeFile(fileName, code, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ output: "Error saving file" }));
        }

        let command = `node ${fileName}`;
        if (language === "python") command = `python3 ${fileName}`;
        if (language === "cpp") command = `g++ ${fileName} -o temp && ./temp`;

        exec(command, (error, stdout, stderr) => {
          fs.unlink(fileName, () => {});
          if (language === "cpp") fs.unlink("temp", () => {});

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ output: error ? stderr : stdout }));
        });
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(5000, () => console.log("Server running on port 5000"));
