const fs = require('fs').promises;
const path = require('path');

(async function() {
  const d = path.resolve(__dirname, 'secret-folder');
  (await fs.readdir(d, { withFileTypes: true }))
    .filter(dirent => dirent.isFile())
    .forEach(async (x) => {
      const stat = await fs.stat(path.resolve(d, x.name));
      const ext = path.extname(x.name);
      console.log([
        path.basename(x.name, ext),
        ext ? ext.substr(1) : '',
        `${stat.size} bytes`
      ].join(' - '));
    });
})();
