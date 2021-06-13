const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const sp = [];

canvas.width = innerWidth;
canvas.height = innerHeight;

// Global Variables
let points = [];
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
};

// Event Listeners
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    points = [];
    initializePoints();
});
let convexHullPoints = [];

// Objects

function Point(x, y, radius, color, fixed) {
    this.x = x;
    this.y = y;
    this.dx = 4;
    this.dy = 4;
    this.l = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.radius = radius;
    this.ringRadius = 0;
    this.fixed = fixed;
    this.color = color;

    this.temp = function (a, b) {
        return b - a > 1;
    };
    this.vektormulti = function (x1, x2, y1, y2) {
        return x1 * y2 - x2 * y1;
    };

    this.is = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        const v1 = this.vektormulti(x4 - x3, y4 - y3, x1 - x3, y1 - y3);
        const v2 = this.vektormulti(x4 - x3, y4 - y3, x2 - x3, y2 - y3);
        const v3 = this.vektormulti(x2 - x1, y2 - y1, x3 - x1, y3 - y1);
        const v4 = this.vektormulti(x2 - x1, y2 - y1, x4 - x1, y4 - y1);
        return this.temp(v1 * v2, 0) && this.temp(v3 * v4, 0);
    };

    this.isCounterClockwise = function (P0, P1, P2) {
        // Logs for debugging purposes
        // console.log("P0: {x:" + Math.floor(P0.x) + " y:" + Math.floor(P0.y) + "}, P1: {x:" + Math.floor(P1.x) + " y:" + Math.floor(P1.y) + "}, P2: {x:" + Math.floor(P2.x) + " y:" + Math.floor(P2.y) + "}");
        // console.log(Math.floor( (P1.x - P0.x) * (P2.y - P0.y) - (P1.x + P0.x) * (P2.y - P0.y) ));

        return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y);
    };

    this.angle = function (x1, y1, x2, y2, x3, y3, x4, y4) {
        const dAx = x2 - x1;
        const dAy = y2 - y1;
        const dBx = x4 - x3;
        const dBy = y4 - y3;
        const angle = Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy);
        // if (angle < 0) {
        //     angle *= -1;
        // }
        const degree_angle = angle * (180 / Math.PI);
        return degree_angle;
    };
    this.update = function () {
        if (!this.fixed) {
            // Bounce off left and right of window
            const flag = [];
            let i = 0;
            const j = 0;
            while (i < convexHullPoints.length - 1) {
                const p1 = convexHullPoints[i];
                const p2 = convexHullPoints[i + 1];
                if (
                    this.is(
                        p1.x,
                        p1.y,
                        p2.x,
                        p2.y,
                        this.x + this.radius,
                        this.y + this.radius,
                        this.x + this.dx,
                        this.y + this.dy,
                    )
                ) {
                    const ang = this.angle(
                        p1.x,
                        p1.y,
                        p2.x,
                        p2.y,
                        this.x,
                        this.y,
                        this.x + this.dx,
                        this.y + this.dy,
                    );
                    console.log(ang);
                    // if (
                    //     this.isCounterClockwise(
                    //         convexHullPoints[i],
                    //         convexHullPoints[i + 1],
                    //         this,
                    //     ) < 10
                    // )
                    // if (Math.abs(ang) > 90) {
                    // this.dy = -this.dy;
                    // }
                    // if (ang === 90) {
                    //     this.dx = 0;
                    //     if (this.dy < 0) {
                    //         this.dy = this.l;
                    //     } else {
                    //         this.dy = -this.l;
                    //     }
                    // }
                    // if ((ang > 0 && ang < 90) || (ang < 0 && ang > -90)) {
                    //     this.dy *= -1;
                    // } else {
                    // }

                    this.dx = -this.dx;
                    this.dy = -this.dy;
                    break;
                }
                i += 1;
            }
            if (
                this.x + this.radius > canvas.width
                || this.x - this.radius < 0
            ) {
                this.dx = -this.dx;
            }

            // Bounce off top and bottom of window
            if (
                this.y + this.radius > canvas.height
                || this.y - this.radius < 0
            ) {
                this.dy = -this.dy;
            }
            this.x += this.dx;
            this.y += this.dy;
            if (sp.length > 70) {
                sp.shift();
            }
            sp.push([this.x, this.y]);
        }

        this.draw();
    };
}

