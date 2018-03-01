 var logs = []
 var xhttp = new XMLHttpRequest();

 document.onclick = function(e) {
     if (window.event) {
         e = event.srcElement; //assign the element clicked to e (IE 6-8)
     } else {
         e = e.target; //assign the element clicked to e
     }

     if (e.className && e.className.indexOf('searchTrailer') != -1) {
         document.getElementById('trailer').style.display = 'inline-block';
         gapi.client.load('youtube', 'v3', () => {
             searchTr(e.id)
         });
     } else {
         if (e.className && e.className.indexOf('addMovie') != -1) {
             addMovie(e.id)
         }
     }
 }

 function start(searchKey) {
     // Initializes the client with the API key and the Translate API.
     gapi.client.init({	
             'apiKey': 'key'
         }).then(function() {
             // Executes an API request, and returns a Promise.
             console.log("succes")
         }),
         function(reason) {
             console.log('Error: ' + reason.result.error.message);
         };
 };
 gapi.load('client', start);

 function searchTr(searchKey) {
     var keyq = searchKey;
     var request = gapi.client.youtube.search.list({
         q: keyq,
         part: 'snippet'
     });

     request.execute(function(response) {
         var str = JSON.stringify(response.result.items[0]);

         document.getElementById('YoutubeVideo').src = "https://www.youtube.com/embed/" + response.result.items[0].id.videoId + "?autoplay=1";

         console.log("----------REQUEST & ANSWER --------------")
         var newReq = {
     		status: 200,
     		url: request.Zq.k5.path,
     		method: request.Zq.k5.method
     	}
     	var JnewReq = JSON.stringify(newReq)
     	logs.push(JnewReq)
     	localStorage.setItem('logs', JSON.stringify(logs));
         console.log(JnewReq)
         window.reqs.push(request)
         window.ress.push(response)
     });
 }

 search = function() {
     var input_key = document.getElementById('movie').value;
     var url = "https://api.themoviedb.org/3/discover/movie?with_genres="
     document.getElementById('movies').style.display = 'inline-block';
     switch (input_key) {
         case "drama":
             url += "18"
             break;
         case "action":
             url += "28"
             break
         case "animation":
             url += "16"
             break
         case "comedy":
             url += "35"
             break
         case "family":
             url += "10751"
             break
         case "western":
             url += "37"
             break;
         case "mistery":
             url += "9648"
             break
         default:
             break;
     }

     url += "&api_key=key"
     xhttp.open("GET", url, false);
     xhttp.send()
     var result = JSON.parse(xhttp.response);
     console.log("----------REQUEST & ANSWER --------------")
     var newReq = {
     	status: xhttp.status,
     	url: xhttp.responseURL,
     	method: "GET"
     }
     var JnewReq = JSON.stringify(newReq)
     logs.push(JnewReq)
     localStorage.setItem('logs', JSON.stringify(logs));

     console.log(JnewReq)
    // console.log(xhttp.status)
    // console.log(xhttp.response)
     window.ress.push(xhttp.response)
     window.reqs.push(xhttp)
     results = result.results
     results_titles = []
     for (var i = 0; i < results.length; i++) {
         results_titles.push(results[i].title)
     }
     var childNodes = document.getElementById("movies").childNodes
     var index = 0
     for (var i = 0; i < childNodes.length; i++) {
         if (childNodes[i].nodeType != 1) {
             continue;
         }
         childNodes[i].innerHTML = results_titles[index] + "<button class=\'searchTrailer btn btn-default\' id=\'" + results_titles[index] + " trailer\'>trailer</button>" + "<button class=\'addMovie btn btn-default\' id=\'" + results_titles[index] + "\'>Add</button>"
         index++
     }
 }

 addMovie = function(movie) {
     var formMovies = document.getElementById("moviesForm")
     var x = document.createElement("INPUT");
     x.setAttribute("type", "text");
     x.setAttribute("name", "movies")
     x.setAttribute("value", movie)
     x.setAttribute("readOnly", true)
     formMovies.appendChild(x)
 }