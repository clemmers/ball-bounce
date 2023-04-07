
var lastFrames = [];
var frameCounter = 0;
const PhysicsSim = {
    targetFPS: 60,
    objects : [],
    isRunning : true
}


class PhysicalObject
{
    constructor(x, y, mass, vx, vy, ax, ay, elasticity, color)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.mass = mass || 100;
        this.vx = vx || 0;
        this.vy = vy || 0;
        this.ax = ax || 0;
        this.ay = ay || 9.8;
        this.elasticity = elasticity || 0.5;
        this.color = color || "#000000";
    }
  
  setX( x ) { return setNumValue( x, this.x ) }
  setY( y ) { return setNumValue( y, this.y ) }
  setMass( mass ) { return setNumValue( mass, this.mass ) }
  setVX( vx ) { return setNumValue( vx, this.vx ) }
  setVY( vy ) { return setNumValue( vy, this.vy ) }
  setAX( ax ) { return setNumValue( ax, this.ax ) }
  setAY( ay ) { return setNumValue( ay, this.ay ) }
  setElasticity( elasticity ) { return setNumValue( elasticity, this.elasticity ) }
  setColor( color ) { this.color = color; return color; }
  
}

class Ball extends PhysicalObject
{
  constructor({radius, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    super(x, y, mass, vx, vy, ax, ay, elasticity, color);
    this.radius = radius || 5;
    PhysicsSim.objects.push(this);
  }
  
  draw()
  {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  setRadius( radius ) { return setNumValue( radius, this.radius ) }
  
}

class Rect extends PhysicalObject
{
  constructor({width, height, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    super(x, y, mass, vx, vy, ax, ay, elasticity, color);
    this.width = width || 5;
    this.height = height || 5;
    PhysicsSim.objects.push(this);
  }
  
  
  draw()
  {
    ctx.strokeStyle = this.color;
    ctx.beginPath();

    // this feels like cheating maybe
    ctx.rect(this.x, this.y, this.width, this.height);

    ctx.stroke();
  }
  
  setWidth( width ) { return setNumValue( width, this.width ) }
  
  setHeight( height ) { return setNumValue( height, this.height ) }
  
}

function setNumValue( val, attr )
{
  if(isNaN( val ))
    throw new Error(`Expected number for ${attr.constructor.name}:
                    got ${typeof val} instead`);
  attr = val;
  return val;
}


function refresh()
{
  // may not be nec while setTimeout on fixed interval..
  var start = performance.now();
  var end;
  setTimeout(() => {
    end = performance.now();
    if ( PhysicsSim.isRunning )
      updateBall( (end - start) / 1000, PhysicsSim.objects);
    start = end;
    refresh();
  }, 1000 / PhysicsSim.targetFPS );
}

function findAvg(array) {
    var total = 0;
    var count = 0;

    jQuery.each(array, function(index, value) {
        total += value;
        count++;
    });

    return total / count;
}


function updateBall ( timePassed, objects )
{
  lastFrames[ frameCounter % 10 ] = 1 / timePassed;
  if(frameCounter % 10 === 9)
    $('#fps-counter').html( findAvg(lastFrames) );
  objects.forEach(object => {
      object.vy += object.ay * timePassed;
      object.y += object.vy * timePassed;
      object.vx +=object.ax * timePassed;
      object.x += object.vx * timePassed;
  
  /*
  if(object.y + object.radius  >= canvas.height)
  {
      object.vy *= -object.elasticity;
      object.y = canvas.height - object.r;
  } */
  });
  checkCollisions( objects );
  //console.log(timePassed);
  updateCanvas( objects );
}

function checkCollisions( objects )
{
  if(objects.length === 1) return;
  for (let i = 0; i < objects.length; i++)
  {
    for (let j = i + 1; j < objects.length; j++)
    {
      const obj1 = objects[i];
      const obj2 = objects[j];
      if (detectCollision(obj1, obj2))
      {
        handleCollision(obj1, obj2);
      }
    }
  }
}

function updateCanvas( objects )
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach(object => {
    object.draw();
  });
  frameCounter++;
}

function detectCollision(obj1, obj2)
{
  const distance = Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
  if (distance <= obj1.radius + obj2.radius)
  {
    obj1.color = "#0000FF";
    obj2.color = "#0000FF";
    return true;
  }
  return false;
}

function handleCollision(obj1, obj2) 
{
  
}


$( document ).ready(function()
{
  refresh();
});