
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
    this.showFPS = showFPS;
    this.isStatic = false;
    this.timeBetweenStaticUpdate = 0.01;
    
    this.run();
    
  }
  
  // returns object created
  newBall({radius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    return this.objects[this.objects.push(new Ball({radius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})) - 1];
  }
  
  // returns object created
  newPolygon({vertices, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    return this.objects[this.objects.push(new Polygon({vertices, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})) - 1];
  }
  
  // returns object created
  newRect({width, height, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    return this.objects[this.objects.push(new Rect({width, height, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})) - 1];
  }
  
  // returns object created
  newRegularPolygon({numSides, circumradius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    return this.objects[this.objects.push(new RegularPolygon({numSides, circumradius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})) - 1];
  }
  
  run()
  {
    // myAcceleration not be nec while setTimeout on fixed interval..
    var start = performance.now();
    var end;
    setTimeout(() => {
      end = performance.now();
      if ( this.isRunning )
        this.updateObjects( (end - start) / 1000 );
      start = end;
      this.run();
    }, 1000 / this.targetFPS );
  }
  
  updateObjects( timePassed )
  {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(this.showFPS) this.ctx.fillText(`FPS: ${1 / timePassed}`, 0, 10);
    if(this.isStatic) timePassed = this.timeBetweenStaticUpdate;
    this.objects.forEach(object => {
        object.yVelocity += object.yAcceleration * timePassed;
        object.y += object.yVelocity * timePassed;
        object.xVelocity +=object.xAcceleration * timePassed;
        object.x += object.xVelocity * timePassed;
        object.angularVelocity += object.angularAcceleration * timePassed;
        object?.rotate ( object.angularVelocity * timePassed );
        object.draw( this.ctx );
    });
    this.checkCollisions();
  }
  
  checkCollisions()
  {
    for( let i = 0; i < this.objects.length; i++ )
    {
      for(let j = i + 1; j < this.objects.length; j++)
      {
        let obj1 = this.objects[i];
        let obj2 = this.objects[j];
        
        if(obj1.constructor.name === "Ball" && obj2.constructor.name === "Ball")
          detectCollisionCircle( obj1, obj2 );
      }
    }
  }

}


class PhysicalObject
{
    constructor(x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color)
    {
        this.x = x || 0;
        this.y = y || 0;
        this.mass = mass || 100;
        this.xVelocity = xVelocity || 0;
        this.yVelocity = yVelocity || 0;
        this.xAcceleration = xAcceleration || 0;
        this.yAcceleration = yAcceleration || 9.8;
        this.angularPosition = angularPosition || 0;
        this.angularVelocity = angularVelocity || 0;
        this.angularAcceleration = angularAcceleration || 0;
        this.elasticity = elasticity || 0.5;
        this.color = color || "#000000";
    }
  
  setX( x ) { return setNumValue( x, this.x ) }
  setY( y ) { return setNumValue( y, this.y ) }
  setMass( mass ) { return setNumValue( mass, this.mass ) }
  setXVelocity( xVelocity ) { return setNumValue( xVelocity, this.xVelocity ) }
  setYVelocity( yVelocity ) { return setNumValue( yVelocity, this.yVelocity ) }
  setxAcceleration( xAcceleration ) { return setNumValue( xAcceleration, this.xAcceleration ) }
  setyAcceleration( yAcceleration ) { return setNumValue( yAcceleration, this.yAcceleration ) }
  setAngularPosition( angularPosition ) { return setNumValue( angularPosition, this.angularPosition ) }
  setAngularVelocity( angularVelocity ) { return setNumValue( this.angularVelocity, this.angularVelocity ) }
  setAngularAcceleration( angularAcceleration ) { return setNumValue( angularAcceleration, this.angularAcceleration ) }
  setElasticity( elasticity ) { return setNumValue( elasticity, this.elasticity ) }
  setColor( color ) { this.color = color; return color; }
  
}

class Ball extends PhysicalObject
{
  constructor({radius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    super(x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color);
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
  constructor({vertices, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    super(x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color);
    this.vertices = vertices || [[-5.0, -5.0], [-5.0, 5.0], [5.0, 5.0], [5.0, -5.0]];
  }
  
  draw( ctx )
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
      throw new Error("Given vertices must be in arryAcceleration format [ [x, y], ... [x, y] ]");
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
  // default pos value places vertex at end of vertices arryAcceleration
  // returns vertex
  addVertex (vertex, pos)
  {
    if(!isValidCoordPair(vertex))
      throw new Error("Given vertex points must be in [x, y] format!");
    this.vertices.splice(pos || this.vertices.length, 0, vertex);
    return vertex;
  }
  
  // rotates in xy plane
  // returns amount rotated
  rotate ( theta )
  {
    for ( let e of this.vertices )
    {
      let rotationMatrix = [[Math.cos(theta), -Math.sin(theta)],
                            [Math.sin(theta),  Math.cos(theta)]];
      
      e[0] = rotationMatrix[0][0] * e[0] + rotationMatrix[0][1] * e[0];
      e[1] = rotationMatrix[1][0] * e[1] + rotationMatrix[1][1] * e[1];
    };
    this.angularPosition += theta;
  }
  
}


class RegularPolygon extends Polygon
{
  constructor({numSides = 6, circumradius = 10, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    super({vertices: regularPolygonVertices( numSides, circumradius ), x, y, mass,
    xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition,
    angularVelocity, angularAcceleration, elasticity, color});
    this.circumradius = circumradius;
    this.numSides = numSides;

  }
  
  setSize( circumradius )
  {
    this.setShape( this.numSides, circumradius );
  }
  
  setNumSides( numSides )
  {
    this.setShape( numSides, this.circumradius );
  }
  
  setShape( numSides, circumradius )
  {
    this.setVertices( regularPolygonVertices( numSides, circumradius ));
    this.circumradius = circumradius;
    this.numSides = numSides;
  }
  
}



class Rect extends Polygon
{
  constructor({width = 5, height = 5, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition, angularVelocity, angularAcceleration, elasticity, color})
  {
    super({vertices: [[-width / 2, -height / 2], [-width / 2, height / 2],
    [width / 2, height / 2], [width / 2, -height / 2]], x, y, mass,
    xVelocity, yVelocity, xAcceleration, yAcceleration, angularPosition,
    angularVelocity, angularAcceleration, elasticity, color});
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

function regularPolygonVertices ( numSides, circumradius )
{
  let vertices = [];
  let angle = 2 * Math.PI / numSides;

  for (let i = 0; i < numSides; i++)
  {
    vertices.push([circumradius * Math.cos(i * angle), circumradius * Math.sin(i * angle)]);
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

function detectCollisionConvexPolygon( ob1, obj2 )
{
  
}


function detectCollisionCircle(obj1, obj2)
{
  const distance = Math.sqrt(Math.pow(obj2.x - obj1.x, 2) + Math.pow(obj2.y - obj1.y, 2));
  if (distance <= obj1.radius + obj2.radius)
  {
    handleCollision( obj1, obj2 );
  }
  return false;
}

function handleCollision(obj1, obj2) 
{
  obj1.color = "#0000FF";
  obj2.color = "#0000FF";
}