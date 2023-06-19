var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
  Handle: {
    type: String,
  },
  Title: {
    type: String,
  },
  "Body (HTML)": {
    type: String,
  },
  Vendor: {
    type: String,
  },
  Type: {
    type: String,
  },
  Tags: {
    type: String,
  },
  Published: {
    type: String,
  },
  "Option1 Name": {
    type: String,
  },
  "Option1 Value": {
    type: String,
  },
  "Variant Grams": {
    type: String,
  },
  "Variant Inventory Qty": {
    type: String,
  },
  "Variant Inventory Policy": {
    type: String,
  },
  "Variant Fulfillment Service": {
    type: String,
  },
  "Variant Price": {
    type: String,
  },
  "Variant Compare At Price": {
    type: String,
  },
  "Variant Requires Shipping": {
    type: String,
  },
  "Variant Taxable": {
    type: String,
  },
  "Image Src": {
    type: String,
  },
  "Image Position": {
    type: String,
  },
  "Variant Taxable": {
    type: String,
  },
  "Image Alt Text": {
    type: String,
  },
  "Gift Card": {
    type: String,
  },
  "Variant Image": {
    type: String,
  },
  "Variant Weight Unit": {
    type: String,
  },
});

module.exports = mongoose.model("productSchema  ", productSchema);
