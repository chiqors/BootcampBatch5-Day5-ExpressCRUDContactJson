// import libraries
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const validator = require('validator');
const session = require('express-session');
const { flash } = require('express-flash-message');
// import composables
const fileData = require('./composables/fileData')
const contactData = require('./composables/contactData')
// express variable & routing
const app = express()
const port = 3000

// Information using EJS & EJS-Layouts
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('layout', 'layout/mainLayout')
app.use(express.static('public'))

// HTTP request logger middleware for node.js
app.use(morgan('dev'))

// support parsing of application/json type post data
app.use(bodyParser.json())
// support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }))
// support method override with POST having ?_method=VALUE
app.use(methodOverride('_method'))
// support session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      // secure: true, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
    },
}));
// apply express-flash-message middleware
app.use(flash({ sessionKeyName: 'flashMessage' }));

// the use() method is used to add middleware functions to the request handler chain
// app.use((req, res, next) => {
//     console.log('Time:', Date.now())
//     next()
// })

// URL Request
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Page',
    })
})

// CRUD

// Read
app.get('/contact', async(req, res) => {
    const contacts = fileData.loadData()
    const flashData = await req.consumeFlash('info')
    res.render('contact', {
        contacts,
        flashData,
        title: 'Contact Page'
    })
})

// Create
app.get('/contact/add', (req, res) => {
    res.render('contact/create', {
        title: 'Add Contact Page'
    })
})

// Store
app.post('/contact', async(req, res) => {
    const data = req.body
    contactData.storeContact(data)
    const flashObject = {
        type: 'success',
        message: 'Contact has been added'
    }
    await req.flash('info', flashObject)
    return res.redirect('/contact')
})

// Show Detail
app.get('/contact/show/:name', (req, res) => {
    const contact = contactData.getContactByName(req.params.name)
    res.render('contact/show', {
        contact,
        title: 'Show Contact Page'
    })
})

// Edit
app.get('/contact/edit/:name', (req, res) => {
    const contact = contactData.getContactByName(req.params.name)
    res.render('contact/edit', {
        contact,
        title: 'Edit Contact Page'
    })
})

// Update
app.put('/contact', async(req, res) => {
    let data = req.body
    const flashObject = {
        type: 'success',
        message: 'Contact has been updated'
    }
    await req.flash('info', flashObject)
    contactData.updateContact(data)
    res.redirect('/contact')
})

// Delete
app.delete('/contact', async(req, res) => {
    const data = req.body
    const flashObject = {
        type: 'success',
        message: 'Contact has been deleted'
    }
    await req.flash('info', flashObject)
    contactData.deleteContact(data)
    res.redirect('/contact')
})

// app.get('/product/:product_id/category/:category_type', (req, res) => {
//     res.send(req.params)
// })

// Error Handling
app.use('/', (req, res) => {
    res.status(404)
    res.send('404 Page Not Found')
})

// Run server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})