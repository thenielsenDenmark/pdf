let pdfCount = 1;

// Handle adding new PDF file inputs dynamically
document.getElementById('add-pdf-btn').addEventListener('click', function() {
    pdfCount++;
    const pdfUploadContainer = document.getElementById('pdf-upload-container');
    const newLabel = document.createElement('label');
    newLabel.setAttribute('for', `pdf${pdfCount}`);
    newLabel.textContent = `Upload PDF #${pdfCount}:`;

    const newInput = document.createElement('input');
    newInput.type = 'file';
    newInput.id = `pdf${pdfCount}`;
    newInput.name = `pdf${pdfCount}`;
    newInput.accept = 'application/pdf';

    pdfUploadContainer.appendChild(newLabel);
    pdfUploadContainer.appendChild(newInput);
});

// Handle merging PDFs
document.getElementById('merge-btn').addEventListener('click', async function() {
    const files = [];
    for (let i = 1; i <= pdfCount; i++) {
        const fileInput = document.getElementById(`pdf${i}`);
        if (fileInput && fileInput.files.length > 0) {
            files.push(fileInput.files[0]);
        }
    }

    if (files.length > 0) {
        const mergedPdf = await mergePdfs(files);
        const blob = new Blob([mergedPdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const downloadLink = document.getElementById('download-link');
        downloadLink.href = url;
        downloadLink.download = 'merged.pdf';
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Download Merged PDF';
    }
});

// Handle reset functionality
document.getElementById('reset-btn').addEventListener('click', function() {
    // Clear the dynamic fields and reset to just one file input
    pdfCount = 1;
    const pdfUploadContainer = document.getElementById('pdf-upload-container');
    pdfUploadContainer.innerHTML = `
        <label for="pdf1">Upload PDF #1:</label>
        <input type="file" id="pdf1" name="pdf1" accept="application/pdf">
    `;

    // Hide the download link if it was shown before
    const downloadLink = document.getElementById('download-link');
    downloadLink.style.display = 'none';
    downloadLink.textContent = '';
});

// Function to merge PDFs using pdf-lib
async function mergePdfs(files) {
    const { PDFDocument } = PDFLib;
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const pdfBytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
}
