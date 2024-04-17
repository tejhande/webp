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

                // Convert the file name to WebP format
                const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";

                // Add the converted file to the zip
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

    // Show the "Download All" button
    document.getElementById('downloadAllBtn').style.display = 'block';
}

function downloadAll() {
    zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'images.zip');
    });
}