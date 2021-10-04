require('dotenv').config();
const env = process.env;
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        type: env.type,
        project_id: env.project_id,
        private_key_id: env.private_key_id,
        private_key: env.private_key.replace(/\\n/g, '\n'),
        client_email: env.client_email,
        client_id: env.client_id,
        auth_uri: env.auth_uri,
        token_uri: env.token_uri,
        auth_provider_x509_cert_url: env.auth_provider_x509_cert_url,
        client_x509_cert_url: env.client_x509_cert_url
    })
});

const db = admin.firestore();

const postsRef = db.collection('posts');
const getPosts = async () => {
    let [users, postsResult] = await Promise.all([getUsers(), postsRef.orderBy('week', 'asc').get()]);

    const posts = postsResult.docs.map(d => {
        const post = d.data();
        const author = users.find(u => u.id == post.author);
        if (!!author) {
            post.fullName = `${author.firstName} ${author.lastName}`;
        }
        return post;
    });

    return posts;
};

const deletePost = async (postId) => {
    const queryResults = await postsRef.where("id", "==", postId).get();
    if (queryResults.empty) return false;
    const actionResult = await queryResults.docs[0].ref.delete();

    return !!actionResult;
};

const addPost = async (postObj, addEditMode) => {
    let actionResult = undefined;

    if (addEditMode == 'add') {
        actionResult = await postsRef.doc().set(postObj);
    } else if (addEditMode == 'edit') {
        const queryResults = await postsRef.where("id", "==", postObj.id).get();
        if (queryResults.empty) return false;
        actionResult = await queryResults.docs[0].ref.set(postObj);
    }

    return !!actionResult;
};

const usersRef = db.collection('users');
const getUsers = async () => {
    const usersResult = await usersRef.get();
    const users = usersResult.docs.map(d => {
        const user = d.data();
        user.dbRef = d.ref;
        return user;
    });
    return users;
};

const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const port = env.PORT || 5000;

app
    .use(cookieParser())
    .use(express.static(path.join(__dirname, '../build/'))); // Serve dir

app.listen(port, () => {
    console.log(`Hosting Server @ http://localhost:${port}`);
});

app.get('/login', async (req, res) => {
    const query = req.query;
    Object.keys(query).forEach(key => {
        query[key] = query[key].toLowerCase();
    });

    const users = await getUsers();
    const matchingAccount = users.find(a => a.username == query.username && a.password == query.password);
    if (!matchingAccount) {
        res.status(500).send('Incorrect username and or password. Ask Hunter if you forgot your login info.');
        return;
    }

    const saveKey = randomString(16);
    const user = matchingAccount;
    await user.dbRef.update({ saveKey });

    res.cookie('saveKey', saveKey);
    res.cookie('userId', user.id);
    res.status(200).send('OK');
});

app.get('/request-posts', async (req, res) => {
    const posts = await getPosts();
    res.status(200).send(posts);
});

app.get('/save-post', async (req, res) => {
    const cookies = req.cookies;

    const users = await getUsers();
    const matchingAccount = users.find(a => a.id == cookies.userId);

    function handleSaveError(message) {
        // Display error about the backup file.
        res.status(500).send(message + '\n\nA backup file will download with the form data, please send this to Hunter so he can manually add it.');
    }

    if (!cookies.saveKey || !matchingAccount) {
        handleSaveError('You are not logged in.');
        return;
    } else if (cookies.saveKey != matchingAccount.saveKey) {
        handleSaveError('Your authentication may have expired.');
        return;
    }

    const postObj = JSON.parse(req.query.postObj);
    const posts = await getPosts();
    let overWrite = false;
    let thePost = undefined;

    if (!!postObj.id) {
        thePost = posts.find(p => p.id == postObj.id);

        if (!thePost) {
            handleSaveError('The post no longer exists.');
            return;
        } else if (thePost.author != matchingAccount.id) {
            handleSaveError('You cannot edit other user\'s posts.');
            return;
        }

        overWrite = true;
    }

    postObj.author = matchingAccount.id;
    if (!!postObj.fullName) delete postObj.fullName;

    if (!overWrite) { // Save new
        postObj.id = new Date().getTime(); // Unix timestamp, will never be the same
    }

    // Store the post
    if (addPost(postObj, overWrite ? 'edit' : 'add')) {
        res.status(200).send('OK');
    } else {
        handleSaveError('A database error occurred.');
    }
});

app.get('/delete-post', async (req, res) => {
    const query = req.query;
    const cookies = req.cookies;

    const users = await getUsers();
    const matchingAccount = users.find(a => a.id == cookies.userId);

    if (!cookies.saveKey || !matchingAccount) {
        res.status(500).send('You are not logged in.');
        return;
    } else if (cookies.saveKey != matchingAccount.saveKey) {
        res.status(500).send('Your authentication may have expired.');
        return;
    }

    const posts = await getPosts();
    const thePost = posts.find(p => p.id == query.postId);

    if (!thePost) {
        res.status(500).send('The post no longer exists.');
        return;
    } else if (thePost.author != matchingAccount.id) {
        res.status(500).send('You cannot edit other user\'s posts.');
        return;
    }

    if (deletePost(thePost.id)) {
        res.status(200).send('OK');
    } else {
        res.status(500).send('A database error occurred, the post may no longer exist.');
    }
});

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}