const app = require("./app")

const server = app.listen(5000, "0.0.0.0", () => {
  console.log("http://0.0.0.0:5000/")
})

process.on("SIGINT", () => {
  // Remove the "^C"
  process.stdout.write("\b\b")
  // Call the full exit handler
  process.exit()
})

process.on("exit", () => {
  console.log("Stopping...")
  // Shut down the server completly to prevent wierd bugs
  server.close()
})
