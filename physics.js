
/*
const PhysicsSim = {
    targetFPS: 60,
    objects : [],
    isRunning : true
}
*/

class PhysicsSim
{
  constructor ( canvas, targetFPS = 60, showFPS = true )
  {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.font = "5px Arial";
    this.targetFPS = targetFPS;
    this.objects = [];
    this.isRunning = true;
    this.lastFrames = [];
    this.frameCounter = 0;
    this.showFPS = showFPS;
    this.run();
    
  }
  
  // returns object created
  newBall({radius, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    return this.objects[this.objects.push(new Ball({radius, x, y, mass, vx, vy, ax, ay, elasticity, color})) - 1];
  }
  
  // returns object created
  newPolygon({vertices, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    return this.objects[this.objects.push(new Polygon({vertices, x, y, mass, vx, vy, ax, ay, elasticity, color})) - 1];
  }
  
  // returns object created
  newRect({width, height, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    return this.objects[this.objects.push(new Rect({width, height, x, y, mass, vx, vy, ax, ay, elasticity, color})) - 1];
  }
  
  // returns object created
  newRegularPolygon({numSides, radius, x, y, mass, vx, vy, ax, ay, elasticity, color})
  {
    return this.objects[this.objects.push(new RegularPolygon({numSides, radius, x, y, mass, vx, vy, ax, ay, elasticity, color})) - 1];
  }
  
  run()
  {
    // may not be nec while setTimeout on fixed interval..
    var start = performance.now();
    var end;
    setTimeout(() => {
      end = performance.now();
      if ( this.isRunning )
        this.updateObjects( (end - start) / 1000);
      start = end;
      this.run();
    }, 1000 / this.targetFPS );
  }
  
  updateObjects( timePassed )
  {
    //this.lastFrames[ this.frameCounter % 10 ] = 1 / timePassed;
    //if(this.frameCounter % 10 === 9)
    //  $('#fps-counter').html( findAvg( this.lastFrames ) );
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillText(`FPS: ${1 / timePassed}`, 0, 10);
    this.objects.forEach(object => {
        object.vy += object.ay * timePassed;
        object.y += object.vy * timePassed;
        object.vx +=object.ax * timePassed;
        object.x += object.vx * timePassed;
        object.draw( this.ctx );
    
    /*
    if(object.y + object.radius  >= canvas.height)
    {
        object.vy *= -object.elasticity;
        object.y = canvas.height - object.r;
    } */
    });
    
    console.log(this.objects);
    // checkCollisions( objects );
    
    // update canvas
    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //this.objects.forEach( object => {
    //  object.draw( this.ctx );
    //});
  }

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
  }
  
  draw( ctx )
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
  
  draw(ctx )
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
    this.setShape( this.numSides, radius );
  }
  
  setNumSides( numSides )
  {
    this.setShape( numSides, this.radius );
  }
  
  setShape( numSides, radius )
  {
    this.setVertices( regularPolygonVertices( numSides, radius ));
    this.radius = radius;
    this.numSides = numSides;
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
    this.width = width;
    this.height = height;
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

/*

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

*/
function findAvg(array) {
    var total = 0;
    var count = 0;

    jQuery.each(array, function(index, value) {
        total += value;
        count++;
    });

    return total / count;
}

/*


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
  

  });
  // checkCollisions( objects );
  updateCanvas( objects );
}
*/


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

/*
function updateCanvas( objects )
{
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  objects.forEach(object => {
    object.draw();
  });
  frameCounter++;
}
*/

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