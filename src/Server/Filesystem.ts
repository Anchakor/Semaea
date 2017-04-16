import fs = require("fs");
import path = require("path");

const fileEncoding = "utf8";

export function readFileString(path: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, fileEncoding, (err, data) => {
      if (err) {
        reject(err); return;
      }
      resolve(data);
    });
  });
}

export function writeFileString(filePath: string, data: string) {
  return new Promise<undefined>((resolve, reject) => {
    mkdirp(path.dirname(filePath))
    .then(() => {
      fs.writeFile(filePath, data, { encoding: fileEncoding, flag: "w" }, (err) => {
        if (err) {
          reject(err); return;
        }
        resolve(undefined);
      });
    }).catch((err) => reject(err));
  });
}

export interface IDirectoryEntry {
  stats: fs.Stats
  name: string
}

export function listDirectorySimple(path: string) {
  return listDirectoryCustom(path, (entry) => entry);
}

export function listDirectory(path: string) {
  return listDirectoryCustom(path, (entry) => {
    return { stats: fs.statSync(entry), name: entry } as IDirectoryEntry
  });
}

export function listDirectoryCustom<T>(path: string, callback: (entry: string) => T) {
  return new Promise<T[]>((resolve, reject) => {
    fs.readdir(path, (err, entry) => {
      if (err) {
        reject(err); return;
      }
      resolve(entry.map(callback));
    });
  });
}

/** Make directories recursively until dirPath is a directory */
function mkdirp(dirPath: string) {
  return new Promise<undefined>((resolve, reject) => {
    fs.exists(dirPath, (exists) => {
      if (exists) {
        fs.stat(dirPath, (err, stats) => {
          if (err) {
            reject(err); return;
          }
          if (!stats.isDirectory()) {
            reject("File exists but is not a directory."); return;
          }
          resolve(undefined);
        });
        return;
      }
      const parentDir = path.dirname(dirPath);
      mkdirp(parentDir)
      .then(() => {
        fs.mkdir(dirPath, (err) => {
          if (err) {
            reject(err); return;
          }
          resolve(undefined);
        });
      }).catch((err) => reject(err));
    });
  });
}
