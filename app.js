const express = require('express');
const db = require('./dbConnections');
const Blog = require('./blog');

const app = express()
app.use(express.json());

app.post('/post', async (req, res)  => {
    const blog = new Blog({
        name: req.body.name,
        age: req.body.age,
        city: req.body.city,
    })
    const val = await blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => console.log(err))
    res.json(val);
    console.log(val.body)
})

app.get('/', (req, res) => console.log(res.send("Heroku in your face")))

// app.get('/all', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// });
//
// router.get('/:id', function(req, res, next) {
//     Blog.findById(req.params.id, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });
//
// router.post('/', function(req, res, next) {
//     Blog.create(req.body, function (err, post) {
//         if (err) return next(err);
//         res.json(post);
//     });
// });

// app.get('/all-blog', (req, res) => {
//     Blog.find()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })
//
//
// app.get('/add-blog', (req, res) => {
//     const blog = new Blog({
//         name: 'David',
//         age: '25',
//         city: 'Ramat  Gan',
//     });
//
//     blog.save()
//         .then((result) => {
//             res.send(result)
//         })
//         .catch((err) => console.log(err))
// })

app.listen(3000)