const contactData = require('./contactData')
const validator = require('validator');

async function validateName(name, req, res) {
    // Check empty name
    if (validator.isEmpty(name)) {
        const flashObject = {
            type: 'danger',
            message: 'Name is empty, please fill the name'
        }
        await req.flash('info', flashObject)
        const flashData = await req.consumeFlash('info')
        return res.render('contact/create', {
            flashMessage: flashData,
            title: 'Add Contact Page'
        })
    }
    // Check duplicate name
    const checkDuplicate = contactData.getContactByName(name)
    if (checkDuplicate) {
        const flashObject = {
            type: 'danger',
            message: 'Name is already exist, please use another name'
        }
        await req.flash('info', flashObject)
        const flashData = await req.consumeFlash('info')
        return res.render('contact/create', {
            flashMessage: flashData,
            title: 'Add Contact Page'
        })
    }
    return true
}

async function validateEmail(email, req, res) {
    // Check empty email
    if (!validator.isEmail(email)) {
        const flashObject = {
            type: 'danger',
            message: 'Email is not valid'
        }
        await req.flash('info', flashObject)
        const flashData = await req.consumeFlash('info')
        return res.render('contact/create', {
            flashMessage: flashData,
            title: 'Add Contact Page'
        })
    }
    return true
}

async function validatePhone(phone, req, res) {
    // Check empty phone
    if (!validator.isMobilePhone(phone)) {
        const flashObject = {
            type: 'danger',
            message: 'Phone is not valid'
        }
        await req.flash('info', flashObject)
        const flashData = await req.consumeFlash('info')
        return res.render('contact/create', {
            flashMessage: flashData,
            title: 'Add Contact Page'
        })
    }
    return true
}

async function validateAll(data, req, res) {
    await validateName(data.nama, req, res)
    await validateEmail(data.email, req, res)
    await validatePhone(data.notelp, req, res)
}

module.exports = {
    validateName,
    validateEmail,
    validatePhone,
    validateAll
}