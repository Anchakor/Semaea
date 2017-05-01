import fs = require('fs');
import path = require('path');

const fileEncoding = 'utf8';

export function readFileString(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, fileEncoding, (err, data) => {
      if (err) {
        reject('Error reading file: '+filePath); return;
      }
      resolve(data);
    });
  });
}

export function writeFileString(filePath: string, data: string) {
  return new Promise<undefined>((resolve, reject) => {
    mkdirp(path.dirname(filePath))
    .then(() => {
      fs.writeFile(filePath, data, { encoding: fileEncoding, flag: 'w' }, (err) => {
        if (err) {
          reject('Error writing file: '+filePath); return;
        }
        resolve(undefined);
      });
    }).catch((err) => reject(err));
  });
}

export interface IDirectoryEntry {
  kind: 'file' | 'directory'
  name: string
}

export function listDirectorySimple(dirPath: string) {
  return listDirectoryCustom(dirPath, (entry) => path.join(dirPath, entry));
}

export function listDirectory(dirPath: string) {
  return listDirectoryCustom(dirPath, (entry) => {
    const entryPath = path.join(dirPath, entry);
    const stats = fs.statSync(entryPath);
    return { 
      kind: stats.isDirectory() ? 'directory' : 'file', 
      name: entry 
    } as IDirectoryEntry
  });
}

export function listDirectoryCustom<T>(dirPath: string, callback: (entry: string) => T) {
  return new Promise<T[]>((resolve, reject) => {
    fs.readdir(dirPath, (err, entry) => {
      if (err) {
        reject('Error getting list of directory: '+dirPath); return;
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
            reject('File exists but is not a directory.'); return;
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
