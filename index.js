require('dotenv').config(); // Load .env variables

const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here

// Homepage route to get custom objects data
app.get('/', async (req, res) => {
    const customObjectsUrl = 'https://api.hubapi.com/crm/v3/objects/2-166735240?properties=name,placement,type';
    
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    
    try {
        // Get custom object data
        const response = await axios.get(customObjectsUrl, { headers });
        const customObjectsData = response.data.results; // Assuming results contains your custom object data

        console.log(customObjectsData);
        
        // Pass the data to the homepage pug template
        res.render('homepage', {
            title: 'Custom Object Data | Integrating With HubSpot I Practicum',
            customObjects: customObjectsData
        });
    } catch (error) {
        console.error('Error fetching custom object data:', error);
        res.status(500).send('Error fetching data');
    }
});



// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});



// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

app.post('/create-cobj', async (req, res) => {
    // Get form data from req.body
    const { name, placement, type } = req.body;

    // Construct the data to create a record of custom object
    const updateData = {
        properties: {
            "name": name,             // Custom property for "name"
            "placement": placement,   // Custom property for "placement"
            "type": type              // Custom property for "type"
        }
    };

    // Init URLS
    const updateCustomObjectUrl = `https://api.hubapi.com/crm/v3/objects/2-166735240`;

    // HubSpot API headers with Authorization
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // Make the PATCH request to HubSpot to update the custom object
        const response = await axios.post(updateCustomObjectUrl, updateData, { headers });

        // Redirect to the homepage (or wherever you want)
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating custom object');
    }
});

//Redirect if url is hit for whatever reason
app.get('/create-cobj', (req, res) => {
    res.redirect('/');  // ✅ Instantly redirect to the homepage
});




/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));