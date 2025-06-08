const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();

// Servir archivos estáticos desde la carpeta public
app.use(express.static('public'));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static('uploads'));

// Ruta para obtener las salidas
app.get('/api/salidas', async (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        const carpetas = await fs.readdir(uploadsDir);
        
        const salidas = await Promise.all(carpetas.map(async (carpeta) => {
            const carpetaPath = path.join(uploadsDir, carpeta);
            const archivos = await fs.readdir(carpetaPath);
            
            return {
                nombre: carpeta,
                archivos: archivos.map(archivo => `/uploads/${carpeta}/${archivo}`)
            };
        }));

        res.json(salidas);
    } catch (error) {
        console.error('Error al leer las salidas:', error);
        res.status(500).json({ error: 'Error al leer las salidas' });
    }
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

// Para Vercel
module.exports = app;
