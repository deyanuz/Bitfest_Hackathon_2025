# Bitfest_Hackathon_2025

## Challenge_2

### Base URL

```
http://localhost:5000
```

---

## **Endpoints**

### **1. GET /ingredients**

- **Description**: Fetch all ingredients.
- **Request Type**: GET
- **Sample Request**:
  - No body required.
- **Sample Response**:

```json
[
  {
    "_id": "64f1c710c48b7b12d1e02d8b",
    "name": "Tomato",
    "quantity": 5,
    "unit": "pcs",
    "category": "Vegetables"
  }
]
```

---

### **2. POST /ingredients**

- **Description**: Add a new ingredient.
- **Request Type**: POST
- **Sample Body**:

```json
{
  "name": "Carrot",
  "quantity": 10,
  "unit": "pcs",
  "category": "Vegetables"
}
```

- **Sample Response**:

```json
{
  "_id": "64f1c710c48b7b12d1e02d8c",
  "name": "Carrot",
  "quantity": 10,
  "unit": "pcs",
  "category": "Vegetables"
}
```

---

### **3. DELETE /ingredients/:id**

- **Description**: Delete an ingredient by ID.
- **Request Type**: DELETE
- **Sample Request URL**:

```
http://localhost:5000/ingredients/64f1c710c48b7b12d1e02d8b
```

- **Sample Response**:

```json
{
  "message": "Ingredient deleted"
}
```

---

### **4. PUT /ingredients/:id**

- **Description**: Update the quantity of an ingredient by ID.
- **Request Type**: PUT
- **Sample Request URL**:

```
http://localhost:5000/ingredients/64f1c710c48b7b12d1e02d8b
```

- **Sample Body**:

```json
{
  "quantity": 15
}
```

- **Sample Response**:

```json
{
  "_id": "64f1c710c48b7b12d1e02d8b",
  "name": "Tomato",
  "quantity": 15,
  "unit": "pcs",
  "category": "Vegetables"
}
```

---

### **5. GET /ingredients/search?q=<substring>**

- **Description**: Search ingredients by substring.
- **Request Type**: GET
- **Sample Request URL**:

```
http://localhost:5000/ingredients/search?q=to
```

- **Sample Response**:

```json
[
  {
    "_id": "64f1c710c48b7b12d1e02d8b",
    "name": "Tomato",
    "quantity": 5,
    "unit": "pcs",
    "category": "Vegetables"
  }
]
```

---

### **6. POST /recipes/add-text**

- **Description**: Upload a `.txt` file containing recipe data.
- **Request Type**: POST
- **Request Body**:
  - Use **form-data** in Postman.
  - Key: `file`
  - Value: Upload the `.txt` file.
- **Sample Response**:

```json
{
  "message": "Text file uploaded successfully.",
  "filename": "new_recipe.txt",
  "filePath": "./recipes/new_recipe.txt"
}
```

---

### **7. POST /recipes/add-image**

- **Description**: Upload an image file (.jpg or .png) containing recipe data.
- **Request Type**: POST
- **Request Body**:
  - Use **form-data** in Postman.
  - Key: `image`
  - Value: Upload the image file.
- **Sample Response**:

```json
{
  "message": "Image file uploaded successfully.",
  "filename": "recipe_image.jpg",
  "filePath": "./recipes/recipe_image.jpg"
}
```

---

### **8. GET /**

- **Description**: Basic endpoint to check if the server is running.
- **Request Type**: GET
- **Sample Request**:
  - No body required.
- **Sample Response**:

```
hello, world!
```

---

## **Notes**

- Replace `<id>` in request URLs with the actual MongoDB document ID.
- Use appropriate files for upload endpoints (e.g., `.txt` for `/recipes/add-text` and `.jpg`/`.png` for `/recipes/add-image`).
- Ensure the server is running on the specified port (`5000`) before sending requests.

Feel free to customize as needed or reach out for additional clarifications!
