const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const app = express();
const Ingredient = require("./models/Ingredient");
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://zunayedkhanofficial:1234@hackathon.o6wb7.mongodb.net/?retryWrites=true&w=majority&appName=Hackathon"
  )
  .then(() => console.log("connected"))
  .catch((e) => console.error(e.message));

app.get("/", (req, res) => {
  res.send("hello, world! now fuck off");
});

app.listen(5000, () => {
  console.log("server running on port 5000");
});

//task-2

app.post("/ingredients", async (req, res) => {
  try {
    const { name, quantity, unit, category } = req.body;
    const ingredient = new Ingredient({ name, quantity, unit, category });
    await ingredient.save();
    return res.status(201).json(ingredient);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding ingredient", error: error.message });
  }
});

app.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).json(ingredients);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching ingredients", error: error.message });
  }
});
app.delete("/ingredients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const ingredient = await Ingredient.findByIdAndDelete(id);
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    return res.status(200).json({ message: "Ingredient deleted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting ingredient", error: error.message });
  }
});

app.put("/ingredients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const ingredient = await Ingredient.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    );
    if (!ingredient)
      return res.status(404).json({ message: "Ingredient not found" });
    return res.status(200).json(ingredient);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating ingredient", error: error.message });
  }
});

// Search ingredients by substring
app.get("/ingredients/search", async (req, res) => {
  try {
    const { q } = req.query;

    // Validate input
    if (!q || q.trim() === "") {
      return res
        .status(400)
        .json({ message: "Query parameter 'q' is required." });
    }

    // Perform a case-insensitive search using a regex
    const ingredients = await Ingredient.find({
      name: { $regex: q, $options: "i" },
    });

    if (ingredients.length === 0) {
      return res
        .status(404)
        .json({ message: "No matching ingredients found." });
    }

    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: "Error searching for ingredients",
      error: error.message,
    });
  }
});

//task-3

// Parse recipe text files
const parseRecipeTextFiles = (folderPath, outputFilePath) => {
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    if (file.endsWith(".txt")) {
      const content = fs.readFileSync(filePath, "utf-8");
      fs.appendFileSync(outputFilePath, content + "\n\n");
    }
  });

  console.log("Recipe texts combined into:", outputFilePath);
};

// Function to clean up Tesseract's output
const cleanText = (text) => {
  return text.replace(/\n+/g, "\n").trim(); // Replace multiple newlines with a single newline and trim leading/trailing ones
};

// Parse recipe images using OCR
const parseRecipeImages = async (folderPath, outputFilePath) => {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    if (file.endsWith(".jpg") || file.endsWith(".png")) {
      const { data } = await Tesseract.recognize(filePath, "eng");
      const cleanedText = cleanText(data.text);
      fs.appendFileSync(outputFilePath, cleanedText + "\n\n");
    }
  }

  console.log("Recipe images combined into:", outputFilePath);
};

// Combine recipes into my_fav_recipes.txt
const combineRecipes = async () => {
  const folderPath = "./recipes"; // Folder containing saved recipe files
  const outputFilePath = "./my_fav_recipes.txt";

  // Create/clear the output file
  fs.writeFileSync(outputFilePath, "");

  // Parse text files
  parseRecipeTextFiles(folderPath, outputFilePath);

  // Parse image files
  await parseRecipeImages(folderPath, outputFilePath);
};

// Configure Multer to save files with their original names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "recipes")); // Save files in the "recipes" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtension = ".txt";
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (fileExt !== allowedExtension) {
      return cb(new Error("Only .txt files are allowed."));
    }
    cb(null, true);
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});
// Endpoint to upload a .txt file
app.post("/recipes/add-text", upload.single("file"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    combineRecipes();
    res.status(201).json({
      message: "Text file uploaded successfully.",
      filename: file.originalname,
      filePath: file.path,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading file.", error: error.message });
  }
});

const storageImg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "recipes")); // Save files in the "recipes" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});

const uploadImg = multer({
  storage: storageImg,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [".jpg", ".png"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return cb(new Error("Only .jpg and .png files are allowed."));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
});

// Endpoint to upload an image file
app.post("/recipes/add-image", uploadImg.single("image"), (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    combineRecipes();

    res.status(201).json({
      message: "Image file uploaded successfully.",
      filename: file.originalname,
      filePath: file.path,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading file.", error: error.message });
  }
});
