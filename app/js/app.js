const form = document.querySelector('#img-form');
const img = document.querySelector('#select-img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');


function loadImage(e) {
    const file = e.target.files[0];

    if (!validImage(file)) {
        return errorAlert("Please select an image");
    }
    
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = function () {
        widthInput.value = this.width; 
        heightInput.value = this.height; 
    }
    
    filename.innerText = file.name;
    outputPath.innerText = path.join(os.homedir(), 'ImageScalePro');
    
    // return successAlert("Image resized");

}

function sendImage(e){
    e.preventDefault();

    const width = widthInput.value;
    const height = heightInput.value;
    const imgPath = img.files[0].path;

    if (!img.files[0]) {
        return errorAlert('Please upload an image first');
    }

    if (width === '' || height== '') {
        return errorAlert("Please make sure the width and height are");
    }

    ipcRenderer.send('image:resize', {
        imgPath,
        width,
        height
    })

}

function validImage(file) {
    const acceptedImgExtensions = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];
    return file && acceptedImgExtensions.includes(file['type']);
}

ipcRenderer.on('image:done', ()=> {
    successAlert("Image resized successfully");
})

function errorAlert(message){
    toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'red',
            color: 'white',
            textAlign: 'center'
        }
    })
}

function successAlert(message){
    toastify.toast({
        text: message,
        duration: 5000,
        close: false,
        style: {
            background: 'green',
            color: 'white',
            textAlign: 'center'
        }
    })
}



img.addEventListener('change', loadImage);
form.addEventListener('submit', sendImage)