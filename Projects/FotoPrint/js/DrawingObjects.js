class DrawingObjects
{
    constructor (px, py, name) {
        if (this.constructor === DrawingObjects) {
            // Error Type 1. Abstract class can not be constructed.
            throw new TypeError("Can not construct abstract class.");
        }

        //else (called from child)
        // Check if all instance methods are implemented.
        if (this.draw === DrawingObjects.prototype.draw) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method draw.");
        }

        if (this.mouseOver === DrawingObjects.prototype.mouseOver) {
            // Error Type 4. Child has not implemented this abstract method.
            throw new TypeError("Please implement abstract method mouseOver.");
        }

        this.posx = px;
        this.posy = py;
        this.name = name;
    }

    draw (cnv) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method draw from child.");
    }

    mouseOver(mx, my) {
        // Error Type 6. The child has implemented this method but also called `super.foo()`.
        throw new TypeError("Do not call abstract method mouseOver from child.");
    }


    sqDist(px1, py1, px2, py2) {
        let xd = px1 - px2;
        let yd = py1 - py2;

        return ((xd * xd) + (yd * yd));
    }
}

class insertText extends DrawingObjects {
    constructor (px, py, pixeis, color, textValue) {
        super(px, py, "T");
        this.textSize = pixeis;
        this.color = color;
        this.textValue = textValue;
        this.size = null;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");
        ctx.font = this.textSize+'px Calibri';
        this.size = ctx.measureText(this.textValue);
        ctx.fillStyle = this.color;
        ctx.font = this.textSize+'px Calibri';
        ctx.fillText(this.textValue, this.posx, this.posy);

        ctx.fill();
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.size.width)) && (my <= this.posy) && (my >= (this.posy - this.textSize)));
    }
}

class Rect extends DrawingObjects
{

    constructor (px, py, w, h, c) {
        super(px, py, 'R');
        this.w = w;
        this.h = h;
        this.color = c;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.w, this.h);

    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));

    }
}

class Picture extends DrawingObjects
{

    constructor (px, py, w, h, impath) {
        super(px, py, 'P');
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            ctx.drawImage(this.imgobj, this.posx, this.posy, this.w, this.h);
            console.log("Debug: N Time");

        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, self.posx, self.posy, self.w, self.h);
            }, false);
        }
    }

    mouseOver(mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h)));
    }
}

class Oval extends DrawingObjects
{
    constructor (px, py, r, hs, vs, c) {
        super(px, py, 'O');
        this.r = r;
        this.radsq = r * r;
        this.hor = hs;
        this.ver = vs;
        this.color = c;
    }

    mouseOver (mx, my) {
        let x1 = 0;
        let y1 = 0;
        let x2 = (mx - this.posx) / this.hor;
        let y2 = (my - this.posy) / this.ver;

        return (this.sqDist(x1,y1,x2,y2) <= (this.radsq));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.save();
        ctx.translate(this.posx,this.posy);
        ctx.scale(this.hor,this.ver);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, 0, this.r, 0, 2*Math.PI, true);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}


class Heart extends DrawingObjects
{
    constructor (px, py, w, c) {
        super(px, py, 'H');
        this.h = w * 0.7;
        this.drx = w / 4;
        this.radsq = this.drx * this.drx;
        this.ang = .25 * Math.PI;
        this.color = c;
    }

    outside (x, y, w, h, mx, my) {
        return ((mx < x) || (mx > (x + w)) || (my < y) || (my > (y + h)));
    }

    draw (cnv) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let cx = rightctrx + this.drx * Math.cos(this.ang);
        let cy = this.posy + this.drx * Math.sin(this.ang);
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.posx, this.posy);
        ctx.arc(leftctrx, this.posy, this.drx, 0, Math.PI - this.ang, true);
        ctx.lineTo(this.posx, this.posy + this.h);
        ctx.lineTo(cx,cy);
        ctx.arc(rightctrx, this.posy, this.drx, this.ang, Math.PI, true);
        ctx.closePath();
        ctx.fill();
    }

    mouseOver (mx, my) {
        let leftctrx = this.posx - this.drx;
        let rightctrx = this.posx + this.drx;
        let qx = this.posx - 2 * this.drx;
        let qy = this.posy - this.drx;
        let qwidth = 4 * this.drx;
        let qheight = this.drx + this.h;

        let x2 = this.posx;
        let y2 = this.posy + this.h;
        let m = (this.h) / (2 * this.drx);

        //quick test if it is in bounding rectangle
        if (this.outside(qx, qy, qwidth, qheight, mx, my)) {
            return false;
        }

        //compare to two centers
        if (this.sqDist (mx, my, leftctrx, this.posy) < this.radsq) return true;
        if (this.sqDist(mx, my, rightctrx, this.posy) < this.radsq) return true;

        // if outside of circles AND less than equal to y, return false
        if (my <= this.posy) return false;

        // compare to each slope
        // left side
        if (mx <= this.posx) {
            return (my < (m * (mx - x2) + y2));
        } else {  //right side
            m = -m;
            return (my < (m * (mx - x2) + y2));
        }
    }
}

