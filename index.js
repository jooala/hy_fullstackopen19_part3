const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require('cors')

morgan.token('body', function(req, res) {
	return JSON.stringify(req.body);
});

app.use(express.static('build'))
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms :body '));


let persons = [
  {
    id: 1,
    name: "Matti Meikäläinen",
    number: "050-2223123"
  },
  {
    id: 2,
    name: "Maija Mallikas",
    number: "02-23-111245"
  },
  {
    id: 3,
    name: "Pertti Pentiläinen",
    number: "040-44421302"
  },
  {
    id: 4,
    name: "Kalle Virtanen",
    number: "12-44-2032032"
  }
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  var datetime = new Date();
  res.send(
    "<p>Phonebook has info for " + persons.length + " people</p>" + datetime
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
});

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
      return res.status(400).json({
          error: "content missing"
      })
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
        error: "name must be unique"
    })
  }
  const person = {
    id: generateId(),  
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  res.json(person);
});
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
