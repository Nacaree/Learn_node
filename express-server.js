const express = require("express");
const app = express();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
/* 
* Before you can receive JSON data, you need to tell Express to parse it. This is done using a piece of software called middleware.
? app.use(express.json());
* This line tells your server to automatically parse incoming request bodies with JSON payloads, making them available on the req.body property.
*/
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello from Express.js!");
});

app.get("/about", (req, res) => {
  res.send("This is the about page.");
});

// * Handling Dynamic Routes (Route Parameters)
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const userData = {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`,
  };
  res.json(userData);
  //   res.send(`You requested data for user ID: ${userId}`);
});

app.get("/api/products", async (req, res) => {
  try {
    const data = await fs.readFile("db.json", "utf8");
    const products = JSON.parse(data).products;
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reading products" });
  }
});
// GET: Read a single product by pid
app.get("/api/products/:pid", async (req, res) => {
  try {
    const data = await fs.readFile("db.json", "utf8");
    const products = JSON.parse(data).products;
    const pid = parseInt(req.params.pid, 10);

    const product = products.find((p) => p.pid === pid);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error reading product" });
  }
});

// * Get Route For Single USer
app.get("/api/users/:id", async (req, res) => {
  try {
    const data = await fs.readFile("db.json", "utf8");
    const users = JSON.parse(data).users;
    const user = users.find((u) => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error reading user" });
  }
});

/* app.post('/api/users', (req, res) => {
  const newUser = req.body;
  console.log('New user data received:', newUser);
  res.status(201).json({
    message: 'User created successfully',
    user: newUser
  });
}); */

app.post("/api/users", async (req, res) => {
  try {
    // 1. Read the existing users from the file
    const data = await fs.readFile("db.json", "utf8");
    const users = JSON.parse(data).users;
    // 2. Create a new user object with a unique ID
    const newUser = {
      id: uuidv4(), // <-- This generates a unique ID
      ...req.body,
    };
    /* 
     * ...req.body
      ? This is called the spread syntax. The three dots (...) take all the properties from the req.body object (which contains the name, email, and any other data you sent in your POST request) and copies them into the newUser object you are creating. It's like taking everything from one object and scattering it into a new one.
     */
    // 3. Add the new user to the array
    users.push(newUser);
    // 4. Save the updated array back to the file
    await fs.writeFile("db.json", JSON.stringify({ users }, null, 2), "utf8");
    /* 
    *  JSON.stringify({ users }, null, 2)
  ? It creates a new JavaScript object with a single property named users and assigns it the value of the users array you just updated. 
  ! Takes JS object and converts it into JSOn String, null is placeholder, 2 is how many space it indents
  */
    // 5. Send a response back to the client
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating users" });
  }
});

//  * Delete
app.delete("/api/users/:id", async (req, res) => {
  // 1. Read the existing users from the file
  try {
    const data = await fs.readFile("db.json", "utf8");
    const users = JSON.parse(data).users;
    const userId = req.params.id;

    // 2. Filter out the user to be deleted
    const updatedUsers = users.filter((user) => user.id !== userId);
    // Check if a user was actually removed
    if (updatedUsers.length === users.length) {
      return res.status(404).json({ message: "User not found" });
    }
    // 3. Save the updated array back to the file
    await fs.writeFile(
      "db.json",
      JSON.stringify({ users: updatedUsers }, null, 2),
      "utf8"
    );
    // 4. Send a success message
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting users" });
  }
});

// * Update
app.patch("/api/users/:id", async (req, res) => {
  try {
    const data = await fs.readFile("db.json", "utf8");
    const users = JSON.parse(data).users;
    const userId = req.params.id;
    const updatedData = req.body;
    // Find the user to update and their index
    const userIndex = users.findIndex((user) => user.id === userId);
    /* 
  * user => user.id === userId
  ? arrow function => is like for each
  ? for each user object in the array it checks whether the id in the array is the same as the one in the URl you provided
   */
    // If user not found, send a 404 response
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user's data
    const userToUpdate = users[userIndex];
    const updatedUser = { ...userToUpdate, ...updatedData };
    //  * copies all properties from userToUpdate and updatedData into the updatedUser object
    //  ? If any properties exist in both objects (like name), the value from updatedData overwrites the original.
    users[userIndex] = updatedUser;
    //  * Replaces the old user object in the same position index
    // Save the updated users array back to the file
    await fs.writeFile("db.json", JSON.stringify({ users }, null, 2), "utf8");
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating users" });
  }
});
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  console.log(`Running at http://localhost:${port}/`);
});
