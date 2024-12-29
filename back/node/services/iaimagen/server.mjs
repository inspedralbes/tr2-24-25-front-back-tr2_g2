import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); // Carga las variables de entorno

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directorio donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Configuración de Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Función para convertir archivo a formato necesario para el modelo
function fileToGenerativePart(filePath, mimeType) {
  return {
    inlineData: {
      data: fs.readFileSync(filePath).toString("base64"),
      mimeType,
    },
  };
}

// Endpoint POST para recibir la imagen
app.post("/classify-image", upload.single("image"), async (req, res) => {
  try {
    const filePath = path.resolve(req.file.path);
    const mimeType = req.file.mimetype;

    // Crear la parte de la imagen para el modelo
    const imagePart = fileToGenerativePart(filePath, mimeType);

    // Definir el prompt
    const prompt = `Eres un detector de imágenes en binario. Para cada imagen que te pase mediante una URL, debes clasificarla en una de las siguientes categorías:

ADECUADA:

La imagen no contiene ningún contenido inapropiado, tales como:
Bullying.
Violencia.
Imágenes sexualizadas o inapropiadas.
Desnudos parciales o totales.
Actos sexuales, posiciones sugestivas o ambientes eróticos.
Cosificación de personas (enfoque vulgar en partes del cuerpo).
Contenido inapropiado para menores (ropa muy reveladora, insinuaciones sexuales).
OFENSIVA:

La imagen contiene:
Odio, discriminación, amenazas o violencia.
Representaciones religiosas inapropiadas.
Actos sexuales explícitos o simulados.
Personas en situaciones íntimas (contacto físico sugestivo, ropa desabrochada, cuerpos entrelazados).
Contenido vulgar o degradante.
POTENCIALMENTE_SUGERENTE:

La imagen presenta algunas características que podrían ser inapropiadas pero no cumplen con todas las condiciones para clasificarse como OFENSIVA.
Ejemplos incluyen:
Besos apasionados o caricias íntimas.
Ropa ajustada o algo reveladora, pero no explícita.
Posiciones corporales ambiguas.
Contextos que sugieren contenido erótico sin ser explícito.

POTENCIALMENTE_SUGERENTE:

Se introduce una subclasificación:
OFENSIVO: Si la imagen potencialmente sugerente cruza ciertos límites y se acerca a lo inapropiado u ofensivo.
Ejemplo: Besos muy intensos, ropa extremadamente reveladora o insinuaciones sexuales claras.
NO_OFENSIVO: Si la imagen sugiere cierta ambigüedad pero no es explícita ni puede considerarse inapropiada.
Ejemplo: Ropa ajustada moderadamente, poses ambiguas pero no vulgares.

{
  "category": "ADECUADA" | "OFENSIVA" | "POTENCIALMENTE_SUGERENTE",
  "subcategory": "OFENSIVO" | "NO_OFENSIVO",
  "image": "Aquí va la URL de la imagen",
  "reason": "Explicación de por qué es sugerente y si cruza límites ofensivos. Que se muestre en catalan"
}


Por mas ofensivo que sea una imagen devuelve por lo menos un mensaje de error.`;

    // Generar la respuesta del modelo
    const result = await model.generateContent([prompt, imagePart]);

    // Limpiar archivo temporal
    fs.unlinkSync(filePath);

    // Enviar respuesta al cliente
    res.json({ result: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error procesando la imagen." });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
