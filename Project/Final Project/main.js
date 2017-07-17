// Team BabeRuthless
// CS4460 - Final project

// Skeleton code was used but we changed a lot of code to fit our needs
// Bar chart code was a huge challenge because of our data - our original code
// Functions were original code
// A lot of filtering was original code
// Map, scatter plot, and bar chart - used basic skeleton code
// Brushing and linking - our original code

window.onload = start;
var year = 2000;
var state = "AL";
var red;
var mapRed;


function start() {
    //margin for scatter plot
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 500 - margin.left - margin.right,
        height = 340 - margin.top - margin.bottom;
    //margin for map
    var margin2 = {top: 20, right: 20, bottom: 30, left: 40},
        width2 = 710 - margin2.left - margin2.right,
        height2 = 1000 - margin2.top - margin2.bottom;


    // Added zoom for scatter plot - our code; adapted from online
    var zoom = d3.behavior.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

// start of map - skeleton of code taken from d3 examples
// Added a lot of custom code for brushing and linking
    var svg2 = d3.select('#map').append('svg')
        .attr('width', width2)
        .attr('height', height2);

    var projection = d3.geo.albersUsa()
        .scale(800)
        .translate([width2 / 2, height2 / 3]);

    var path = d3.geo.path()
        .projection(projection);
    var tooltip2 = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // Below - code that gets the states for our map
    d3.json('us.json', function (error, us) {
        svg2.selectAll('.states')
            .data(topojson.feature(us, us.objects.usStates).features)
            .enter()
            .append('path')
            .attr('class', 'states')
            .attr('d', path)
            .attr('id', function (us) {
                return us.properties.STATE_ABBR;
            })
            // Added in filtering to change the state color to red or blue
            // Updated the state abbreviation to update the bar chart
            .on("click", function (us) {
                svg.selectAll('.dot')
                    .filter(function (c) {
                        state = us.properties.STATE_ABBR;
                        red = c.Red;
                        return us.properties.STATE_ABBR == c.Abbr;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                    .style("fill", "green")
                    .attr("r", 10)
                    .style("opacity", 1);
                svg.selectAll('.dot')
                    .filter(function (c) {
                        return us.properties.STATE_ABBR != c.Abbr;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                    .attr("r", 7)
                    .style("fill", function (c) {
                        if (c.red < 50)
                            return 'blue';
                        else
                            return 'red';
                    })
                    .style("opacity", .5);
                // Update label and update state were added
                // updateLabel - updates the label on the bar chart (label in HTML file)
                // updateState - updates the bar chart based on the state and removes the old one
                updateLabel(state);
                d3.select("#barchart").select("svg").remove();
                updateState();

            })
            // Hover over the states shows a tooltip
            // Tooltip code was adapted from the scatter plot code
            // Added/adjusted state stuff to fit our code
            .on("mouseover", function (d) {
                svg2.selectAll('.states')
                    .filter(function (c) {
                        return c.properties.STATE_ABBR == d.Abbr;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                    .style("fill", "steelblue")
                    .style("opacity", 1);
                var abbr = d.properties.STATE_ABBR;
                tooltip2.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip2.html(abbr)
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");

            })
            .on("mouseout", function (d) {
              tooltip2.transition()
                    .duration(200)
                    .style("opacity", 0);
              container.selectAll(".state")
                    .transition()
                    .duration(250)
                    .delay(50)
            });
    });
    // This set of code brings the scatter plot point to the front of the graph
    // Some points are hidden behind one another and we wanted to bring it to the
      //front when its corresponding state was selected - our code
    d3.selection.prototype.moveToFront = function () {
        return this.each(function () {
            this.parentNode.appendChild(this);
        });
    };
    // setup x
    var xValue = function (d) {
            return d.total;
        },
        xScale = d3.scale.linear().range([0, width]),
        xMap = function (d) {
            return xScale(xValue(d));
        },
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function (d) {
            return d.Percentage
        },
        yScale = d3.scale.linear().range([height, 0]),
        yMap = function (d) {
            return yScale(yValue(d));
        },
        yAxis = d3.svg.axis().scale(yScale).orient("left");
    // add the graph canvas to the body of the webpage - from scatter plot d3 example
    var svg = d3.select("#scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);
    var container = svg.append('g');
    // Create a div block for the tooltip element
    var tooltip = d3.select("#scatter").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // load data for scatter plot
    d3.csv("data.csv", function (d) {
        d.State = d.State;
        d.red = d.Red;
        d.total = +d.Total;
        d.Percentage = +d.Percentage * 100;
        d.TechDegs = d.SET;
        return d;

    }, function (error, data) {
        xScale.domain([d3.min(data, xValue) - 10000, d3.max(data, xValue)]);
        yScale.domain([20, 50]);

        // x-axis
        container.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -3)
            .style("text-anchor", "end")
            .text("Number of Degrees");

        // y-axis
        container.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Stem");

        // draw dots -- size based on total degrees
        // colored the dots based on the red percentage - our code
        // Adapted from online example
        container.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 7)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", function (d) {
                if (d.red < 50)
                    return 'blue';
                else
                    return 'red';
            })
            .style("opacity", .5)

            // On click updates the state based on abbreviation
            // Adjusted filtering and added in states - adapted code
            .on("click", function (d) {
                svg2.selectAll('.states')
                    .filter(function (c) {
                        state = d.Abbr;
                        red = d.Red;
                        return c.properties.STATE_ABBR == d.Abbr;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                     .style("fill", function (d) {
                       if (red < 50) {
                         return 'blue';
                       } else {
                         return 'red';
                       }
                     })
                    .style("opacity", 1);
                svg2.selectAll('.states')
                    .filter(function (c) {
                        return c.properties.STATE_ABBR != d.Abbr;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                    .style("fill", "#A9A9A9");
                // Update label and update state were added
                // updateLabel - updates the label on the bar chart (label in HTML file)
                // updateState - updates the bar chart based on the state and removes the old one
                updateLabel(state);
                d3.select("#barchart").select("svg").remove();
                updateState();
            })

            // Adjusted tool tip values based on our data
            // Changed the dots to a specific color when hovered over
            // Added in Math.round for Stem Percentage
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d["State"] + "<br/> Degrees: " + xValue(d)
                    + "<br/> Stem Percentage: " + Math.round(yValue(d)) + "%")
                    .style("left", (d3.event.pageX + 5) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                container.selectAll(".dot")
                    .filter(function (c) {
                        return d.State == c.State;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)
                    .style("fill", "green");

                container.selectAll(".dot")
                    .filter(function (c) {
                        return d.State != c.State;
                    })
                    .transition()
                    .duration(650)
                    .delay(50)

            })
            // Added the moveToFront stuff for mouseout - loosely adapted
            .on("mouseout", function (d) {
                var sel = d3.select(this);
                sel.moveToFront();
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
                container.selectAll(".dot")
                    .transition()
                    .duration(250)
                    .delay(50)
                    .style("fill", function (d) {
                        if (d.red < 50)
                            return 'blue';
                        else
                            return 'red';
                    })

            });

        d3.select("#scatter").selectAll(".dot")
            .filter(function (d) {
                return d.Year == year
            })
            .transition()
            .attr('visibility', 'visible');
        d3.select("#scatter").selectAll(".dot")
            .filter(function (d) {
                return d.Year != year
            })
            .transition()
            .attr('visibility', 'hidden');

        // Updating the bar chart by state
        updateState();
    });

    // Added in zoom functionality for scatter plot - adapted from online example
    function zoomed() {
        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

}

// Created this function to update the year when the slide is moved
// Function called in HTML file when slider is adjusted
// Mostly our own code - adapted from online examples
function updateYear(){
    // Update year by the slider and grab element based on id
    year = document.getElementById("slider").value;
    // Updating the bar chart by year as well as state
    d3.select("#barchart").select("svg").remove();
    updateState();

    // Added transitions for the scatter plot - loosely based on other code
    d3.select("#scatter").selectAll(".dot")
        .filter(function (d){return d.Year == year})
        .transition()
        .duration(function(d) {
            return Math.random() * 1000;
        })
        .delay(function(d) {
            return 500
        })
        .attr('visibility', 'visible');
    d3.select("#scatter").selectAll(".dot")
        .filter(function (d){return d.Year != year})
        .transition()
        .duration(function(d) {
            return Math.random() * 1000;
        })
        .delay(function(d) {
            return 500
        })
        .attr('visibility', 'hidden')

}

// Function is responsible for changing the bar chart based on year
// Only very basic code was used from the online d3 example
// We changed most of the code for graphing the bar chart
// Data was more complex so we had to get creative when grabbing data
// Ended up making a barData array to store the breakdown of degrees
function updateState() {
   // Margin for bar chart
       var margin3 = {top: 20, right: 20, bottom: 30, left: 40},
           width3 = 500 - margin3.left - margin3.right,
           height3 = 340 - margin3.top - margin3.bottom;

    // Creating bar graph
        svg3 = d3.select("#barchart").append("svg")
            .attr("width", width3 + margin3.left + margin3.right)
            .attr("height", height3 + margin3.top + margin3.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin3.left + "," + margin3.top + ")");

        // Bar graph vars
        var xScaleBar = d3.scale.ordinal().rangeRoundBands([0, width3], 0.1);
        var xAxisBar = d3.svg.axis().scale(xScaleBar);

        // Reload in the data for bar graph
        d3.csv("data.csv", function (d) {
            d.State = d.State;
            d.red = d.Red;
            d.Total = +d.Total;
            d.Percentage = +d.Percentage * 100;
            d.TechDegs = d.SET;
            d.Humanities = +d.Humanities;
            d.Social = +d.Social;
            d.Sciences = +d.Sciences;
            d.Engineering = +d.Engineering;
            d.Education = +d.Education;
            d.Business = +d.Business;
            d.Other = +d.Other;
            d.Abbr = d.Abbr

            return d;

        }, function (error, data) {
            xScaleBar.domain(["Humanities", "Social", "Sciences", "Engineering", "Education", "Business", "Other"]);

            // Did this code from sratch (was very challenging to figure out)
            // Grabbed the row we wanted based on state and year
            var row = data.filter(function(d) {
              return d.Year == year && d.Abbr == state;
            });
            row = row[0];
            // Put the grabbed data into an array based on the values
            var barData = [
              {
                y: row.Humanities,
                x: "Humanities"

              },
              {
                x: "Social",
                y: row.Social
              },
              {
                x: "Sciences",
                y: row.Sciences
              },
              {
                x: "Engineering",
                y: row.Engineering
              },
              {
                x: "Education",
                y: row.Education
              },
              {
                x: "Business",
                y: row.Business
              },
              {
                x: "Other",
                y: row.Other
              }
            ];

            // Made the y-axis scales based on the new barData we made
            var barYScale = d3.scale.linear()
              .domain([0, d3.max(barData, function(d) {return d.y})])
              .range([height3, 0]);

            var barYAxis = d3.svg.axis().scale(barYScale).orient("left");

            // Created the bar graph from the new barData we made
            svg3.append("div")
                .append("text")
                .attr("class", "label")
                .text(state);

            svg3.append('g')
                .attr('class', 'x axis')
                .attr("transform", "translate(0," + height3 + ")")
                .attr("x", width3)
                .call(xAxisBar);

            svg3.append('g')
                .attr('class', 'y axis')
                .attr("y", height3)
                .call(barYAxis)
                .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("dy", "1em")
                .style("text-anchor", "end")
                .text("Number of Degrees");

            svg3.append('g')
                .selectAll(".bar")
                .data(barData)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("width", xScaleBar.rangeBand())
                .attr("y", function (d) {
                    return barYScale(d.y);
                })
                .attr('x', function(d) {
                  return xScaleBar(d.x);
                })
                .attr("height", function (d) {
                    return (barYScale(0) - barYScale(d.y));
                });


        });

}

function showValue(newValue)
{
    document.getElementById("range").innerHTML=newValue;
}
// Used to update the label - our code
function updateLabel(newLabel) {
    document.getElementById("label").innerHTML = newLabel;
}
