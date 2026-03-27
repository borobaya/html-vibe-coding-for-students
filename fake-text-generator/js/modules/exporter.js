/**
 * File: exporter.js
 * Description: PNG export using html2canvas
 * Author: AI4Students
 * Created: 2025-01-20
 * Last Modified: 2025-01-20
 */

/**
 * Downloads a DOM element as a PNG image
 * @param {HTMLElement} element - The element to capture
 * @param {string} filename - Download filename
 * @returns {Promise<void>}
 */
export async function downloadAsPng(element, filename) {
  if (!window.html2canvas) {
    alert('Export library not loaded. Please try again in a moment.');
    return;
  }

  element.classList.add('exporting');

  try {
    const canvas = await window.html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor: null
    });

    const blob = await canvasToBlob(canvas);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Failed to export image. Please try again.');
  } finally {
    element.classList.remove('exporting');
  }
}

/**
 * Wraps canvas.toBlob in a Promise
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Blob>}
 */
function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Failed to create blob'));
    }, 'image/png');
  });
}
