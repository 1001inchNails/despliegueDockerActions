
require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const nombreBBDD = process.env.DDBB_NAME;

async function conectarCliente(){
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = mongoURI;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  return client;
}


async function getMaxScore() {
  const cliente = await conectarCliente();

  try {
      const database = cliente.db(nombreBBDD);
      const datos = database.collection('maxScores');

      const document = await datos.findOne({});

      if (document && document.maxScore !== undefined) {
          return document.maxScore;
      } else {
          throw new Error('well shit, maxScore not found');
      }
  } finally {
      await cliente.close();
  }
}

async function updateMaxScore(nuevaScore) {
  const cliente = await conectarCliente();

  try {
      const database = cliente.db(nombreBBDD);
      const datos = database.collection('maxScores');

      const maxScoreInt = parseInt(nuevaScore, 10);

      if (isNaN(maxScoreInt)) {
          throw new Error('Hey dog, nuevaScore must be a number');
      }

      const result = await datos.updateOne(
          {},
          { $set: { maxScore: maxScoreInt } }
      );

      if (result.modifiedCount === 1) {
          console.log('Shit got done');
      } else {
          console.log('Shit hit the fan');
      }
  } finally {
      await cliente.close();
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Escucha establecida con exito",
  })
})

// https://stackoverflow.com/questions/47523265/jquery-ajax-no-access-control-allow-origin-header-is-present-on-the-requested
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

/* GET */

app.get('/api/getmaxscore',async(req, res)=>{  // mostrar todos los menus
  let score = await getMaxScore();
  res.json({"resultado":score});
});


/* POST */

//{"nuevaScore":"nuevaPuntuacion"}
app.post('/api/updateScore', async(req,res)=>{
  try{
    
    let nuevaScore=req.body.nuevaScore;

    updateMaxScore(nuevaScore).then(() => {
      console.log('maxScore updated');
      res.json({"mensaje":"apdeit saksesful"});
  }).catch(err => {
      res.json({"mensaje":err});
  });

  }catch(error){
    res.send({"mensaje":error});
  }
});


module.exports = app;