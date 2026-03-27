/**
 * File: upload.js
 * Description: Handles image upload via file picker and drag-and-drop
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * Validates a file is an allowed image type and within size limit
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please upload a PNG, JPEG, GIF or WebP image.' };
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Image must be under 10 MB.' };
  }
  return { valid: true };
}

/**
 * Reads a file as a data URL string
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads an Image element from a source URL
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = src;
  });
}

/**
 * Validates, reads and loads a file into an Image element
 * @param {File} file
 * @param {function} callback - Called with the loaded HTMLImageElement
 */
export async function handleFile(file, callback) {
  const result = validateFile(file);
  if (!result.valid) {
    alert(result.error);
    return;
  }

  try {
    const dataURL = await readFileAsDataURL(file);
    const image = await loadImage(dataURL);
    callback(image);
  } catch (err) {
    alert(err.message);
  }
}

/**
 * Attaches drag-and-drop and click listeners to the upload zone
 * @param {HTMLElement} dropZone
 * @param {HTMLInputElement} fileInput
 * @param {function} onFileLoaded - Called with the loaded HTMLImageElement
 */
export function addDragDropListeners(dropZone, fileInput, onFileLoaded) {
  // Click to open file picker
  dropZone.addEventListener('click', () => fileInput.click());

  // File input change
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
      handleFile(fileInput.files[0], onFileLoaded);
    }
  });

  // Drag enter/over — visual feedback
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  // Drop
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file, onFileLoaded);
    }
  });
}
