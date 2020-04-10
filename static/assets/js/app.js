var link = "http://127.0.0.1:5000/api/v1.0/prescriptionTest";

d3.json(link).then(function(data){
    console.log(data);
});