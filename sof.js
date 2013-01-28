$(document).ready(function(){
var margin = {top: 20, right: 80, bottom: 50, left: 50},
	width = 1440 - margin.left - margin.right,
    height = 748*0.45 - margin.top - margin.bottom;
    var parser = d3.time.format("%Y-%m-%d").parse;
//google map marker array
                  var markers = []; var map;
//line chart
    var page = 1;
    var cutouts = [new Date(2007, 11, 31),new Date(2008,11,31), new Date(2009,11,31), new Date(2010,11,31), new Date(2011,7,31), new Date(2012, 10, 1)];
    var x = d3.time.scale()
            .range([0, width]);
            
    var y = d3.scale.linear()
            .range([150, 0]);
            
    var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");
            
    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");
//calendar view
    var cellSize = 10;
//question line
    var qline = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {return x(d.date);})
            .y(function(d) {return y(d.question);});
//response line
    var rline = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {return x(d.date);})
            .y(function(d) {return y(d.response);});
//comment line
    var cline = d3.svg.line()
            .interpolate("monotone")
            .x(function(d) {return x(d.date);})
            .y(function(d) {return y(d.comment);});

	var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//arrow images
    svg.append("image")
        .attr("xlink:href", "right.svg")
        .attr("class", "arrow")
        .attr("id", "right")
        .attr("x", width-40)
        .attr("y", 15)
        .attr("width", 50)
        .attr("height", 50)
        .style("visibility", function(){return page==4 ? "hidden":"visible";});
    svg.append("image")
        .attr("xlink:href", "left.svg")
        .attr("class", "arrow")
        .attr("id", "left")
        .attr("x", -50)
        .attr("y", 15)
        .attr("width", 50)
        .attr("height", 50)
        .style("visibility", function(){return page==1 ? "hidden":"visible";});
    svg.selectAll(".arrow")
        .style("opacity", 0.3)
        .on("mouseover", function(){
            d3.select("body").style("cursor","pointer");
            svg.selectAll(".arrow").style("opacity", 1);})
        .on("mouseout", function(){
            d3.select("body").style("cursor","auto");
            svg.selectAll(".arrow").style("opacity", 0.3);})
        .on("click", function(){
            if(d3.select(this).attr("id") == "right") page++;
            else page--;
            //update arrows
            d3.select("#right").style("visibility", function(){return page == 4 ? "hidden":"visible";});
            d3.select("#left").style("visibility", function(){return page == 1 ? "hidden":"visible";});
            //update calendars
            svg.selectAll(".calendar, .month").style("visibility", function(d){
                return (d < cutouts[page]) && (d >cutouts[page-1]) ? "visible":"hidden";});
        });

//Information by time
    d3.csv("haskell_counts.csv", function(data){
            data.forEach(function(d){
                d.date = parser(d.date);
                d.question = +d.question;
                d.response = +d.response;
                d.comment = +d.comment;
            });
           
           y.domain([0, d3.max(data, function(d) {return Math.max(d.question,d.response,d.comment);})]);
           x.domain(d3.extent(data, function(d){return d.date;}));
           
           svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + 300 + ")")
           .call(xAxis);
           
           svg.append("g")
           .attr("class", "y axis")
           .attr("transform", "translate(0," + 150 + ")")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 6)
           .attr("dy", ".71em")
           .style("text-anchor", "end")
           .text("Posts Count");

           svg.append("path")
                .attr("transform", "translate(0," + 150 + ")")
                .datum(data)
                .attr("class","qline")
                .attr("d", qline);
           svg.append("path")
                .attr("transform", "translate(0," + 150 + ")")
                .datum(data)
                .attr("class","rline")
                .attr("d", rline);
           svg.append("path")
                .attr("transform", "translate(0," + 150 + ")")
                .datum(data)
                .attr("class","cline")
                .attr("d", cline);
    var dots = svg.selectAll(".dot")
                .data(data)
            .enter().append("g")
                .attr("class", "dot")
                .attr("transform", "translate(0," + 150 + ")")
               .style("visibility", "hidden");

           
        dots.append("circle")
           .attr("class", "qdot")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .attr("r", 3.5)
           .attr("cx", function(d){return x(d.date);})
           .attr("cy", function(d){return  y(d.question);})
        dots.append("circle")
           .attr("class", "rdot")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .attr("r", 3.5)
           .attr("cx", function(d){return x(d.date);})
           .attr("cy", function(d){return  y(d.response);})
        dots.append("circle")
           .attr("class", "cdot")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .attr("r", 3.5)
           .attr("cx", function(d){return x(d.date);})
           .attr("cy", function(d){return  y(d.comment);})
        dots.append("text")
           .attr("class", "qCount")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .text(function(d,i){return d.question+" questions";})
           .attr("x", function(d){return x(d.date);})
           .attr("y", function(d){return  y(d.comment+50);})
        dots.append("text")
           .attr("class", "rCount")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .text(function(d,i){return d.response+" responses";})
           .attr("x", function(d){return x(d.date);})
           .attr("y", function(d){return  y(d.comment+30);})
        dots.append("text")
           .attr("class", "cCount")
           .attr("id", function(d){var t = +d.date; return "dot"+t;})
           .text(function(d,i){return d.comment+" comments";})
           .attr("x", function(d){return x(d.date);})
           .attr("y", function(d){return  y(d.comment+10);})
    });
    var colors = ["steelblue","#e377c2","#e3cf57"];
    var busLines = ["qline","rline","cline"];
