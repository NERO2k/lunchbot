const {glob} = require("glob")
const path = require("path")
const sharp = require("sharp")
const fs = require("fs/promises")

glob(
  path.join(__dirname, "../tmp/*.png"),
  {},
  async (_err, files) => {
    for (const path1 of files) {
      console.log("converting " + path1)
      let sharpStream = sharp(path1);

      await sharpStream
        .clone()
        .tiff()
        .toFile(path1.replace(".png", ".tif"))

      console.log("converted " + path1)

      await fs.rename(path1, path1.replace(".png", ".source"))

      console.log("renamed " + path1)
    }
  }
)
