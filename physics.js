const physicsSim = {
    maxFps: 60,
    objects : []
}


class PhysicalObject
{
    constructor(x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, elasticity, color)
    {
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
        this.xAcceleration = xAcceleration;
        this.yAcceleration = yAcceleration;
        this.elasticity = elasticity;
        this.color = color;
    }
  
  setX( x ) { this.x = x; return x; }
  setY( y ) { this.y = y; return y; }
  setMass( mass ) { this.mass = mass; return mass; }
  setXVelocity( xVelocity ) { this.xVelocity = xVelocity; return xVelocity; }
  setYVelocity( yVelocity ) { this.yVelocity = yVelocity; return yVelocity; }
  setXAcceleration( xAcceleration ) { this.xAcceleration = xAcceleration; return xAcceleration; }
  setYAcceleration( yAcceleration ) { this.yAcceleration = yAcceleration; return yAcceleration; }
  setElasticity( elasticity ) { this.elasticity = elasticity; return elasticity; }
  setColor( color ) { this.color = color; return color; }
  
}
    
class Ball extends PhysicalObject
{
  /*
  constructor({radius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, elasticity, color})
  {
    constructor(radius, x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, elasticity, color);
  }
  */
  constructor({radius = 5, x = 0, y = 0, mass = 100, xVelocity = 0, yVelocity = 0, xAcceleration = 0, yAcceleration = 9.8, elasticity = 0.5, color = "#000000"})
  {
    super(x, y, mass, xVelocity, yVelocity, xAcceleration, yAcceleration, elasticity, color);
    this.radius = radius;
    physicsSim.objects.push(this);
  }
  
  draw()
  {
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  setRadius( radius ) { this.radius = radius; return radius; }
  
}

$( document ).ready(function()
{
    // may not be nec while setTimeout on fixed interval..
    var start = performance.now();
    var end;
    
    setInterval(() => {
        end = performance.now();
        updateBall( (end - start) / 1000, physicsSim.objects);
        start = end;
    }, 1000 / physicsSim.maxFps );

});


function updateBall ( timePassed, objects )
        {
            objects.forEach(object => {
                object.yVelocity += object.yAcceleration * timePassed;
                object.y += object.yVelocity * timePassed;
                object.xVelocity +=object.xAcceleration * timePassed;
                object.x += object.xVelocity * timePassed;
            if(object.y + object.radius >= canvas.height)
            {
                object.yVelocity *= -object.elasticity;
                object.y = canvas.height - object.radius;
            }
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