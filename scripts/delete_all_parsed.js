const {glob} = require("glob")
const path = require("path")
const sharp = require("sharp")
const fs = require("fs/promises")

glob(
  path.join(__dirname, "../tmp/*.json"),
  {},
  async (_err, files) => {
    for (const path1 of files) {
      console.log("deleting " + path1)

      await fs.unlink(path1)

      console.log("deleted " + path1)
    }
  }
)
