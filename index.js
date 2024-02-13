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
        res.render('index.ejs', {blogs: allBlogs})
    })
});

app.get('/write', (req,res) => {
    res.render('write.ejs')
});

app.get('/read', (req,res) => {
    Blog.find({}).then((allBlogs)=>{
        res.render('read.ejs', {blogs: allBlogs})
    })
});

app.post('/write', (req,res) => {
    var blog = new Blog({
        title: req.body.title,
        content: req.body.content
    })

    blog.save().then(() =>{
        Blog.find({}).then((allBlogs)=>{
            res.render('read.ejs', {blogs: allBlogs});
        }).catch((err)=>{
            console.log(err);
        })
    })
});

app.post('/edit', (req, res) => {
    if(req.body.edit){
        Blog.findById(req.body.edit).then((blog)=>{
            res.render('write.ejs', {blog: blog})
        });
    }
    else if(req.body.delete){
        Blog.findByIdAndDelete(req.body.delete).then(() =>{
            res.redirect('/read')
        }).catch((err)=>{
            console.log(err);
        })
    }
});

app.post('/update', (req, res) =>{
    console.log(req.body);
    Blog.findByIdAndUpdate(req.body.id, {title: req.body.title, content: req.body.content}).then(()=>{
        res.redirect('/read')
    }).catch((err)=>{
        console.log(err);
    });

});

app.listen(port, (err)=>{
    if(err){console.log(err)}
    else{console.log(`Server running on ${port}`)}
});

