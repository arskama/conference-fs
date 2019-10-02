/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

let dirHandle = undefined;
let fileHandle = undefined;


/* exported getFileHandle, getNewFileHandle, readFile, writeFile */

/**
 * Open a handle to an existing file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the existing file.
 */
function getFileHandle() {
  const handle = window.chooseFileSystemEntries();
  return handle;
}

/**
 * Create a handle to a new (text) file on the local file system.
 *
 * @return {!Promise<FileSystemFileHandle>} Handle to the new file.
 */
function getNewFileHandle() {
  const opts = {
    type: 'saveFile',
    accepts: [{
      description: 'Text file',
      extensions: ['txt'],
      mimeTypes: ['text/plain'],
    }],
  };
  const handle = window.chooseFileSystemEntries(opts);
  return handle;
}

function getNewDirectoryHandle() {
  const opts = {
    type: 'openDirectory',
    accepts: [{
      description: 'Text file',
      extensions: ['txt'],
      mimeTypes: ['text/plain'],
    }],
  };
  const handle = window.chooseFileSystemEntries(opts);
  return handle;
}

async function getFileContents(handle) {
    const file = await handle.getFile();
    return new Response(file).text();
}

/**
 * Reads the raw text from a file.
 *
 * @param {File} file
 * @return {!Promise<string>} A promise that resolves to the parsed string.
 */
function readFile(file) {
  // If the new .text() reader is available, use it.
  console.log("read file");
  if (file.text) {
    console.log("new text");
    return file.text();
  }
  console.log("trad_file_read");
  // Otherwise use the traditional file reading technique.
  return _readFileLegacy(file);
}

/**
 * Reads the raw text from a file.
 *
 * @private
 * @param {File} file
 * @return {Promise<string>} A promise that resolves to the parsed string.
 */
function _readFileLegacy(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('loadend', (e) => {
      const text = e.srcElement.result;
      resolve(text);
    });
    reader.readAsText(file);
  });
}

/**
 * Writes the contents to disk.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to write to.
 * @param {string} contents Contents to write.
 * @param {number} offset where to start writing.
 */
async function writeFile(fileHandle, contents, offset = 0) {
  // Create a writer
  console.log("writeFile : FS: " + fileHandle );
  const writer = await fileHandle.createWriter();
  // Make sure we start with an empty file
  if (offset == 0)
      await writer.truncate(0);

  // Write the full length of the contents
  await writer.write(offset, contents);
  // Close the file and write the contents to disk
  await writer.close();
}

/**
 * create Empty file.
 *
 * @param {name}.
 * @param {parent}.
 */
async function createEmptyFile(name, parent) {
    const dir = parent ? parent : await FileSystemDirectoryHandle.getSystemDirectory({ type: 'sandbox' });
    const handle = await dir.getFile(name, { create: true });

    return handle;
}

/* HELPERS */
async function getFileSize(handle) {
  const file = await handle.getFile();
  return file.size;
}

