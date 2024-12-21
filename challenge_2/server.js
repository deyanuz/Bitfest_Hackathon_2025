const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
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
