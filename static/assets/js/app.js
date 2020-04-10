var link = "http://127.0.0.1:5000/api/v1.0/deathTest";
var d;

d3.json(link).then(function(data){
    d = data;

    var barData = [
        {
            x: data[7]["Deaths per 100,000 "]*100,
            y: data[7]["State "]
        }
    ];

    Plotly.newPlot('bar',barData);
});
