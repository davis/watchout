// start slingin' some d3 here.

// set width and height
var width = 960;
var height = 500;
var numberOfEnemies = 30;

// append an svg to the body
var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g');

// good guy/hero
var hero = svg.append('circle')
    .attr('class', 'hero')
    .attr('draggable', true)
    .attr('r', 10)
    .attr('cx', width/2)
    .attr('cy', height/2);

// add a certain number of enemies (circles)
var enemies = svg.selectAll('.enemy')
  .data(new Array(numberOfEnemies));

// use enter().append() to add these enemies to the svg
enemies.enter().append('circle')
    .attr('class', 'enemy')
    .attr('r', 10)
    // set attr x to Math.random()*width of svg element
    .attr('cx', function() {return Math.random()*(width-20)+10;})
    // set attr y to '            height  '
    .attr('cy', function() {return Math.random()*(height-20)+10;});

var drag = d3.behavior.drag()
  .on('dragstart', dragstart)
  .on('drag', dragged)
  .on('dragend', dragend);
d3.selectAll('.hero').call(drag);

function dragstart() {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed('dragging', true);
}

function dragged() {
  d3.select(this)
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y)
}

function dragend() {
  d3.select(this).classed('dragging', false);
}








function update(data) {
  enemies
    .transition()
      .duration(1000)
    .attr('cx', function() {return Math.random()*(width-20)+10;})
    .attr('cy', function() {return Math.random()*(height-20)+10;});
}

setInterval(update, 1500);
