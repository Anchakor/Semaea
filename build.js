const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const echo = console.log;
const args = process.argv.slice(1);

function mainRun() {
  switch (args[1]) {
    case 'debug':
      mainBuild() &&
      echo("Debug build successful");
      break;
    case 'release':
      mainBuild() &&
      echo("Release build successful");
      break;
    case 'simple':
      mainBuild() &&
      echo("Simple build successful");
      break;
    case 'clean':
      const outputDir = 'output';
      rmDir(outputDir, false);
      echo(`Output directory '${outputDir}' was wiped`);
      break;
    default:
      echo('To build use `node build.js debug` (or "release", "simple" or "clean").');
  }
}

function mainBuild() {
  const webpackLocation = 'node_modules/webpack-cli/bin/webpack.js'
  return sh('node', [webpackLocation]) && 
    sh('node', [webpackLocation, '--config', 'webpackServer.config.js']);
}

function sh(command, args) {
  var p = child_process.spawnSync(command, args)
  if (p.stdout) { process.stdout.write(p.stdout); }
  if (p.stderr) { process.stderr.write(p.stderr); }
  return (p.status == 0)
}

function rmDir(dirPath, removeSelf) {
  if (removeSelf === undefined)
    removeSelf = true;
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
  if (removeSelf)
    fs.rmdirSync(dirPath);
}

mainRun();
