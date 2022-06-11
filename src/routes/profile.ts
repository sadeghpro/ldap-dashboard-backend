import express from 'express';
import { SearchEntryObject } from 'ldapjs';
import client from '../utils/clientLdap';
import noSessionResponse from '../utils/noSessionResponse';
import ldap from 'ldapjs';


const router = express.Router();


router.get('/', (req, res) => {
    if (req.session.auth) {
        const DN: string = req.session.auth.DN
        client.bind(DN, req.session.auth.password, function (err) {
            if (err) {
                res.send({
                    status: false,
                    error: {
                        code: 1001,
                        message: 'Invalid DN or password',
                    }
                })
            } else {
                client.search(process.env.LDAP_BASE_DN ?? 'dc=example,dc=org', {
                    filter: `(cn=${req.session.auth?.CN})`,
                    scope: 'sub',
                    attributes: ['uid', 'dn', 'cn', 'sn', 'objectclass', 'mail', 'mobile', 'photo']
                }, function (error, result) {
                    if (error) {
                        res.send({
                            status: false,
                            error: {
                                code: 1006,
                                message: 'Get profile data error',
                            }
                        })
                    }
                    let data: SearchEntryObject;
                    result.on('searchEntry', function (entry) {
                        data = entry.object;
                    });
                    result.once('error', function (error) {
                        res.send({
                            status: false,
                            error: {
                                code: 1007,
                                message: 'Get profile data error',
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
    } else {
        noSessionResponse(res);
    }
})

router.post('/', (req, res) => {
    if (req.session.auth) {
        client.bind(req.session.auth.DN, req.session.auth.password, function (err) {
            if (err) {
                noSessionResponse(res);
            } else {
                client.modify(req.session.auth!.DN, [
                    new ldap.Change({
                        operation: 'replace',
                        modification: {
                            mail: req.body.mail,
                        }
                    }),
                    new ldap.Change({
                        operation: 'replace',
                        modification: {
                            sn: req.body.sn,
                        }
                    }),
                    new ldap.Change({
                        operation: 'replace',
                        modification: {
                            mobile: req.body.mobile,
                        }
                    })
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
                        res.send({ 
                            status: true,
                            snackbar: {
                                type: 'success',
                                message: 'Your profile data changed successfully.'
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