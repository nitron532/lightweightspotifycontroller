const express = require("express")
const app = express()
const port = 3000;

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
const redirect = "http://localhost:3000/callback"

app.use(express.static("public"))

app.get("/callback",async(req,res) => {
    let code = req.query.code
    let state = req.query.state
    if(state !== "iurkMbg8iCkwDt1c" ){
        return res.status(400).send("state mismatch")
    }
    
    try{
        const tokenResponse = await fetch("https://accounts.spotify.com/api/token",{
            method:"POST",
            headers:{
                "content-type": 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            },
            body: new URLSearchParams ({
                code: code,
                redirect_uri: redirect,
                grant_type: 'authorization_code'
              }).toString()
        })
        const accessToken = await tokenResponse.json();
        console.log(accessToken)
        if (accessToken.access_token) {
            res.redirect(`/#access_token=${accessToken.access_token}`);
        } else {
            throw new Error("Failed to retrieve access token");
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send("Failed to exchange authorization code for tokens");
    }
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});