//posts type selections
    var routeData = ["Questions", "Answers", "Comments"];
    var routes = svg.selectAll(".routes")
                  .data(routeData)
                  .enter().append("g")
                  .attr("class", "routes")
                  .attr("transform", function(d,i) {return "translate(20,"+(i*25+150)+")";});
    routes.append("rect")
        .attr("x", 0)
        .attr("width", 64)
        .attr("height", 18)
        .style("stroke", "black")
        .style("opacity", 1)
        .style("fill", function(d,i){return colors[i];});
    routes.append("text")
        .attr("x", 0)
        .attr("y", 9)
        .attr("dx", "0.4em")
        .attr("dy", ".35em")
        .style("fill", "white")
        .style("text-anchor", "start")
        .text(function(d){return d;});
//routes' mouse functionalities
    routes
        .on("mouseover", function(){d3.select("body").style("cursor","pointer");})
        .on("mouseout", function(){d3.select("body").style("cursor","auto");})
        .on("click", function(d,i){
            svg.selectAll(".qdot, .rdot, .cdot, .qCount, .rCount, .cCount").style("visibility", "hidden");
            svg.selectAll("rect.calendar").style("fill", "#eee0e5");
            svg.selectAll("text.calendar").style("fill", "#848484");
            if(d3.select(this).select("rect").style("opacity") == 1){
            //set invisible
                d3.select(this).select("rect").style("opacity", 0.5);
                d3.selectAll("path."+busLines[i]).style("visibility", "hidden");
                flag = 0;
                hideMarkers(i);
            }
            else{
            //set visible
                d3.select(this).select("rect").style("opacity", 1);
                d3.selectAll("path."+busLines[i]).style("visibility", "visible");
                flag = 1;
                showMarkers(i);
            }
        });
    function hideMarkers(input){
        if(input >= 0 && input <= 2)
            for(var i = 0; i < markers.length; i++)
                  if(markers[i].get("class") == input+1) markers[i].setMap(null);
    }
    function showMarkers(input){
        if(input >= 0 && input <= 2)
            for(var i = 0; i < markers.length; i++)
                  if(markers[i].get("class") == input+1) markers[i].setMap(map);
    }
