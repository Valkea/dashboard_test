/* Variables */

// Graphics colors
var colors = ["#1D507A", "#2F6999", "#66A0D1", "#8FC0E9", "#4682B4"];

// News List used to make link between word cloud and news list
var news_data;


/* News API */

// callback
function display_news(result) {
    news_data = result["data"];
    display_wordcloud(news_data);
    display_all_articles();
}


// Display the word cloud graph
function display_wordcloud(news_data) {

    var data = [];

    var keywords = news_data["keywords"];

    for (i in keywords) {
        data.push({
            name: keywords[i]["word"],
            weight: keywords[i]['cnt'],
            events: {
                click: function(event) {
                    var keyword = event.point.name;
                    display_articles_from_word(keyword);
                }
            }
        })
    }

    Highcharts.chart('nuage', {
        series: [{
            type: 'wordcloud',
            data: data,
            name: 'Occurrences',
            colors:
                colors,
            rotation: {
                from: -60,
                to: 60,
                orientations: 8
            },
        }],
        title: {
            text: 'Actualité : nuage de mots'
        },
        chart: {
            backgroundColor: 'None'
        }
    });
}


// Select all the articles
function display_all_articles() {
    var all_articles = []
    for (i = 0; i < news_data['articles'].length; i++)
        all_articles.push(i);
    display_articles(all_articles);
}

// Select the articles matching the given word as key words 
function display_articles_from_word(word) {
    var articles;
    for (i in news_data['keywords']) {
        if (news_data['keywords'][i]['word'] == word) {
            articles = news_data['keywords'][i]['articles'];
            break;
        }
    }
    display_articles(articles);
};

// Populate the news list rows
function display_articles(articles) {

    document.getElementById("tableauArticles").innerHTML = "<table></table>"
    var tab = document.querySelector("#tableauArticles table");

    for (i in articles) {
        var article = news_data['articles'][articles[i]];
        var title = article["title"];
        var source = article["source"];
        var url = article["url"];
        var newLine = "<tr><td class='newspaper'>" + source + "</td><td><a target='_blank'href='" + url + "'>" + title + "</a></td></tr>"
        tab.innerHTML += newLine;
    }
}


/* Weather API */

// callback
function display_nvd3_graph(data) {

    if (data["status"] == "ok") {
        var temperature_data = [{
            key: 'Température',
            values: data["data"]
        }]

        var first_date = temperature_data[0]['values'][0][0];

        nv.addGraph(function() {

            var chart = nv.models.lineWithFocusChart()
                .x(function(d) {
                    return d[0]
                })
                .y(function(d) {
                    return d[1]
                })
                .yDomain([-5, 35])
                .height(270)
                .color(colors);

            chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) {
                    return d3.time.format('%H:00 (%a)')(new Date(d))
                });

            chart.x2Axis
                .showMaxMin(false)
                .tickFormat(function(d) {
                    return d3.time.format('%a %-d/%-m')(new Date(d))
                });

            chart.yAxis //Chart y-axis settings
                .showMaxMin(false)
                .axisLabel('Température (°c)')
                .tickFormat(d3.format('.00f'));

            chart.y2Axis
                .showMaxMin(false)
                .ticks(false);

            d3.select('#meteo svg')
                .datum(temperature_data)
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });
    }
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


/* API calls ... */

fetchOne('/api/news', display_news)
fetchOne('/api/meteo', display_nvd3_graph) // on peut aussi avec d3.json('/api/meteo', display_nvd3_graph);
