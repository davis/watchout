// start slingin' some d3 here.

// set width and height
var width = 960;
var height = 500;

// set number of enemies
var numberOfEnemies = 30;

// set userScore
var userScore = 0;
var highScore = 0;
var collisions = 0;

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


function collision(enemy) {
  // calculate diff between hero's x and enemy's x
  var diffX = hero[0][0].getAttribute('cx') - enemy.getAttribute('cx');
  //                  ""           y and enemy's y
  var diffY = hero[0][0].getAttribute('cy') - enemy.getAttribute('cy');
  // calculate distance between hero and enemy using pythagorean theorem
  var diff = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
  // calcuate sum of hero's radius and enemy radius (max dist before collision)
  var maxDistBeforeCollision = parseFloat(hero[0][0].getAttribute('r')) + parseFloat(enemy.getAttribute('r'));
  // if distance between hero and enemy < max dist before collision
  if(diff < maxDistBeforeCollision) {
  //   call collided(), reset score, etc
    // check for new high score
    if(userScore > highScore) {
      highScore = userScore;
      d3.select('.high span').text(highScore);
    }
    userScore = 0;
    collisions++;
    d3.select('.collisions span').text(collisions);
    console.log('boom!');

  }
}

setInterval(function(){
  //increment and update score
  userScore += 10;
  d3.select('.current span').text(userScore);
  for(var i = 0; i < enemies[0].length; i++) {
    collision(enemies[0][i]);
  }
}, 50);












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
