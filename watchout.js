// set width and height
var width = 960,
    height = 500;

// set number of enemies and boss speed
var numberOfEnemies = 10;
var bossSpeed = 0;

// set user score, high score, and collisions
var userScore = 0,
    highScore = 0,
    collisions = 0;

// append an svg to the body
var svg = d3.select('.game').append('svg')
    .attr('width', width)
    .attr('height', height)
  .append('g')

// append enemies
var enemies = svg.selectAll('.enemy')
  .data(generateCoordinates(numberOfEnemies, width, height))
    .enter().append('image')
      .attr('class', 'enemy')
      .attr('xlink:href', 'shuriken.png')
      .attr('width', '25')
      .attr('height', '25')
      .attr('x', function(d){return d[0];}) // set attr x to Math.random()*width of svg element
      .attr('y', function(d){return d[1];}); // set attr y to Math.random()*height of svg element

// append boss
var boss = svg.append('rect')
  .data(generateCoordinates(1, width, height))
      .attr('class', 'boss')
      .attr('width', '0')
      .attr('height', '0')
      .attr('x', function(d){return d[0];}) // set attr x to Math.random()*width of svg element
      .attr('y', function(d){return d[1];}) // set attr y to Math.random()*height of svg element
    // .transition()
    //   .delay(5000)
          .attr('width', '45')
          .attr('height', '45');

// append good guy/hero with drag functionality
var hero = svg.append('circle')
    .attr('class', 'hero')
    .attr('draggable', true)
    .attr('r', 10)
    .attr('cx', width/2)
    .attr('cy', height/2)
    .attr('z-index', 1000)
  .call(d3.behavior.drag()
    .on('dragstart', dragstart)
    .on('drag', dragging)
    .on('dragend', dragend));

// update enemy positions every 1.5 seconds
setInterval(function(){
  update(generateCoordinates(numberOfEnemies, width, height));
}, 1500);

// increment score, move boss, and check for collisions
d3.timer(function(){
  updateBoss(getBossCoordinates(hero, boss));
  keepScore();
  checkCollisions(hero, enemies, boss, collision);
  bossSpeed = bossSpeed + 0.1;
});

// functions ========================================

// score stuff
function keepScore() {
  userScore += 1;
  d3.select('.current span').text(userScore);

  // if user score goes past high score, color it green
  if(userScore >= +d3.select('.high span').text()) {
    d3.select('.current span')
        .style("color", 'green')
  } else {
    d3.select('.current span')
        .style("color", 'black')
  }
}

// check collisions
function checkCollisions(hero, enemies, boss, callback) {
  var heroX = +hero.attr('cx');
  var heroY = +hero.attr('cy');
  var heroR = +hero.attr('r');

  var bossX = +boss.attr('x');
  var bossY = +boss.attr('y');
  var bossR = +boss.attr('width')/2;

  var enemy, enemyX, enemyY, diffX, diffY, diff, collisionDist;

  // enemy collision detection
  enemies.each(function() {
    enemy = d3.select(this);
    collisionDist = heroR + (+enemy.attr('width')/2);
    enemyX = enemy.attr('x');
    enemyY = enemy.attr('y');
    diffX = heroX - enemyX;
    diffY = heroY - enemyY;
    diff = Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2));
    if(diff < collisionDist) {
      callback();
    }
  });
  // boss collision detection
  collisionDist = heroR + bossR;
  diffX = heroX - bossX;
  diffY = heroY - bossY;
  diff = Math.sqrt(Math.pow(diffX,2) + Math.pow(diffY,2));
  if(diff < collisionDist) {
    callback();
  }
}

// run when there is a collision
function collision() {
  if(userScore >= highScore) {
    highScore = userScore;

// new high score!
    d3.select('.high span')
          .style("opacity", 1e-6)
          .style("color", 'blue')
          .style("font-size", "24px")
          .text(highScore)
      .transition()
        .duration(750)
          .style("opacity", 1)
      .transition()
        .delay(2500)
          .style("font-size", "16px")
          .style("color", 'black');
  }
  userScore = 0;
  bossSpeed = 0;
  collisions++;
  d3.select('.collisions span').text(collisions);
}

// generate array of random coordinates (used for enemies)
function generateCoordinates(n, w, h) {
  var arrayOfCoordinates = [];
  for(var i = 0; i < n; i++) {
    arrayOfCoordinates.push([Math.random()*(w-20)+10, Math.random()*(h-20)+10]);
  }
  return arrayOfCoordinates;
}

// update enemy positions
function update(data) {
  enemies.data(data)
    .transition()
      .duration(1500)
      // .ease('linear')
    .attr('x', function(d){return d[0];})
    .attr('y', function(d){return d[1];});
}

// get new boss coordinates
function getBossCoordinates(hero, boss) {
  var heroX = +hero.attr('cx');
  var heroY = +hero.attr('cy');

  var bossX = +boss.attr('x');
  var bossY = +boss.attr('y');

  var diffX = heroX - bossX - +boss.attr('width')/2;
  var diffY = heroY - bossY - +boss.attr('height')/2;

  var ratio = bossSpeed/Math.sqrt((Math.pow(diffX, 2) + Math.pow(diffY,2)));

  return [[bossX + ratio*diffX, bossY + ratio*diffY]];
}

// update boss
function updateBoss(data) {
  boss.data(data)
    .transition().ease('linear')
  .attr('x', function(d){return d[0];})
  .attr('y', function(d){return d[1];});
}

// drag helper functions =====
function dragstart() {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed('dragging', true);
}

// ensures hero cannot escape the box!
function dragging() {
  d3.select(this)
    .attr('cx', function(){return Math.max(Math.min(width-hero.attr('r'),d3.event.x), hero.attr('r'));})
    .attr('cy', function(){return Math.max(Math.min(height-hero.attr('r'),d3.event.y), hero.attr('r'));})
}

function dragend() {
  d3.select(this).classed('dragging', false);
}