Point.prototype.draw = function () {
    // Draw point
    console.log(sp);
    sp.forEach((obj, i) => {
        c.beginPath();
        c.arc(obj[0], obj[1], (this.radius / 70) * i, 0, Math.PI * 2, false);
        c.fillStyle = 'rgb(212, 10, 43)';
        if (i === 70) {
            c.fillStyle = 'rgba(244, 32, 43, 255)';
        }
        c.fill();
        c.closePath();
    });

    // c.save();
    // c.beginPath();
    // c.moveTo(this.x + this.dx * 10, this.y + this.dy * 10);
    // c.lineTo(this.x, this.y);
    // c.strokeStyle = 'red';
    // c.lineWidth = 3;
    // c.stroke();
    // c.closePath();
    // c.restore();

    // c.save();
    // c.beginPath();
    // c.moveTo(this.x - this.dx * 10, this.y + this.dy * 10);
    // c.lineTo(this.x, this.y);
    // c.strokeStyle = 'blue';
    // c.lineWidth = 3;
    // c.stroke();
    // c.closePath();
    // c.restore();

    // c.save();
    // c.beginPath();
    // c.moveTo(this.x - this.dx * 10, this.y - this.dy * 10);
    // c.lineTo(this.x, this.y);
    // c.strokeStyle = 'green';
    // c.lineWidth = 3;
    // c.stroke();
    // c.closePath();
    // c.restore();

    // c.save();
    // c.beginPath();
    // c.moveTo(this.x + this.dx * 10, this.y - this.dy * 10);
    // c.lineTo(this.x, this.y);
    // c.strokeStyle = 'white';
    // c.lineWidth = 3;
    // c.stroke();
    // c.closePath();
    // c.restore();

    // // Draw ring around point
    // c.beginPath();
    // c.arc(this.x, this.y, Math.abs(this.ringRadius), 0, Math.PI * 2, false);
    // c.strokeStyle = 'white';
    // c.stroke();
    // c.closePath();
};

// Functions

/**
 * This function will determine whether or not three points create a counterclockwise or clockwise turn.
 *
 * Possible results:
 * If return value is > 0, P0 -> P1 -> P2 is counterclockwise
 * If return value is < 0, P0 -> P1 -> P2 is clockwise
 * If return value is = 0, P0 -> P1 -> P2 is collinear
 *
 * @param  Point P0 A point with an x and y coordinate property.
 * @param  Point P1 A point with an x and y coordinate property.
 * @param  Point P2 A point with an x and y coordinate property.
 *
 * @return Int Determinant
 */

function isCounterClockwise(P0, P1, P2) {
    // Logs for debugging purposes
    // console.log("P0: {x:" + Math.floor(P0.x) + " y:" + Math.floor(P0.y) + "}, P1: {x:" + Math.floor(P1.x) + " y:" + Math.floor(P1.y) + "}, P2: {x:" + Math.floor(P2.x) + " y:" + Math.floor(P2.y) + "}");
    // console.log(Math.floor( (P1.x - P0.x) * (P2.y - P0.y) - (P1.x + P0.x) * (P2.y - P0.y) ));

    return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x - P0.x) * (P1.y - P0.y);
}

// Implementation
function initializePoints() {
    const radius = 16;
    // points.push(
    //     new Point(
    //         Math.random() * (canvas.width - radius * 2) + radius,
    //         Math.random() * (canvas.height - radius * 2) + radius,
    //         radius,
    //         '#6ea3f1',
    //         false,
    //     ),
    // );
    // points.push(
    //     new Point(
    //         0.2 * (canvas.width - radius * 2) + radius,
    //         0.2 * (canvas.height - radius * 2) + radius,
    //         radius,
    //         '#6ea3f1',
    //         true,
    //     ),
    // );
    // points.push(
    //     new Point(
    //         0.9 * (canvas.width - radius * 2) + radius,
    //         0.4 * (canvas.height - radius * 2) + radius,
    //         radius,
    //         '#6ea3f1',
    //         true,
    //     ),
    // );
    for (let i = 0; i < 10; i++) {
        points.push(
            new Point(
                Math.random() * (canvas.width - radius * 2) + radius,
                Math.random() * (canvas.height - radius * 2) + radius,
                radius,
                '#6ea3f1',
                i < 9,
            ),
        );
    }
    return points.filter((obj) => obj.fixed);
}

