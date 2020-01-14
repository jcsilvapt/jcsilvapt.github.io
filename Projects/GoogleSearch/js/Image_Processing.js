class Picture {

    constructor(px, py, w, h, impath, cat) {
        this.posx = px;
        this.posy = py;
        this.w = w;
        this.h = h;
        this.impath = impath;
        this.imgobj = new Image();
        this.imgobj.src = this.impath;
        this.original_w = this.imgobj.width;
        this.original_h = this.imgobj.height;
        this.category = cat;
        this.hist = [];
        this.color_moments = [];
        this.manhattanDist = [];
    }

    draw(cnv) {
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

    //method to apply the algorithms to the image.
    //Because the image have to loaded from the server, the same strategy used in the method draw()
    //is used here to access the image pixels. We do not exactly when the image in loaded and computed.
    //For this reason the event "processed_picture" was created to alert the application (ISearchEngine)
    computation(cnv, histcol, colorMom, eventP) {
        let ctx = cnv.getContext("2d");

        if (this.imgobj.complete) {
            console.log("Debug: N Time");
            ctx.drawImage(this.imgobj, 0, 0, this.imgobj.width, this.imgobj.height);
            let pixels =  ctx.getImageData(0, 0, this.imgobj.width, this.imgobj.height);
            //let pixels = Generate_Image(cnv);
            this.hist = histcol.count_Pixels(pixels);
            //this.build_Color_Rect(cnv, this.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
            this.color_moments = colorMom.moments(this.imgobj, cnv);
            document.dispatchEvent(eventP);

        } else {
            console.log("Debug: First Time");
            let self = this;
            this.imgobj.addEventListener('load', function () {
                ctx.drawImage(self.imgobj, 0, 0, self.imgobj.width, self.imgobj.height);
                let pixels =  ctx.getImageData(0, 0, self.imgobj.width, self.imgobj.height);
                console.log(pixels);
                //let pixels = Generate_Image(cnv);
                self.hist = histcol.count_Pixels(pixels);
                //self.build_Color_Rect(cnv, self.hist, histcol.redColor, histcol.greenColor, histcol.blueColor);
                self.color_moments = colorMom.moments(self.imgobj, cnv);
                document.dispatchEvent(eventP);
            }, false);
        }

        // this method should be completed by the students

    }

    //method used for debug. It shows the color and the correspondent number of pixels obtained by
    //the colorHistogram algorithm
    build_Color_Rect (cnv, hist, redColor, greenColor, blueColor) {
        let ctx = canvas.getContext("2d");
        let text_y = 390;
        let rect_y = 400;
        let hor_space = 80;

        ctx.font = "12px Arial";
        for (let c = 0; c < redColor.length; c++) {
            ctx.fillStyle = "rgb(" + redColor[c] + "," + greenColor[c] + "," + blueColor[c] + ")";
            ctx.fillRect(c * hor_space, rect_y, 50, 50);
            if (c === 8) {
                ctx.fillStyle = "black";
            }
            ctx.fillText(hist[c], c * hor_space, text_y);
        }
    }

    setPosition (px, py) {
        this.posx = px;
        this.posy = py;
    }

    mouseOver(mx, my) {
        if ((mx >= this.posx) && (mx <= (this.posx + this.w)) && (my >= this.posy) && (my <= (this.posy + this.h))) {
            return true;
        }
        return false;
    }

}


//Class to compute the Color Histogram algorithm. It receives the colors and computes the histogram
//through the method count_Pixels()
class ColorHistogram {
    constructor(redColor, greenColor, blueColor) {
        this.redColor = redColor;
        this.greenColor = greenColor;
        this.blueColor = blueColor;
        this.numOfColors = 12;
        this.limiar1 = 72;
        this.limiar2 = 165;

    }

    count_Pixels (pixels) {
        let pRed, pGreen, pBlue = null;
        let deltaRed, deltaGreen, deltaBlue = null;
        let manhattanDist = null;
        let histogramIndex = null;
        let lessDeltaTotal = 766;
        let histogram = Array(this.numOfColors).fill(0);

        // precorrer os pixeis da imagem
        for(let i = 0; i < pixels.data.length; i+=4) {
            pRed    = pixels.data[i];
            pGreen  = pixels.data[i + 1];
            pBlue   = pixels.data[i + 2];
            histogramIndex = null;
            lessDeltaTotal = 766;
            for(let z = 0; z < this.numOfColors; ++z) {
                deltaRed    = Math.abs(pRed - this.redColor[z]);
                deltaGreen  = Math.abs(pGreen - this.greenColor[z]);
                deltaBlue   = Math.abs(pBlue - this.blueColor[z]);
                manhattanDist  = deltaRed + deltaGreen + deltaBlue;
                if((deltaRed < this.limiar1) && (deltaGreen < this.limiar1) && (deltaBlue < this.limiar1) && (manhattanDist < this.limiar2) && (manhattanDist < lessDeltaTotal)) {
                    histogramIndex = z;
                    lessDeltaTotal = manhattanDist;
                }
            }
            if(histogramIndex != null) {
                histogram[histogramIndex] += 1;
            }

        }
        return histogram;
    }
}


//Class to compute the Color Moments algorithm. It computes the statistics moments
//through the method moments(). The moments are computed in the HSV color space. The method rgdToHsv is used
//to translate the pixel into the HSV color space
class ColorMoments {
    constructor() {
        this.h_block = 3;
        this.v_block = 3;
    }

    rgbToHsv (rc, gc, bc) {
        let r = rc / 255;
        let g = gc / 255;
        let b = bc / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = null, s = null, v = max;

        let dif = max - min;
        s = max == 0 ? 0 : dif / max;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / dif + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / dif + 2;
                    break;
                case b:
                    h = (r - g) / dif + 4;
                    break;
            }
            h /= 6;
        }
        return [h, s, v];
    }

    moments (imgobj, cnv) {
        let wBlock = Math.floor(imgobj.width / this.h_block);
        let hBlock = Math.floor(imgobj.height / this.v_block);
        let n = wBlock * hBlock;
        let descriptor = [];
        let ctx = cnv.getContext("2d");
        let imgByBlocksRGB = [];
        let imgByBlocksHSV = [];

        ctx.drawImage(imgobj, 0, 0);

        for (let y = 0; y < this.h_block; ++y) {
            for (let x = 0; x < this.v_block; ++x) {
                imgByBlocksRGB.push(ctx.getImageData(x*wBlock, y*hBlock, wBlock, hBlock));
            }
        }

        for (let i = 0; i < imgByBlocksRGB.length; ++i) {
            let blockHSV = [];
            for (let k = 0; k < imgByBlocksRGB[i].data.length; k+=4) {
                let red = imgByBlocksRGB[i].data[k];
                let green = imgByBlocksRGB[i].data[k + 1];
                let blue = imgByBlocksRGB[i].data[k + 2];
                let hsv = this.rgbToHsv(red, green, blue);
                let h = hsv[0];
                let s = hsv[1];
                let v = hsv[2];
                blockHSV.push(h, s, v);
            }
            imgByBlocksHSV.push(blockHSV);
        }


        for (let j = 0; j < imgByBlocksHSV.length; ++j) {
            let all_h = [];
            let all_s = [];
            let all_v = [];
            let h_mean = 0;
            let s_mean = 0;
            let v_mean = 0;
            let h_var = 0;
            let s_var = 0;
            let v_var = 0;

            for (let w = 0; w < imgByBlocksHSV[j].length; w+=3) {
                let h = imgByBlocksHSV[j][w];
                let s = imgByBlocksHSV[j][w + 1];
                let v = imgByBlocksHSV[j][w + 2];

                all_h.push(h);
                h_mean += h;
                all_s.push(s);
                s_mean += s;
                all_v.push(v);
                v_mean += v;
            }

            h_mean /= n;
            s_mean /= n;
            v_mean /= n;

            for (let h = 0; h < n; ++h) {
                h_var += Math.pow((all_h[h] - h_mean), 2);
                s_var += Math.pow((all_s[h] - s_mean), 2);
                v_var += Math.pow((all_v[h] - v_mean), 2);
            }

            h_var /= n;
            s_var /= n;
            v_var /= n;

            descriptor.push(h_mean, h_var, s_mean, s_var, v_mean, v_var);
        }
        return descriptor;
    }
}





