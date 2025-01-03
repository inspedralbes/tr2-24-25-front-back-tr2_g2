import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileURLToPath } from 'url';
import { encode } from 'gpt-tokenizer';
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToGenerativePart(filePath, mimeType) {
    return {
        inlineData: {
            data: fs.readFileSync(filePath).toString("base64"),
            mimeType,
        },
    };
}

function extractJsonContent(responseText) {
  const jsonStart = responseText.indexOf("{");
  const jsonEnd = responseText.lastIndexOf("}") + 1;
  return responseText.substring(jsonStart, jsonEnd);
}

let totalTokensAcumulados = 0;
app.post("/classify-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No se recibió ningún archivo." });
        }

       const filePath = req.file.path;
       const mimeType = req.file.mimetype;

        const imagePart = fileToGenerativePart(filePath, mimeType);
        
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
        
        const promptTokens = encode(prompt).length;
        
        const result = await model.generateContent([prompt, imagePart]);
          
        const responseText = result.response.text();
        
        const responseTokens = encode(responseText).length;

        const totalTokens = promptTokens + responseTokens;

        totalTokensAcumulados += totalTokens;

        console.log(`Tokens del prompt: ${promptTokens}`);
        console.log(`Tokens de la respuesta: ${responseTokens}`);
        console.log(`Total de tokens acumulados: ${totalTokensAcumulados}`);

        const jsonResponse = extractJsonContent(responseText);

        console.log("Clasificación de la imagen:");
        console.log(jsonResponse);

        res.json(JSON.parse(jsonResponse));

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Hubo un error procesando la imagen." });
    }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});