const fs = require('fs').promises;
const path = require('path');

async function* walk(tree) {
  const d = path.resolve(...tree);
  const items = await fs.readdir(d, {withFileTypes: true});
  for (let x of items) {
    if (x.isFile()) { yield [tree, x.name]; }
    else if (x.isDirectory()) { yield* walk(tree.concat([x.name])); }
  }
}

async function copy(src, dst) {
  await fs.rm(path.resolve(__dirname, dst), {recursive: true, force: true});
  await fs.mkdir(path.resolve(__dirname, dst), {recursive: true});
  const it = walk([__dirname, src]);
  let pathAndFile;
  while ((pathAndFile = (await it.next()).value) !== undefined) {
    let [treeSrc, fn] = pathAndFile;
    let treeDst = [...treeSrc];
    treeDst[1] = dst;
    await fs.mkdir(path.resolve(...treeDst), {recursive: true});
    await fs.copyFile(path.resolve(...treeSrc, fn), path.resolve(...treeDst, fn));
  }
}

(async function() { copy('files', 'files-copy'); })();
