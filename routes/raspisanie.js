const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT * FROM raspisanie`,
            function (err, results) {
                // console.log(results)
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("raspisanie.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('/edit/:den_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const den_id = req.params.den_id
            pool.query(`SELECT * FROM raspisanie WHERE den_id=${den_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("raspisanie-edit.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/edit/:den_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE raspisanie SET
                gruppa='${req.body.gruppa}', 
                time='${req.body.time}',
                pr_id='${req.body.pr_id}'
                predmet_id='${req.body.predmet_id}' 
                auditoria='${req.body.auditoria}'
                WHERE den_id=${req.body.den_id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/raspisanie")
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
            res.status(200).render("raspisanie-create.hbs")
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
            pool.query(`INSERT INTO raspisanie (gruppa,time,pr_id,predmet_id,auditoria)
                VALUES (
                '${req.body.gruppa}', 
                '${req.body.time}', 
                '${req.body.pr_id}', 
                '${req.body.predmet_id}', 
                '${req.body.auditoria}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/raspisanie")
                    }
                });
        }
    }
})

router.get('/delete/:den_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const den_id = req.params.den_id
            pool.query(`SELECT * FROM raspisanie WHERE den_id=${den_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("raspisanie-delete.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/delete/:den_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`DELETE FROM raspisanie WHERE den_id=${req.body.den_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/raspisanie")
                    }
                });
        }
    }
})

module.exports = router
