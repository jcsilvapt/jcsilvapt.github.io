"use strict";

class ISearchEngine {
    constructor(dbase, loadStorage) {
        //Pool to include all the objects (mainly pictures) drawn in canvas
        this.allpictures = new Pool(3000);

        //Array of color to be used in image processing algorithms
        this.colors = ["red", "orange", "yellow", "green", "Blue-green", "blue", "purple", "pink", "white", "grey", "black", "brown"];

        // Red component of each color
        this.redColor = [204, 251, 255, 0, 3, 0, 118, 255, 255, 153, 0, 136];
        // Green component of each color
        this.greenColor = [0, 148, 255, 204, 192, 0, 44, 152, 255, 153, 0, 84];
        // Blue component of each color
        this.blueColor = [0, 11, 0, 0, 198, 255, 167, 191, 255, 153, 0, 24];

        //List of categories available in the image database
        this.categories = ["beach", "birthday", "face", "indoor", "manmade/artificial", "manmade/manmade", "manmade/urban", "marriage", "nature", "no_people", "outdoor", "party", "people", "snow"];

        //Name of the XML file with the information related to the images
        this.XML_file = dbase;

        // Instance of the XML_Database class to manage the information in the XML file
        this.XML_db = new XML_Database();

        // Instance of the LocalStorageXML class to manage the information in the LocalStorage
        this.LS_db = new LocalStorageXML();

        //Number of images per category for image processing
        this.num_Images = 100; // default 100
        //Number of images to show in canvas as a search result
        this.numshownpic = 36;

        //Width of image in canvas
        this.imgWidth = 190;
        //Height of image in canvas
        this.imgHeight = 140;

        //New variable to check if needs to load LocalStorage
        this.loadStorage = loadStorage;
    }

    //Method to initialize the canvas. First stage it is used to process all the images
    init(cnv) {
        if(this.loadStorage)
            this.databaseProcessing(cnv);
    }

    // method to build the database which is composed by all the pictures organized by the XML_Database file
    // At this initial stage, in order to evaluate the image algorithms, the method only compute one image.
    // However, after the initial stage the method must compute all the images in the XML file
    databaseProcessing(cnv) {
        //Images processing classes
        let h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
        let colmoments = new ColorMoments();

        for (let i = 0; i < this.categories.length; i++) {
            let imgPath = this.XML_db.SearchXML(this.categories[i], this.XML_db.loadXMLfile(this.XML_file), 300);

            for (let c = 0; c < imgPath.length; c++) {
                let image = new Picture(0, 0, this.imgWidth, this.imgHeight, imgPath[c], this.categories[i]);

                let eventName = "processed_picture_" + image.impath;
                let eventP = new Event(eventName);
                let self = this;
                document.addEventListener(eventName, function () {
                    self.imageProcessed(image, eventName);
                }, false);
                image.computation(cnv, h12color, colmoments, eventP);
                this.clearCanvas(cnv);
            }
        }
    }

    insertImage(canvas, img) {
        let h12color = new ColorHistogram(this.redColor, this.greenColor, this.blueColor);
        let colmoments = new ColorMoments();
        let imgObj = window.URL.createObjectURL(img);
        let image = new Picture(0, 0, this.imgWidth, this.imgHeight, imgObj, null);

        let eventName = "processed_picture_" + image.impath;
        let eventP = new Event(eventName);
        image.computation(canvas, h12color, colmoments, eventP);
        setTimeout(function () {
            //TODO: Comparar imagem actual com outras imagens ;D
        },2000);
    }


    clearCanvas(cnv) {
        let ctx = cnv.getContext("2d");
        console.log(cnv.width + " " + cnv.height);
        ctx.clearRect(0, 0, cnv.width, cnv.height);
    }

