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

exports.SauceReview = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const userLikeArray = sauce.usersLiked;
            const userDislikeArray = sauce.usersDisliked;
            const userInLikeArray = userLikeArray
                .find(userId => userId === req.body.userId);
            const userInDislikeArray = userDislikeArray
                .find(userId => userId === req.body.userId);

            switch (req.body.like) {
                case 1:
                    try {
                        if (!userInLikeArray && !userInDislikeArray) {
                            userLikeArray.push(req.body.userId)
                            Sauce.updateOne({ _id: req.params.id },
                                {
                                    likes: sauce.likes += 1,
                                    usersLiked: userLikeArray
                                })
                                .then(() => res.status(200).json({ message: 'like ajouter' }))
                                .catch(error => { throw error })
                        }
                        else {
                            throw Error('vous avez deja liker ou disliker cette sauce')
                        }
                    } catch (error) {
                        res.status(400).json({ error })
                    }
                    break;
                case -1:
                    try {
                        if (!userInLikeArray && !userInDislikeArray) {
                            userDislikeArray.push(req.body.userId)
                            Sauce.updateOne({ _id: req.params.id },
                                {
                                    dislikes: sauce.dislikes += 1,
                                    usersDisliked: userDislikeArray
                                })
                                .then(() => res.status(200).json({ message: 'dislike ajouter' }))
                                .catch(error => { throw error })
                        }
                        else {
                            throw Error('vous avez deja liker ou disliker cette sauce')
                        }
                    } catch (error) {
                        res.status(400).json({ error })
                    }
                    break;
                case 0:
                    try {
                        if (userInLikeArray) {
                            const index = userLikeArray.findIndex(userId => userId === req.body.uerId);
                            userLikeArray.splice(index, 1)
                            Sauce.updateOne({ _id: req.params.id },
                                {
                                    likes: sauce.likes -= 1,
                                    usersLiked: userLikeArray
                                })
                                .then(() => res.status(200).json({ message: 'like annuler' }))
                                .catch(error => { throw error })
                        }
                        else if (userInDislikeArray) {
                            const index = userDislikeArray.findIndex(userId => userId === req.body.uerId);
                            userDislikeArray.splice(index, 1)
                            Sauce.updateOne({ _id: req.params.id },
                                {
                                    dislikes: sauce.dislikes -= 1,
                                    usersDisliked: userDislikeArray
                                })
                                .then(() => res.status(200).json({ message: 'dislike annuler' }))
                                .catch(error => { throw error })
                        }
                        else {
                            throw Error('Aucun like ou dislike a annuler')
                        }
                    } catch (error) {
                        res.status(400).json({ error })
                    }
                    break;

                default:
                    res.status(400).json({ message: 'erreur anonyme' })
                    break;
            }
        })
        .catch(error => res.status(500).json({ error }))
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const sauceName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${sauceName}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'sauce supprimer' }))
                    .catch(error => res.status(400).json({ error }))
            })
        })
        .catch(error => res.staus(500).json({ error }))
}

