const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT * FROM predmet`,
            function (err, results) {
                // console.log(results)
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("predmet.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('/edit/:predmet_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const predmet_id = req.params.predmet_id
            pool.query(`SELECT * FROM predmet WHERE predmet_id=${predmet_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("predmet-edit.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/edit/:predmet_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE predmet SET
                name='${req.body.name}', 
                chasi='${req.body.chasi}',
                pr_id='${req.body.pr_id}'
                WHERE predmet_id=${req.body.predmet_id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/predmet")
                    }
                });
        }
    }
})

router.get('/create', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            res.status(200).render("predmet-create.hbs")
        }
    }
})

router.post('/create', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`INSERT INTO predmet (name,chasi,pr_id)
                VALUES (
                '${req.body.name}', 
                '${req.body.chasi}', 
                '${req.body.pr_id}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/predmet")
                    }
                });
        }
    }
})

router.get('/delete/:predmet_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const predmet_id = req.params.predmet_id
            pool.query(`SELECT * FROM predmet WHERE predmet_id=${predmet_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("predmet-delete.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/delete/:predmet_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`DELETE FROM predmet WHERE predmet_id=${req.body.predmet_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/predmet")
                    }
                });
        }
    }
})

module.exports = router
