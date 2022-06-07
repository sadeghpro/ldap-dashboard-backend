import express from 'express';
import { SearchEntryObject } from 'ldapjs';
import client from '../utils/clientLdap';
import noSessionResponse from '../utils/noSessionResponse';

const router = express.Router();


router.get('/', (req, res) => {
    if (req.session.auth) {
        client.bind(req.session.auth.DN, req.session.auth.password, function (err) {
            if (err) {
                noSessionResponse(res);
            } else {
                client.search(process.env.LDAP_BASE_DN ?? 'dc=example,dc=org', {
                    filter: `(objectclass=*)`,
                    scope: 'sub',
                    attributes: ['uid', 'dn', 'cn', 'sn', 'objectclass']
                }, function (error, result) {
                    if (error) {
                        res.send({
                            status: false,
                            error: {
                                code: 1004,
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
                                code: 1005,
                                message: 'Get users data error',
                            }
                        })
                    });
                    result.once('end', function () {
                        res.send(data);
                    })
                    
                });
    
            }
        });
    } else {
        noSessionResponse(res);
    }
})


export default router;