document.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation();

  for (const f of event.dataTransfer.files) {
    console.log('File Path of dragged files: ', f.path)
    window.loaderNew(f.path);
  }
});
  
document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});
