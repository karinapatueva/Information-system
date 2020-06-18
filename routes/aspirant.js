const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT * FROM aspirant`,
            function (err, results) {
                // console.log(results)
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("aspirant.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('/edit/:as_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const as_id = req.params.as_id
            pool.query(`SELECT * FROM aspirant WHERE as_id=${as_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("aspirant-edit.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/edit/:as_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE aspirant SET
                fio='${req.body.fio}', 
                tema='${req.body.tema}',
                pr_id='${req.body.pr_id}'
                WHERE as_id=${req.body.as_id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/aspirant")
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
            res.status(200).render("aspirant-create.hbs")
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
            pool.query(`INSERT INTO aspirant (fio,tema,pr_id)
                VALUES (
                '${req.body.fio}', 
                '${req.body.tema}', 
                '${req.body.pr_id}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/aspirant")
                    }
                });
        }
    }
})

router.get('/delete/:as_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const as_id = req.params.as_id
            pool.query(`SELECT * FROM aspirant WHERE as_id=${as_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("aspirant-delete.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/delete/:as_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`DELETE FROM aspirant WHERE as_id=${req.body.as_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/aspirant")
                    }
                });
        }
    }
})

module.exports = router
