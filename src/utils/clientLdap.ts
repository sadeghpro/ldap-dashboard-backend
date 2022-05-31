import ldap from 'ldapjs';


const client = ldap.createClient({
  url: ['ldap://127.0.0.1:1389']
});

client.on('error', (err) => {
    console.error(err)
})

export default client;