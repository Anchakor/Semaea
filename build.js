const child_process = require('child_process');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const echo = console.log;
const args = process.argv.slice(1);

// modify this to control what gets built
const modulesToBuild = [ 'build-Main.json'/*, 'build-Example1.json', 'build-Example2.json',*/];

function mainRun(moduleConfig) {
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
      rmDir(moduleConfig.outputDir, false);
      echo(`Output directory '${moduleConfig.outputDir}' was wiped`);
      break;
    default:
      echo('To build use `node build.js debug` (or "release", "simple" or "clean").');
  }
}

function mainBuild() {
  return sh('webpack') && sh('webpack', ['--config', 'webpackServer.config.js']);
}

function sh(command, args) {
  var p = child_process.spawnSync(command, args)
  if (p.stdout) { process.stdout.write(p.stdout); }
  if (p.stderr) { process.stderr.write(p.stderr); }
  return (p.status == 0)
}

function rJsPack(moduleConfig, noOptimize) {
  var args = ['node_modules/requirejs/bin/r.js', '-o', 'rjsbuild.js',
    'baseUrl='+moduleConfig.outputDir, 
    'name='+moduleConfig.browserModule, 
    'out='+moduleConfig.packOutputFilePath];
  if (noOptimize) {
    args.push("optimize=none")
  }
  return sh("node", args);
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

class Config {
  constructor() {
    this.outputDir = 'output';
    this.packOutputFileName = 'app_client.js';
    this.browserModule = 'examples/Example1';
    //this.packOutputFilePath = path.join(outputDir, packOutputFileName)
  }
}

function getModuleConfig(moduleConfigFile) {
  const fileContents = fs.readFileSync(moduleConfigFile);
  var moduleConfig = JSON.parse(fileContents); // as Config
  moduleConfig.packOutputFilePath = path.join(moduleConfig.outputDir, moduleConfig.packOutputFileName)
  return moduleConfig;
}

function main() {
  //sh("echo", ["arguments:"].concat(process.argv));
  modulesToBuild.forEach(function(moduleConfigFile) {
    const moduleConfig = getModuleConfig(moduleConfigFile);
    mainRun(moduleConfig);
  }, this);
}

main();
