# Multi-series line chart with tooltip

Chinooks are responsible for large temperature variations in southern Alberta, Canada. The interactive multi-series line chart shows temperatures measured in two Calgary locations &mdash; Springbank and Calgary International airports &mdash; on 22 November 2017. Hovering over the visualization causes a tooltip containing temperatures in the said locations to be displayed.

This visualization was implemented with D3.js version 4.12.2 and based on Mike Bostock's [Multi-series Line Chart](https://bl.ocks.org/mbostock/3884955) and [X-Value Mouseover](https://bl.ocks.org/mbostock/3902569) blocks.

## Getting started

* Clone or download the repository. 

* Run a local web server<sup>1</sup> so that the external data file can be loaded.

* Interact with the visualization in your web browser.

<sup>1</sup> If Python is installed on the computer, execute one of the following to run a web server locally on port 8000: 

* ```python -m SimpleHTTPServer 8000 ``` for Python 2.x
* ```python -m http.server 8000 ``` for Python 3.x

## Data sources

[Government of Canada &middot; Historical Climate Data](http://climate.weather.gc.ca/historical_data/search_historic_data_stations_e.html?searchType=stnName&timeframe=1&txtStationName=calgary&searchMethod=contains&StartYear=1840&EndYear=2018&optLimit=specDate&Year=2017&Month=11&Day=22&selRowPerPage=25)

[CBC](http://www.cbc.ca/news/canada/calgary/calgary-morning-weather-nov-22-2017-temperature-swings-1.4413832)
