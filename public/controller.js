const hashParams = new URLSearchParams(window.location.hash.substring(1)); //returns string from url one character past hash using substring(1)
let urlToken = hashParams.get("access_token"); //uses urlsearchparams get method to return value associated to access_token parameter
let apiURL = "https://api.spotify.com/v1/";

let controlElements = document.getElementsByClassName("control");
let currentSong = document.getElementById("currentSong");
let togglePlay = document.getElementById("togglePlay");
let progress = document.getElementById("progress");
let artist = document.getElementById("artist");
let countdown = document.getElementById("countdown");
let currentState;
//this should frequently run to get playback state
async function playbackState(){ 
        let getPlayBack = await fetch(apiURL + "me/player", {
        method: "GET",
        headers:{
            "Authorization": "Bearer " + urlToken
        }
    })
        if(getPlayBack.ok){
            if(getPlayBack.status === 204){
                currentSong.textContent = "Playback Not Active. Start on device.";
                Array.from(controlElements).forEach((element) =>{
                    element.style.visibility = "hidden";
                })
                return "Playback Not Active.";
            }
            else{
                Array.from(controlElements).forEach((element) =>{
                    element.style.visibility = "visible";
                })
                const playback = await getPlayBack.json();
                console.log(playback);
                currentSong.textContent = "Current Song: " + playback.item.name;
                artist.textContent = playback.item.artists[0].name;
                let minutes = Math.trunc((playback.progress_ms/1000) / 60);
                let seconds = Math.trunc((playback.progress_ms/1000) % 60);
                if(seconds < 10){
                    seconds = "0"+seconds.toString();
                }
                else{
                    seconds = seconds.toString();
                }
                progress.textContent = minutes.toString() + " : " + seconds;
                if(playback.is_playing){
                    togglePlay.textContent = "Pause";
                    currentState = "Playing";
                }
                else{
                    togglePlay.textContent = "Resume";
                    currentState = "Paused";
                }

            }
        }
}
currentState = playbackState();
async function play(){
    await fetch(apiURL +"me/player/play", {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + urlToken
        }
    })
}
async function pause(){
    await fetch(apiURL +"me/player/pause", {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            "Authorization": "Bearer " + urlToken
        }
    })
}
async function seek(milliseconds){
    const seekResponse = await fetch(apiURL + `me/player/seek?position_ms=${milliseconds}`,{
        method:"PUT",
        headers:{
            "Authorization": "Bearer " + urlToken
        }
    })
    if(seekResponse.status === 404){
        playbackState();
    }
    else{
        if(currentState === "Paused"){
            play();
        }
    }
}
togglePlay.onclick = async function(){
    if(this.textContent === "Resume"){
        play();
        togglePlay.textContent = "Pause";
    }
    else{
        pause();
        togglePlay.textContent = "Resume";
    }
}
document.getElementById("backward").onclick = async function(){
    await fetch(apiURL +"me/player/previous", {
        method: "POST",
        headers:{
            "Authorization": "Bearer " + urlToken
        }
    })
}
document.getElementById("forward").onclick = async function(){
    await fetch(apiURL +"me/player/next", {
        method: "POST",
        headers:{
            "Authorization": "Bearer " + urlToken
        }
    })
}
async function seekTo(){
    let timeStamp = document.getElementById("seekToTime").value;
    let minutes = parseInt(timeStamp.substring(0, timeStamp.indexOf(":"))) * 60 * 1000; // Minutes
    let seconds = parseInt(timeStamp.substring(timeStamp.indexOf(":") + 1)) * 1000;     // Seconds
    let milliseconds = (minutes + seconds).toString();
    seek(milliseconds);
}
async function countIn(){
    let sec = 2;
    if(currentState === "Playing"){
        await pause();
    }
    setTimeout(async ()=>{
        seek(0);
    },2000) //button says 3 seconds but set at 2 to account for delay in communication with spotify
    let id = setInterval(function(){
        countdown.textContent = sec;
        sec--;
    },1000);
    setTimeout(() =>{
        countdown.textContent = "";
        clearInterval(id);
    },3000);
}
setInterval(playbackState, 1000);

