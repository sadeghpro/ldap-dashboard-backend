import express from 'express';
import { SearchEntryObject } from 'ldapjs';
import client from '../utils/clientLdap';
import noSessionResponse from '../utils/noSessionResponse';
import ldap from 'ldapjs';


const router = express.Router();


router.post('/', (req, res) => {
    const DN: string = req.body.DN
    client.bind(DN, req.body.password, function (err) {
        if (err) {
            res.send({
                status: false,
                error: {
                    code: 1001,
                    message: 'Invalid DN or password',
                }
            })
        } else {
            req.session.auth = {
                password: req.body.password,
                CN: req.body.CN,
                DN: DN,
            }
            client.search(process.env.LDAP_BASE_DN ?? 'dc=example,dc=org', {
                filter: `(objectclass=*)`,
                scope: 'sub',
                attributes: ['uid', 'dn', 'cn', 'sn', 'objectclass']
            }, function (error, result) {
                if (error) {
                    res.send({
                        status: false,
                        error: {
                            code: 1002,
                            message: 'Get users data error',
                        }
                    })
                }
                const data: SearchEntryObject[] = [];
                result.on('searchEntry', function (entry) {
                    data.push(entry.object);
                });
                result.once('error', function (error) {
                    res.send({
                        status: false,
                        error: {
                            code: 1003,
                            message: 'Get users data error',
                        }
                    })
                });
                result.once('end', function () {
                    res.send({
                        status: true,
                        data,
                    });
                })

            });

        }
    });
})

router.post('/change', (req, res) => {
    if (req.session.auth) {
        client.bind(req.session.auth.DN, req.session.auth.password, function (err) {
            if (err) {
                noSessionResponse(res);
            } else {
                client.modify(req.session.auth!.DN, [
                    new ldap.Change({
                        operation: 'replace',
                        modification: {
                            userPassword: req.body.password
                        }
                    }),
                ], function (err) {
                    if (err) {
                        res.send({ 
                            status: false,
                            snackbar: {
                                type: 'error',
                                message: 'There is an error. please contact administrator',
                            }
                        })
                    } else {
                        req.session.auth = {
                            password: req.body.password,
                            DN: req.session.auth!.DN,
                            CN: req.session.auth!.CN,
                        }
                        res.send({ 
                            status: true,
                            snackbar: {
                                type: 'success',
                                message: 'Your password changed successfully.'
                            }
                        })
                    }
                });
            }
        });
    } else {
        noSessionResponse(res);
    }
})


export default router;