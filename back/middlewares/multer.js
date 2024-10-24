import multer from 'multer'
import path from 'path'

// v1 opción minima
// export const upload = multer({dest: 'public/uploads/'})

// v2 opción con nombre personalizado
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aquí definimos donde subiremos los archivos
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        // Aquí definimos el nombre que tendríia nuestro upload

        //  Guardar el archivo con el mismo nombre con el que lo subimos
        // cb(null, file.originalname) 

        // V2 Generar un nombre ÚNICO + EXTENSION (avatar-123434566.png)
        // const extension = path.extname(file.originalname)
        // const uniqueNumber=Date.now() + "-" + Math.round(Math.random()*1E9) 
        // cb(null, `${file.filename}-${uniqueNumber}${extension}`);

        // V3 Con fecha tipo DB "avatar-2024-09-23-12344562343.png"
        const extension = path.extname(file.originalname)
        const uniqueSuffix = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
        cb(null, `${file.filename}-${uniqueSuffix}${extension}`);

    }
});

export const upload = multer({storage:storage})