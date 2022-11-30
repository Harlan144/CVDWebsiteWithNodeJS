// makeFilePath.js

const uuid = require('uuid');
const path = require('path');


class makeFilePath {
  constructor(folder) {
    this.folder = folder;
  }
  async save(buffer) {
    const filename = makeFilePath.filename();
    const filepath = this.filepath(filename);
    return filename;
  }
  static filename() {
    return `${uuid.v4()}.png`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = makeFilePath;