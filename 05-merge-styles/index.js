const fs = require('fs').promises;
const path = require('path');

async function bundle(srcPath, dstPath) {
  const src = path.resolve(__dirname, ...srcPath);
  const dst = path.resolve(__dirname, ...dstPath);
  await fs.writeFile(
    dst,
    (await Promise.all(
      (await fs.readdir(src, { withFileTypes: true }))
        .filter(dirent => dirent.isFile() && path.extname(dirent.name) == '.css')
        .map(async (x) => fs.readFile(path.resolve(src, x.name), 'utf8'))
    )).join('\n')
  );
}

(async function() { bundle(['styles'], ['project-dist', 'bundle.css']); })();
