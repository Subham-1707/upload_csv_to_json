const dotenv = require("dotenv");
dotenv.config();
var express = require("express");
const app = express();
var multer = require("multer");
var mongoose = require("mongoose");
var path = require("path");
var csv = require("csvtojson");
var csv_model = require("./models/csv_model");
var fs = require("fs");
const csvParser = require("csv-parser");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
var uploads = multer({ storage: storage });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then((response) => {
    console.log("Database is connected successfully");
  })
  .catch((error) => {
    console.log("sorry, not connected to db");
  });

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, "public")));
app.get("/", (req, res) => {
  csv_model.find((err, data) => {
    if (err) {
    } else {
      if (data != "") {
        res.render("index", { data: data });
      } else {
        res.render("index", { data: "" });
      }
    }
  });
});
// First way to upload csv file:
// var csvResponse;
// app.post("/", uploads.single("csvFile"), (req, res) => {
//   csv()
//     .fromFile(req.file.path)
//     .then((response) => {
//       console.log("response", response);
//       // first way :
//       for (let i = 0; i < response; i++) {
//         csvResponse = response[i].Handle;
//         response[i].Handle = csvResponse;
//         csvResponse = response[i].Title;
//         response[i].Title = csvResponse;
//         csvResponse = response[i].Body;
//         response[i].Body = csvResponse;
//         csvResponse = response[i].Vendor;
//         response[i].Vendor = csvResponse;

//         csvResponse = response[i].Type;
//         response[i].Type = csvResponse;
//         csvResponse = response[i].Tags;
//         response[i].Tags = csvResponse;
//         csvResponse = response[i].Published;
//         response[i].Published = csvResponse;
//         csvResponse = response[i]["Option1 Name"];
//         response[i]["Option1 Name"] = csvResponse;
//         csvResponse = response[i]["Option1 Value"];
//         response[i].Option1_Value = csvResponse;
//         csvResponse = response[i]["Variant Grams"];
//         response[i]["Variant Grams"] = csvResponse;
//         csvResponse = response[i]["Variant Inventory Qty"];
//         response[i]["Variant Inventory Qty"] = csvResponse;

//         csvResponse = response[i]["Variant Inventory Policy"];
//         response[i]["Variant Inventory Policy"] = csvResponse;
//         csvResponse = response[i]["Variant Fulfillment Service"];
//         response[i]["Variant Fulfillment Service"] = csvResponse;
//         csvResponse = response[i]["Variant Price"];
//         response[i]["Variant Price"] = csvResponse;
//         csvResponse = response[i]["Variant Compare At Price"];
//         response[i]["Variant Compare At Price"] = csvResponse;
//         csvResponse = response[i]["Variant Requires Shipping"];
//         response[i]["Variant Requires Shipping"] = csvResponse;
//         csvResponse = response[i]["Variant Taxable"];
//         response[i]["Variant Taxable"] = csvResponse;
//         csvResponse = response[i]["Image Src"];
//         response[i]["Image Src"] = csvResponse;
//         csvResponse = response[i]["Image Position"];
//         response[i]["Image Position"] = csvResponse;
//         csvResponse = response[i]["Image Alt Text"];
//         response[i]["Image Alt Text"] = csvResponse;
//         csvResponse = response[i]["Gift Card"];
//         response[i]["Gift Card"] = csvResponse;
//         csvResponse = response[i]["Variant Image"];
//         response[i]["Variant Image"] = csvResponse;
//         csvResponse = response[i]["Variant Weight Unit"];
//         response[i]["Variant Weight Unit"] = csvResponse;
//       }
//       csv_model
//         .insertMany(response)
//         .then((result) => {
//           console.log("Documents inserted:");
//           res.status(201).json({
//             status: "success",
//             message: "data is uploaded successfully",
//           });
//         })
//         .catch((error) => {
//           console.error("Error inserting documents:", error);
//         });
//     });
// });

// SECOND WAY TO UPLOAD CSV:
// Parse the CSV file
// POST route for file upload:
app.post("/", uploads.single("csvFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const products = [];

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (data) => {
      // console.log("req file path", req.file.path); //public/uploads/csvToJson.csv
      // console.log("file data", data); // file response
      const product = new csv_model(data);
      products.push(product);
    })
    .on("end", () => {
      // Save the products to MongoDB
      csv_model
        .insertMany(products)
        .then(() => {
          res.status(201).json({
            status: "success",
            message: "File is uploaded successfully",
          });
        })
        .catch((err) => {
          console.error("Error storing products:", err);
          res.status(500).send("Error storing products.");
        });
    });
});

var port = process.env.PORT || 5555;
app.listen(port, () => console.log("App connected on: " + port));
