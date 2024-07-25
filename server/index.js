const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotanv = require("dotenv");
const { bgCyan } = require("colors");
const statsRoutes = require("./routes/statsRoutes");
require("colors");
const connectDb = require("./config/config");
//dotenv config
dotanv.config();
//db config
connectDb();
//rest object
const app = express();

//middlwares


app.use(cors(
  { origin:[""],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

//routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billsRoute"));
app.use("/api", statsRoutes);
//port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`.bgCyan.white);
});
