const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const db = mysql.createPool({
    host: "localhost",
    user: "root", 
    password: "Paru@123123123",
    database: "crud_contactheroku",
  });

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const users = []

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = { name: req.body.name, password: hashedPassword }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

  app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    try {
      if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
  })

app.get("/api/get", (req, res) => {
    const sqlGet = "SELECT * FROM contact_db";
    db.query(sqlGet, (error, result) => {
      res.send(result);
    });
  });

  app.post("/api/post", (req, res) => {
    const { name, email, contact } = req.body;
    const sqlInsert =
      "INSERT INTO contact_db (name, email, contact) VALUES (?, ?, ?)";
    db.query(sqlInsert, [name, email, contact], (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });
  

  app.delete("/api/remove/:id", (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM contact_db WHERE id = ?";
    db.query(sqlRemove, id, (error, result) => {
      if (error) {
        console.log(error);
      }
    });
  });


  app.get("/api/get/:id", (req, res) => {
    const { id } = req.params;
    const sqlGet = "SELECT * FROM contact_db WHERE id = ?";
    db.query(sqlGet, id, (error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    });
  });
  
  app.put("/api/update/:id", (req, res) => {
      const { id } = req.params;
      const {name, email, contact} = req.body;
      const sqlUpdate = "UPDATE contact_db SET name = ?, email = ?, contact = ? WHERE id = ?";
      db.query(sqlUpdate, [name, email, contact, id], (error, result) => {
        if (error) {
          console.log(error);
        }
        res.send(result);
      });
    });

app.get("/", (req, res) => {
     // const sqlInsert =
    //     "INSERT INTO contact_db (name, email, contact) VALUES ('hasini', 'Hasini@gmail.com',9502955370)";
    //   db.query(sqlInsert, (error, result) => {
    //     console.log("error", error);
    //     console.log("result", result);
    //     res.send("Hello Express");
    //   });
  });

// app.listen(5000, () => {
//   console.log("Server is running on port 5000");
// });

app.listen(process.env.PORT || 5000);
