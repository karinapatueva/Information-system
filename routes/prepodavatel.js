const express = require('express')
const router = express.Router()
const pool = require('../connection/pool')

router.get('/', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        pool.query(`SELECT * FROM prepodavatel`,
            function (err, results) {
                // console.log(results)
                if (err) {
                    res.status(500).send({message: 'Ошибка', status: 'error'})
                } else {
                    res.status(200).render("prepodavatel.hbs", {
                        results: results,
                        is_admin: req.session.admin
                    })
                }
            });
    }
})

router.get('/edit/:pr_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const pr_id = req.params.pr_id
            pool.query(`SELECT * FROM prepodavatel WHERE pr_id=${pr_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("prepodavatel-edit.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/edit/:pr_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`UPDATE prepodavatel SET
                fio='${req.body.fio}', 
                pol='${req.body.pol}',
                datarojdenia='${req.body.pr_id}'
                mestorojdenia='${req.body.pr_id}'
                adress='${req.body.pr_id}'
                pasport='${req.body.pr_id}'
                telefon='${req.body.pr_id}'
                dolnost_id='${req.body.pr_id}'
                stepen_id='${req.body.pr_id}'
                WHERE pr_id=${req.body.pr_id}
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/prepodavatel")
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
            res.status(200).render("prepodavatel-create.hbs")
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
            pool.query(`INSERT INTO prepodavatel (fio,pol,datarojdenia,mestorojdenia,adress,pasport,telefon,doljnost_id,stepen_id)
                VALUES (
                '${req.body.fio}', 
                '${req.body.pol}', 
                '${req.body.datarojdenia}', 
                '${req.body.mestorojdenia}', 
                '${req.body.telefon}', 
                '${req.body.doljnost_id}', 
                '${req.body.stepen_ida}')
                `,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка добавления', status: 'error'})
                    } else {
                        res.status(200).redirect("/prepodavatel")
                    }
                });
        }
    }
})

router.get('/delete/:pr_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            const pr_id = req.params.pr_id
            pool.query(`SELECT * FROM prepodavatel WHERE pr_id=${pr_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка', status: 'error'})
                    } else {
                        res.status(200).render("prepodavatel-delete.hbs", {
                            user: results[0]
                        })
                    }
                });
        }
    }
})

router.post('/delete/:pr_id', (req, res) => {
    if (!req.session.success) {
        res.status(200).redirect("/login")
    } else {
        if (!req.session.admin) {
            res.status(403).redirect("/")
        } else {
            pool.query(`DELETE FROM prepodavatel WHERE pr_id=${req.body.pr_id}`,
                function (err, results) {
                    if (err) {
                        res.status(500).send({message: 'Ошибка удаления', status: 'error'})
                    } else {
                        res.status(201).redirect("/prepodavatel")
                    }
                });
        }
    }
})

module.exports = router
