// start slingin' some d3 here.

// set width and height
var width = 960;
var height = 500;

// append an svg to the body
var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g');

// add a certain number of enemies (circles)
var enemies = svg.selectAll('.enemy')
  .data([1, 2, 3, 4, 5]);

// use enter().append() to add these enemies to the svg
enemies.enter().append('circle')
    .attr('class', 'enemy')
    .attr('r', 10)
    .attr('cx', function() {return Math.random()*(width-20)+10;})
    .attr('cy', function() {return Math.random()*(height-20)+10;})

// set attr x to Math.random()*width of svg element
// set attr y to ""            height  ""
