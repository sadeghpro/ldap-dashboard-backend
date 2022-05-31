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