    //When the event "processed_picture_" is enabled this method is called to check if all the images are
    //already processed. When all the images are processed, a database organized in XML is saved in the localStorage
    //to answer the queries related to Color and Image Example
    imageProcessed(img, eventname) {
        this.allpictures.insert(img);
        console.log("image processed: " + this.allpictures.stuff.length + " " + eventname);
        if (this.allpictures.stuff.length === this.num_Images * this.categories.length) {
            console.log("I'm logasdasdasd");
            this.createXMLColordatabaseLS();
            //this.createXMLIExampledatabaseLS();
        }
    }


    //Method to create the XML database in the localStorage for color queries
    createXMLColordatabaseLS() {
        let imagesByCategory = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];
        let xmlRow = "";

        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let z = 0; z < this.categories.length; z++) {
                if (this.allpictures.stuff[i].category === this.categories[z]) {
                    imagesByCategory[z].push(this.allpictures.stuff[i]);
                }
            }
        }

        for(let i = 0; i < this.categories.length; i++) {
            xmlRow += "<images>";
            for(let c = 0; c < this.colors.length; c++) {
                this.sortbyColor(c, imagesByCategory[i]);
                for(let z = 0; z < 36; z++) {
                    xmlRow += "<image class='" + this.colors[c] + "'>";
                    xmlRow += "<path>" + imagesByCategory[i][z].impath + "</path>";
                    xmlRow += "</image>";
                }
            }
            xmlRow += "</images>";
            this.LS_db.saveLS_XML(this.categories[i], xmlRow);
        }