class Bear extends DrawingObjects
{
    constructor (px, py, width, height, color) {
        super(px, py, 'B');
        this.width = width;
        this.height = height;
        this.color = color;
    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.width)) && (my >= this.posy) && (my <= (this.posy + this.height)));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.fillRect(this.posx, this.posy, this.width, this.height);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width*0.25),this.posy+(this.height*0.3), this.width/8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.posx+(this.width*0.75),this.posy+(this.height*0.3), this.width/8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+(this.width*0.75),this.posy+(this.height*0.3), this.width/15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+(this.width*0.25),this.posy+(this.height*0.3), this.width/15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width/2), this.posy+(this.height/2)+10, this.width/3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posx+(this.width*0.35), this.posy+(this.height*0.5), this.width/15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width*0.37), this.posy+(this.height*0.53), this.width/50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posx+(this.width*0.65), this.posy+(this.height*0.5), this.width/15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width*0.63), this.posy+(this.height*0.53), this.width/50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.restore();
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.translate(this.posx+(this.width/2),this.posy+(this.height/1.6));
        ctx.scale(2,1);
        ctx.arc(0,0,this.width/15,0,2*Math.PI, true);
        ctx.fill();
        ctx.scale(1,2);
        ctx.closePath();
        ctx.restore();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width*0.4),this.posy+(this.height/2)+20, this.width/50, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+(this.width*0.42),this.posy+(this.height*0.68),this.width/12,0,Math.PI);
        ctx.stroke();
        ctx.closePath();


        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+(this.width*0.58),this.posy+(this.height*0.68),this.width/12,0,Math.PI);
        ctx.stroke();
        ctx.closePath();



        /*ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.posx, this.posy, this.width, this.height);
        ctx.fill();
        ctx.closePath();
        
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+50,this.posy+60, ((this.width)/3.5)/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.posx+150,this.posy+60, ((this.width)/3.5)/2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+50,this.posy+60, 15, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.posx+150,this.posy+60, 15,0 , 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width/2),this.posy+(this.width/2),(this.width)/3.5,0,2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+85, this.posy+85, 12, 0 , 2* Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.posx+120, this.posy+85, 12, 0 , 2* Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+88, this.posy+90, 5, 0 , 2* Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save();
        ctx.beginPath();
        ctx.arc(this.posx+116, this.posy+90, 5, 0 , 2* Math.PI);
        ctx.fill();
        ctx.closePath();


        ctx.beginPath();
        ctx.arc(this.posx+116, this.posy+115, 5,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.save()
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.translate(this.posx+102,this.posy+110);
        ctx.scale(2,1);
        ctx.arc(0,0,13,0,2*Math.PI, true);
        ctx.fill();
        ctx.scale(1,2);
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(-6,-3, 2,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(-9,2,10,0,Math.PI);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(9,2,10,0,Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();*/
    }
}

class Ghost extends DrawingObjects
{
    constructor (px, py, width, height, color) {
        super(px,py, "G");
        this.width = width;
        this.height = height;
        this.color = color;

    }

    mouseOver (mx, my) {
        return ((mx >= this.posx) && (mx <= (this.posx + this.width)) && (my >= this.posy) && (my <= (this.posy + this.height)));
    }

    draw (cnv) {
        let ctx = cnv.getContext("2d");

        ctx.width = this.width;
        ctx.height = this.height;

        ctx.fillStyle = this.color;
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(this.posx+(this.height*0.2), this.posy);
        ctx.bezierCurveTo(this.posx+(this.height*0.2),this.posy-(this.height*0.2), this.posx+this.width,this.posy-(this.height*0.2), this.posx+this.width, this.posy);
        ctx.moveTo(this.posx+(this.height*0.2),this.posy);
        ctx.lineTo((this.posx+(this.height*0.2)),this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+(this.width*0.8),this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+(this.width*0.8),this.posy);
        ctx.moveTo((this.posx+(this.height*0.2)), this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2)),(this.posy+(this.height*0.55)));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.1,this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.2,this.posy+(this.height*0.55));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.3,this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.4,this.posy+(this.height*0.55));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.5,this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.6,this.posy+(this.height*0.55));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.7,this.posy+(this.height*0.4));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.8,this.posy+(this.height*0.55));
        ctx.lineTo((this.posx+(this.height*0.2))+this.width*0.8,this.posy+(this.height*0.4));
        ctx.fill();
        ctx.closePath();

        /* Olhos - Inicio*/
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.posx+(this.width*0.42), this.posy+(this.height*0.12), this.width/12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.posx+(this.width*0.78), this.posy+(this.height*0.12), this.width/12, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.posx+(this.width*0.38), this.posy+(this.height*0.15), this.width/30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.posx+(this.width*0.74), this.posy+(this.height*0.15), this.width/30, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}


