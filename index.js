import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

mongoose.connect("mongodb+srv://khyatibhosle:BlogsByYou@blogs.mmhudz8.mongodb.net/?retryWrites=true&w=majority");

const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Blog = mongoose.model("Blog", blogSchema);


var allBlogs;
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    Blog.find({}).then((allBlogs)=>{
        res.render('index.ejs', {blogs: allBlogs});
    });
});

app.get('/write', (req,res) => {
    res.render('write.ejs');
});

app.get('/read', (req,res) => {
    Blog.find({}).then((allBlogs)=>{
        res.render('read.ejs', {blogs: allBlogs});
    });
});

app.post('/write', (req,res) => {
    var blog = new Blog({
        title: req.body.title,
        content: req.body.content
    });

    blog.save().then(() =>{
        Blog.find({}).then((allBlogs)=>{
            res.render('read.ejs', {blogs: allBlogs});
        });
    });
});

app.listen(port, (err)=>{
    if(err){console.log(err)}
    else{console.log(`Server running on ${port}`)}
});