//calendar view
    function isFirstDayofMonth(date){return day_of_month(date) == 1};

    var cellSize = 13;
    var day = d3.time.format("%w"),
        day_of_month = d3.time.format("%e"),
        week = d3.time.format("%U"),
        month = d3.time.format("%m"),
        year = d3.time.format("%Y"),
        format = d3.time.format("%b, %Y"),
        formatx = d3.time.format("%Y-%m-%d");
        y_position = 0,
        previous_week = 1;
    var calendar = svg.selectAll(".day")
                  .data(d3.time.days(new Date(2008, 7, 1), new Date(2011, 7, 31)))
                .enter().append("g")
                  .attr("class", "day")
                  .attr("transform", function(d){
                        var x = day(d) * cellSize+cellSize*8*month(d)-90, y;
                        if (isFirstDayofMonth(d) == 1) y_position = 0;
                        else if(previous_week != week(d)) y_position++;
                        
                        previous_week = week(d);
                        y = y_position * cellSize + 20;
                        
                        return "translate("+ x + "," + y +")";
                    });
 //draw day of the month
        calendar.append("rect")
            .attr("class", "calendar")
            .attr("width", cellSize)
            .attr("height", cellSize)
            .attr("id",function(d){return day(d)*(week(d)-39);})
            .style("stroke", "#ccc")
            .style("fill", "#EEE0E5");
        calendar.append("text")
            .attr("class", "calendar")
            .style("fill", "#848484")
            .attr("dy", ".7em")
            .text(function(d){return day_of_month(d);});

//mouse actions
        var tempDate;
        calendar
            .on("mouseover", function(){d3.select("body").style("cursor","pointer")})
            .on("mouseout", function(){d3.select("body").style("cursor","auto")})
            .on("click", function(d){
                //clean up
                svg.selectAll(".qdot, .rdot, .cdot, .qCount, .rCount, .cCount").style("visibility", "hidden");
                svg.selectAll("rect.calendar").style("fill", "#eee0e5");
                svg.selectAll("text.calendar").style("fill", "#848484");
                tempDate = +d;
                //color
                    svg.selectAll("#dot"+tempDate).style("visibility", "visible");
                    d3.select(this).select("rect").style("fill", "#8B475D");
                    d3.select(this).select("text").style("fill", "#fff");
            });
            var monthIndicators = svg.selectAll(".month")
                  .data(d3.time.months(new Date(2008, 7), new Date(2011, 8)))
                  .enter().append("text")
                  .text(function(d){return format(d);})
                  .attr("class", "month")
                  .style("text-anchor", "start")
                  .style("fill", "gray")
                  .attr("transform", function(d,i){
                    return "translate(" + (cellSize*8*(month(d)-1)+40) +",0)";});
                svg.selectAll(".calendar, .month")
                  .style("visibility", function(d){return (d < cutouts[page])&&(d > cutouts[page-1]) ? "visible":"hidden";});

/******************************************************************************************************************************************/
/******************************************************************************************************************************************/

//Google Map API
        d3.select("#map").style("opacity", 0.5);
        var types = ["<p>Question:</p>","<p>Answer:</p>","<p>Comment:</p>"];
        map = new google.maps.Map(d3.select("#map").node(),{
                            zoom:2,
                            center: new google.maps.LatLng(38.5450, -121.7394),//lat and long of center of Davis
                            mapTypeId: google.maps.MapTypeId.TERRAIN });
                  // var stamParser = d3.time.format();
                  //Read in stop information
        d3.csv("haskell1.csv", function(data){
                data.forEach(function(d){
                            d.type = +d.type;
                            d.latitude = +d.latitude;
                            d.longitude = +d.longitude;
                             d.timestamp = +d.timestamp;
                            //draw markers
                            var marker = new google.maps.Marker({
                                                animation: null,
                                                icon: { fillColor : colors[d.type-1],
                                                        fillOpacity: 1,
                                                        path: google.maps.SymbolPath.CIRCLE,
                                                        strokeColor: "black",
                                                        scale: 3,
                                                        strokeWeight: 1,
                                                        strokeOpacity: 0.8},
                                                        position: new google.maps.LatLng(d.latitude, d.longitude),
                                                        map:map,
                                                        clickable:true,
                                                        cursor: "pointer",
                                                        title: d.title?d.title:"No title"});
                             var info = types[d.type-1] + d.content + "...";
                             var infowindow = new google.maps.InfoWindow({  content: info,
                                                                            maxWidth: 200});
                             marker.set("id", d.timestamp);
                             marker.set("class", d.type);
                             markers.push(marker);
                             google.maps.event.addListener(marker, 'click', function(){infowindow.open(map, marker);});
                                      
                    });
        });
 
});//document ready function

