function display_news(result) {
    console.log("Résultat de la requête :", result);
    news_data = result["data"];
    console.log(news_data["articles"].length);
    console.log(news_data["keywords"][0]["word"]);
}


/**
 * Fetch only one url
 * @param  {String} url [The API url to fetch]
 * @param  {Function} callback [The function to call once the fetch is done]
 */
function fetchOne(url, callback){

	var myHeaders = new Headers();

	var myInit = { method: 'GET',
	               headers: myHeaders,
	               // mode: 'cors',
	               cache: 'default' };

	return fetch( url, myInit)
	.then( response => response.json() )
  	.then( json => callback(json) )
  	.catch( error => console.error('error:', error) );
}

/**
 * Fetch several urls
 * @param  {Array} urls [The urls to fetch]
 * @param  {Function} callback [The function to call once the fetch is done]
 * @param  {String} cat [cat parameter for the callback function]
 * @param  {Number} num [num parameter for the callback function]
 */
function fetchMulti(urls, callback, cat, num){

	var myHeaders = new Headers();
	var myInit = { method: 'GET',
	               headers: myHeaders,
	               // mode: 'cors',
	               cache: 'default' };

	fetches = []
	for (const url of urls)
		fetches.push(fetch(url, myInit))

	Promise.all(fetches)
	.then( responses => Promise.all(responses.map(response => response.json())) )
  	.then( json => callback(num, cat, json) )
  	.catch( error => console.error('error:', error) );
}


fetchOne('/api/news', display_news)
