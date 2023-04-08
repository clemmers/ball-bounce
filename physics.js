
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
        PhysicsSim.objects.push(this);
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

class Polygon extends PhysicalObject
{
  constructor({vertices, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    super(x, y, mass, vx, vy, ax, ay, elasticity, color);
    this.vertices = vertices || [[-5.0, -5.0], [-5.0, 5.0], [5.0, 5.0], [5.0, -5.0]];
  }
  
  draw()
  {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    //ctx.moveTo(this.x, this.y);
    this.vertices.forEach( vertex => ctx.lineTo(vertex[0] + this.x, vertex[1] + this.y));
    ctx.closePath();
    ctx.stroke();
  }
  
  setVertices ( vertices )
  {
    if(!isValidPolygon( vertices ))
      throw new Error("Given vertices must be in array format [ [x, y], ... [x, y] ]");
    this.vertices = vertices;
    return vertices;
  }
  
  
  // given an existing vertex point, replaces it with new vertex point
  // replaceVertex ( [x, y], [x, y] )
  // returns new vertex
  replaceVertex ( oldVertex, newVertex )
  {
    if(!(oldVertex in this.vertices))
    {
      console.warn("old vertex not found in polygon.. adding new vertex to end");
      this.addVertex( newVertex );
    }
    if(!isValidCoordPair(newVertex))
      throw new Error("Given vertex points must be in [x, y] format!");
    this.vertices[this.vertices.findIndex(oldVertex)] = newVertex;
    return newVertex;
  }
  
  // addVertex( [ x, y ], pos )
  // default pos value places vertex at end of vertices array
  // returns vertex
  addVertex (vertex, pos)
  {
    if(!isValidCoordPair(vertex))
      throw new Error("Given vertex points must be in [x, y] format!");
    this.vertices.splice(pos || this.vertices.length, 0, vertex);
    return vertex;
  }
  
}


class RegularPolygon extends Polygon
{
  constructor({numSides = 6, radius = 10, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    super({vertices: regularPolygonVertices( numSides, radius ), x, y, mass,
    vx, vy, ax, ay, elasticity, color});
    this.radius = radius;
    this.numSides = numSides;

  }
  
  setSize( radius )
  {
    this.setVertices( regularPolygonVertices( this.numSides, radius ) );
  }
  
}



class Rect extends Polygon
{
  constructor({width = 5, height = 5, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    super({vertices: [[-width / 2, -height / 2], [-width / 2, height / 2],
    [width / 2, height / 2], [width / 2, -height / 2]], x, y, mass,
    vx, vy, ax, ay, elasticity, color});
    this.width = width;
    this.height = height;

  }
  
  setSize( width, height )
  {
    this.setVertices( [[-width / 2, -height / 2], [-width / 2, height / 2],
    [width / 2, height / 2], [width / 2, -height / 2]] );
  }
  
  setWidth( width )
  {
    this.setSize( width, this.height );
    return width;
  }
  
  setHeight ( height )
  {
    this.setSize( this.width, height );
    return height;
  }
  
}

function regularPolygonVertices ( numSides, radius )
{
  let vertices = [];
  let angle = 2 * Math.PI / numSides;

  for (let i = 0; i < numSides; i++)
  {
    vertices.push([radius * Math.cos(i * angle), radius * Math.sin(i * angle)]);
  }
  console.log(vertices);
  return vertices;
}

function isValidPolygon ( vertices )
{
  return Array.isArray( vertices ) &&
  vertices.every(e => { return isValidCoordPair(e) });
}

// unfriendly towards non 2d coords
function isValidCoordPair ( coords )
{
  return Array.isArray(coords) &&
  coords.length === 2 &&
  coords.every(e => {return typeof e === 'number'});
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
      updateObjects( (end - start) / 1000, PhysicsSim.objects);
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


function updateObjects ( timePassed, objects )
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
  // checkCollisions( objects );
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