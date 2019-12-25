require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(express.static("build"));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(":method :url :status :response-time ms :body "));

const Person = require("./models/person");

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
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()));
  });
});

app.get("/info", (req, res) => {
  var datetime = new Date();
  Person.find({})
    .then(persons => {
      res.send(
        "<p>Phonebook has info for " + persons.length + " people</p>" + datetime
      );
    })
    .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(
    req.params.id,
    { number: req.body.number },
    { new: true }
  )
    .then(result => {
      res.json(result.toJSON());
    })
    .catch(error => next(error));
});

const generateId = () => {
  const id = Math.floor(Math.random() * 1000000);
  return id;
};

app.post("/api/persons", (req, res, next) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "content missing"
    });
  }

  if (persons.find(p => p.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique"
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save()
  .then(savedNote => {
    response.json(savedNote.toJSON())
  })
  .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
