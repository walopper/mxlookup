'use strict'

import nslookup from 'nslookup';
import config from './config';
import { createClient } from 'then-redis';
import 'babel-core/register';
import 'babel-polyfill';

const db = createClient();

/**
 * format the response from nxlookup
 * @param {object} response 
 * @param {object} error 
 * @return {object}
 */
const setResponse = (data, error, source='db') => {
    let response = null;

    if(error){
        response = {error: error.name};
        return JSON.stringify(response);
    }

    if(Array.isArray(data)){
        response = data.length ? {mx: true, server: data, source} : {mx: false};
        return JSON.stringify(response);
    }

    return JSON.stringify({mx: false});
}

/** fetch MX record from db or DNS if not found on db
 * @param {string} domain 
 * @param {object} res express server response
 */
const fetchDB = async (req, res) => {
    const domain = req.params.domain;

    const data = await db.get(domain)
                                .then(response => JSON.parse(response))
    
    // return stores value
    if(data) {
        res.send(setResponse(data)); // send output to server
        return;
    }

    //fetch DNS and store new value un db
    nslookup(domain)
        .server(config.dnsServer)
        .type('mx')
        .timeout(config.lookupTimeout)
        .end(function (error, data) {

            if(error) data = null;

            storeInDB(domain, data);
            res.send(setResponse(data, error, 'dns')); // send output to server

        });

    return;
}

const storeInDB = (domain, data) => {
    return data
            ? db.set(domain, JSON.stringify(data), 'EX', config.domainDataExpire)
            : db.set(domain, null, 'EX', 1)
}

const mxlookup = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    if(!req.params.domain) {
        res.send(JSON.stringify({ error: 'no_domain' }));
        return;
    }

    fetchDB(req, res);

}

export default mxlookup;