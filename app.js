//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://dat:12345@cluster0-o2kcn.mongodb.net/todolistDB",{useNewUrlParser:true,useUnifiedTopology: true});

const itemSchema = {
  name: String
};
const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
  name: "Go to the supermarket"
})
const item2 = new Item({
  name: "Buy Food"
})
const item3 = new Item({
  name: "Cook dinner"
})
const defaultItems = [item1,item2,item3];

app.get("/", function(req, res) {
  // Find in Item collection
  Item.find({},function(err, foundItems){
    // Render defaultItems if foundItems doesn't have any item
    if(foundItems.length==0) {
      Item.insertMany(defaultItems,function(err){
        if(err) {
          console.log(err);
        } else {
          res.render("list", {listTitle: "Today", newListItems: defaultItems});
        }
      })
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
});

app.post("/", function(req, res){
  const item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    const newItem = new Item({
      name: item
    })
    newItem.save();
    res.redirect("/");
  }
});

app.post("/delete",function(req,res){
  Item.deleteOne({_id:req.body.checkbox},function(err){
    if(err) {
      console.log(err);
    } else{
      console.log("Successfully deleted");
      res.redirect("/");
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
});


let port = process.env.PORT;
if(port==null || port == "") {
  port=3000;
} 
app.listen(port, function() {
  console.log("Server has started successfully");
});
