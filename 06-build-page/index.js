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

(async function() {
  const dst = path.resolve(__dirname, 'project-dist');
  await fs.rm(dst, {recursive: true, force: true});
  await fs.mkdir(dst, {recursive: true});

  const componentsDir = path.resolve(__dirname, 'components');
  let template = await fs.readFile(path.resolve(__dirname, 'template.html'), 'utf8');
  let componentNames = (await fs.readdir(componentsDir, { withFileTypes: true }))
    .filter(dirent => dirent.isFile() && path.extname(dirent.name) == '.html')
    .map(x => x.name);
  for (let name of componentNames) {
    let component = await fs.readFile(path.resolve(componentsDir, name), 'utf8');
    template = template.split(`{{${path.basename(name, '.html')}}}`).join(component);
  }
  await fs.writeFile(path.resolve(dst, 'index.html'), template);

  bundle(['styles'], [dst, 'style.css']);
  copy('assets', dst + '/assets');
})();