/*        for(let i = 0; i < imagesByCategory.length; i++) {
            xmlRow = "<images>";
            for(let c = 0; c < this.colors.length; c++) {
                this.sortbyColor(c, imagesByCategory[i]);
                for(let z = 0; z < this.numshownpic; z++) {
                    if(imagesByCategory[i][c].hist[z] >= limit) {
                        xmlRow += "<image class='" + this.colors[i] + "'>";
                        xmlRow += "<path>" + imagesByCategory[i][z].impath + "</path>";
                        xmlRow += "</image>";
                    }
                }
            }
            xmlRow += "</images>";
            this.LS_db.saveLS_XML(i, xmlRow);
        }*/
    }

    //Method to create the XML database in the localStorage for Image Example queries
    createXMLIExampledatabaseLS() {
        let list_images = new Pool(this.allpictures.stuff.length);
        this.zscoreNormalization();

        let imagesByCategory = [[], [], [], [], [], [], [], [], [], [], [], [], [], []];
        let xmlRow = "";

        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let z = 0; z < this.categories.length; z++) {
                if (this.allpictures.stuff[i].category === this.categories[z]) {
                    imagesByCategory[z].push(this.allpictures.stuff[i]);
                }
            }
        }

        for(let i = 0; i < imagesByCategory.length; i++) {
            for(let c = 0; c < imagesByCategory[i].length; c++) {
                for(let z = 0; z < imagesByCategory[i].length; z++) {
                    imagesByCategory[i][c].manhattanDist.push(this.calcManhattanDist(imagesByCategory[i][c], imagesByCategory[i][z]));
                }
            }
        }

        for(let i = 0; i < imagesByCategory.length; i++) {
            for(let c = 0; c < imagesByCategory[i].length; c++) {
                this.sortbyManhattanDist(c, imagesByCategory[i]);
                let path = imagesByCategory[i][0].impath;
                let list = imagesByCategory[i].slice(1, imagesByCategory[1].length);
                xmlRow = "<images>";
                for(let z = 0; z < 36; z++) {
                    xmlRow += "<image class='Manhattan'>";
                    xmlRow += "<path>" + list[z].impath + "</path>";
                    xmlRow += "</image>";
                }
                xmlRow += "</images>";
                localStorage.setItem(path, xmlRow);
            }
        }



    }

    //A good normalization of the data is very important to look for similar images. This method applies the
    // zscore normalization to the data
    zscoreNormalization() {
        let overall_mean = [];
        let overall_std = [];

        // Inicialization
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean.push(0);
            overall_std.push(0);
        }

        // Mean computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_mean[j] += this.allpictures.stuff[i].color_moments[j];
            }
        }

        // Mean computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_mean[i] /= this.allpictures.stuff.length;
        }

        // STD computation I
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                overall_std[j] += Math.pow(this.allpictures.stuff[i].color_moments[j] - overall_mean[j], 2);
            }
        }

        // STD computation II
        for (let i = 0; i < this.allpictures.stuff[0].color_moments.length; i++) {
            overall_std[i] = Math.sqrt(overall_std[i] / this.allpictures.stuff.length);
        }

        // zscore normalization
        for (let i = 0; i < this.allpictures.stuff.length; i++) {
            for (let j = 0; j < this.allpictures.stuff[0].color_moments.length; j++) {
                this.allpictures.stuff[i].color_moments[j] = (this.allpictures.stuff[i].color_moments[j] - overall_mean[j]) / overall_std[j];
            }
        }
    }

    //Method to search images based on a selected color
    searchColor(category, color) {
        let idxValue = -1;
        for(let i = 0; i < this.categories.length; i++) {
            if(this.categories[i] === category) {
                idxValue = i;
                break;
            }
        }
        let results = this.LS_db.readLS_XML(idxValue);
        let val = results.documentElement.querySelectorAll("img."+color);
        if(val.length > 0) {
            return val;
        }else {
            return this.searchKeywords(category);
        }
    }

    //Method to search images based on keywords
    searchKeywords(category) {
        return this.XML_db.SearchXML(category, this.XML_db.loadXMLfile(this.XML_file), this.num_Images)
    }

    //Method to search images based on Image similarities
    searchISimilarity(IExample, dist) {
        // this method should be completed by the students
    }

    //Method to compute the Manhattan difference between 2 images which is one way of measure the similarity
    //between images.
    calcManhattanDist(img1, img2) {
        let manhattan = 0;

        for (let i = 0; i < img1.color_moments.length; i++) {
            manhattan += Math.abs(img1.color_moments[i] - img2.color_moments[i]);
        }
        manhattan /= img1.color_moments.length;
        return manhattan;
    }

    //Method to sort images according to the Manhattan distance measure
    sortbyManhattanDist(idxdist, list) {
        list.sort(function (a, b) {
            return a.manhattanDist[idxdist] - b.manhattanDist[idxdist];
        });
    }

    //Method to sort images according to the number of pixels of a selected color
    sortbyColor(idxColor, list) {
        list.sort(function (a, b) {
            return b.hist[idxColor] - a.hist[idxColor];
        });
    }

    //Method to visualize images in canvas organized in columns and rows
    gridView(canvas) {
        // this method should be completed by the students
    }

    // Mêtodos extras
    /**
     * Receber uma cor e converte o valor em código hexadecimal
     * @param {string} color
     */
    convertToHEX(color) {
        var index = -1;
        //Checks array positions
        for (var i = 0; i < this.colors.length; i++) {
            if (color === this.colors[i]) {
                index = i;
                break;
            }
        }

        if (index !== -1) return this.RGBToHEX(this.redColor[index], this.greenColor[index], this.blueColor[index]);
    }

    /**
     * Receber uma cor e converte o valor em código RGB
     * @param {string} color
     */
    convertToRGB(color) {
        var index = -1;
        //Checks array positions
        for (var i = 0; i < this.colors.length; i++) {
            if (color === this.colors[i]) {
                index = i;
                break;
            }
        }
        if (index !== -1) return [this.redColor[index], this.greenColor[index], this.blueColor[index]];
    }
}

class Pool {
    constructor(maxSize) {
        this.size = maxSize;
        this.stuff = [];
    }

    insert(obj) {
        if (this.stuff.length < this.size) {
            this.stuff.push(obj);
        } else {
            alert("The application is full: there isn't more memory space to include objects");
        }
    }

    remove() {
        if (this.stuff.length !== 0) {
            this.stuff.pop();
        } else {
            alert("There aren't objects in the application to delete");
        }
    }

    empty_Pool() {
        while (this.stuff.length > 0) {
            this.remove();
        }
    }
}
