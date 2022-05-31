import express from 'express';
import { SearchEntryObject } from 'ldapjs';
import client from '../utils/clientLdap';

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
                DN: DN,
            }
            client.search(`dc=example,dc=org`, {
                filter: `(objectclass=*)`,
                scope: 'sub',
                attributes: ['uid', 'dn', 'cn', 'objectclass']
            }, function (error, result) {
                if (error) {
                    throw error;
                }
                const data: SearchEntryObject[] = [];
                result.on('searchEntry', function (entry) {
                    data.push(entry.object);
                });
                result.once('error', function (error) {
                    throw error;
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


export default router;