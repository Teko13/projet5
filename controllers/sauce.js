const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.sauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }))
}

exports.sauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }))
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'sauce bien ajouter' }))
        .catch(erreor => res.status(400).json({ error }))

}

exports.updateSauce = (req, res, next) => {
    if (req.file) {
        const newSauceObject = JSON.parse(req.body.sauce);
        console.log('requette avec image');
        Sauce.updateOne({ _id: req.params.id },
            {
                ...newSauceObject,
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            })
            .then(() => res.status(200).json({ message: 'sauce mis a jour' }))
            .catch(error => res.status(401).json({ error }))
    }
    else {
        console.log('requete sans image');
        Sauce.updateOne({ _id: req.params.id }, { ...req.body })
            .then(() => res.status(200).json({ message: 'mis a jour effectuer' }))
            .catch(error => res.status(401).json({ error }))
    }
}

