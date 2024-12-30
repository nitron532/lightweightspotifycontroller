
let accessToken ="";
const clientId = "c21828a7e3ae43aabaa427414d62bd86"
const redirect = "http://localhost:3000/callback"
let s = "user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private"

function authorize(){
    const authUrl = "https://accounts.spotify.com/authorize?" + 
        new URLSearchParams({
            response_type: "code",
            client_id: clientId,
            redirect_uri: redirect,
            state: "iurkMbg8iCkwDt1c",
            scope: s
        }).toString();
        window.location.href = authUrl;
}

async function main(){
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); //returns string from url one character past hash using substring(1)
    accessToken = hashParams.get("access_token"); //uses urlsearchparams get method to return value associated to access_token parameter
    if(accessToken){ //if its defined
        //console.log("Access token", accessToken)
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code") || null;
    const state = urlParams.get("state") || null;
    if(!code || !state){
        authorize();
    }
    if (state !== "iurkMbg8iCkwDt1c") {
        window.location.href = "/#error=state_mismatch";
        return;
    }

}
main();