function animate() {
    // Remove or comment this to stop the animation and inspect points without movement
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    // c.globalAlpha = 0.5;
    // c.globalCompositeOperation = 'source-in';
    // c.fillStyle = 'rgba(0,0,0,0.09)';
    // c.fillRect(0, 0, canvas.width, canvas.height);
    // Sort points by greatest y value to least y value
    points.sort((a, b) => b.y - a.y);

    // Remove first value from sorted array so we get the
    // highest y coordinate as our start point
    const startPoint = points.shift();

    // Sort the rest of the coordinates in order of smallest
    // to largest angle relative to the start point
    points.sort((a, b) => {
        const tanA = Math.atan2(a.y - startPoint.y, a.x - startPoint.x);
        const tanB = Math.atan2(b.y - startPoint.y, b.x - startPoint.x);
        return tanB - tanA;
    });

    // Add original start point back to its position in front of array
    points.unshift(startPoint);

    // Create an array to store any points that exist on the convex hull
    // let convexHullPoints = [];

    // First two of the sorted points will always be on the convex hull
    // const convexHullPoints =  points.filter(obj => obj.fixed)
    // convexHullPoints.push(points[0]);
    // convexHullPoints.push(points[1]);

    // Loop through the rest of the points to see if they exist on the convex hull
    // 	for (let i = 2; i < points.length; i++) {
    // 		while ( isCounterClockwise(convexHullPoints[convexHullPoints.length - 2], convexHullPoints[convexHullPoints.length - 1], points[i]) > 0) {
    // 	      convexHullPoints.pop();
    // 	    }

    // 	    convexHullPoints.push(points[i]);
    // 	}

    // 	convexHullPoints.push(points[0]);

    // Now that we have a filtered set of points on the convex
    // hull, we can draw lines that connect them

    for (let i = 0; i < convexHullPoints.length - 1; i++) {
        // Slowly increase ring radius for smooth transition
        // const desiredRingRadius = convexHullPoints[i].radius + 5;
        // convexHullPoints[i].ringRadius
        //     += (desiredRingRadius - convexHullPoints[i].ringRadius) * 0.15;

        // if (i + 1 >= convexHullPoints.length) continue;

        c.save();
        c.beginPath();
        c.moveTo(convexHullPoints[i].x, convexHullPoints[i].y);
        c.lineTo(convexHullPoints[i + 1].x, convexHullPoints[i + 1].y);
        c.strokeStyle = '#6ea3f1';
        c.lineWidth = 3;
        c.stroke();
        c.closePath();
        c.restore();

        // c.beginPath();
        // c.arc(
        //     convexHullPoints[i].x,
        //     convexHullPoints[i].y,
        //     100,
        //     0,
        //     Math.PI * 2,
        //     false,
        // );
        // c.strokeStyle = 'white';
        // c.stroke();
        // c.closePath();

        convexHullPoints[i].color = 'white';
    }

    // Animate and create all points
    for (let i = 0; i < points.length; i++) {
        points[i].update();

        // If point is not in the convex hull array, change color and decrease ring size
        if (!convexHullPoints.includes(points[i])) {
            points[i].color = '#6ea3f1';

            if (points[i].ringRadius > 0) {
                points[i].ringRadius -= 0.25;
            }
        }

        if (i + 1 >= points.length) continue;

        // This creates the lines from point 0 to point n in order of their angle relative
        // to the starting point. Good for visualizing how the points are sorted

        // c.fillText(i, points[i].x + 10, points[i].y);
        // c.beginPath();
        // c.moveTo(points[i].x, points[i].y);
        // c.lineTo(points[i + 1].x, points[i + 1].y);
        // c.strokeStyle = "white";
        // c.stroke();
        // c.closePath();
    }
}

convexHullPoints = initializePoints();
animate();
