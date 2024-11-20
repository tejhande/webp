let zip = new JSZip(); // Define zip in the global scope

function convertToWebP() {
    const fileInput = document.getElementById('fileInput');
    const files = fileInput.files;
    if (!files.length) {
        alert('Please select at least one image file.');
        return;
    }

    const convertedFilesDiv = document.getElementById('convertedFiles');
    convertedFilesDiv.innerHTML = '';

    if (files.length === 1) {
        // Handle single file
        const file = files[0];
        if (!file.type.match('image.*')) {
            alert('Please select an image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const dataURL = canvas.toDataURL('image/webp');

                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                
                // Convert the file and trigger download
                const blob = dataURLtoBlob(dataURL);
                saveAs(blob, fileName);

                // Show "Download" button
                document.getElementById('downloadBtn').style.display = 'block';
                document.getElementById('downloadAllBtn').style.display = 'none';
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        // Handle multiple files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.match('image.*')) {
                alert('Please select image files only.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/webp');

                    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
                    zip.file(fileName, dataURL.split(',')[1], { base64: true });

                    // Display the converted file name
                    const fileNameDiv = document.createElement('div');
                    fileNameDiv.textContent = fileName;
                    convertedFilesDiv.appendChild(fileNameDiv);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }

        // Show "Download All" button
        document.getElementById('downloadBtn').style.display = 'none';
        document.getElementById('downloadAllBtn').style.display = 'block';
    }
}

function downloadSingleFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
    const blob = dataURLtoBlob(file);
    saveAs(blob, fileName);
}

function downloadAll() {
    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'images.zip');
    });
}

// Helper function to convert Data URL to Blob
function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}
