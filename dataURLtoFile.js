//本地运行，用于将网页中 base64 编码的图片保存到本地，并修改 img 的 src 以减小 html 文件的大小 

function b64tofile(data) {
    var buffer = new ArrayBuffer(data.length);
    var view = new Uint8Array(buffer);

    // fill the view, using the decoded base64
    for (var n = 0; n < data.length; n++) {
        view[n] = data.charCodeAt(n);
    }

    return view
}

async function delay() {
    return new Promise(resolve => {
        setTimeout( () => resolve(), 50)
    }
    )
}

function  *getImages() {
    for (const row of document.querySelectorAll("[id^=row]")) {
        for (const [idx,img] of Object.entries(row.querySelectorAll('img'))) {
            const [type,data] = img.getAttribute('data-src').split(';')
            const ext = type.split('/')[1]

            yield ({ ext, type, data, idx, img, row })
        }
    }
}

function download() {
    const zip = new JSZip();

    for(const { ext, type, data, idx } of getImages()) {
        const blob = new Blob([b64tofile(atob(data.replace('base64,', '')))],{
            type: type.replace('data:')
        })
        zip.file(`${row.id}-${idx}.${ext}`, blob);
    }
    
    zip.generateAsync({
        type: "blob"
    }).then(function(content) {
        // see FileSaver.js
        saveAs(content, "nai.zip");
    });
}

function format() {
    for(const { ext, type, data, idx, img, row } of getImages()) {
        img.setAttribute('data-src', `/img/${row.id}-${idx}.${ext}`)
        img.src = ""
    }
}

format()