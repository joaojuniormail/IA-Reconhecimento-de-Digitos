var NeuralNetwork = function () {
        var self = this,
            representationColumns = 5,
            representationRows = 8,
            representationView = null,
            charData = {},
            drawView = null,
            representationData = null,
            drawElement = null,
            representationElement = null,
            resultElement = null;

        self.init = function () {
            drawElement = $('#draw-digit');
            representationElement = $('#neural-representation');
            resultElement = $('#result');
            drawView = ENCOG.GUI.Drawing.create('draw-digit', Math.ceil(drawElement.width()),
            Math.ceil(drawElement.width()));
            representationView = ENCOG.GUI.CellGrid.create('neural-representation', representationColumns,
            representationRows, Math.floor(representationElement.width()), Math.floor((representationElement.width() * 1.1)));
            representationView.outline = true;
            representationView.mouseDown = function (x, y) {};
            representationView.determineColor = function (row, col) {
                var index = (row * this.gridWidth) + col;
                if (representationData[index] < 0) {
                    return "white";
                } else {
                    return "black";
                }
            };

            window.addEventListener('resize', function () {
                clearTimeout();
                setTimeout(function () {
                    drawView.canvas.width = Math.ceil(drawElement.width());
                    drawView.canvas.height = Math.ceil(drawElement.width());
                }, 300);
            }, false);

            document.getElementById('clean').addEventListener('click', self.cleanView, false);
            document.getElementById('check').addEventListener('click', self.checkDigit, false);

            representationData = drawView.performDownSample();
            self.showRepresentationCurrent(representationData);
            learning();
        };

        self.cleanView = function (ev) {
            drawView.clear();
            self.clearRepresentation();
            resultElement.html("&nbsp;");
        };

        self.showRepresentationCurrent = function () {
            representationView.render();
        };

        self.createDigit = function (charEntered, data) {
            charData[charEntered] = data;
        };

        self.clearRepresentation = function () {
            representationData = ENCOG.ArrayUtil.allocate1D(representationColumns * representationRows);
            ENCOG.ArrayUtil.fillArray(representationData, 0, representationData.length, -1);
            self.showRepresentationCurrent();
        };

        self.checkDigit = function (ev) {
            representationData = drawView.performDownSample();
            self.showRepresentationCurrent();
            var bestChar = '??';
            var bestScore = 0;
            for (var c in charData) {
                var data = charData[c];
                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    var delta = data[i] - representationData[i];
                    sum = sum + (delta * delta);
                }
                sum = Math.sqrt(sum);
                if (sum < bestScore || bestChar == '??') {
                    bestScore = sum;
                    bestChar = c;
                }

            }
            resultElement.text(bestChar);
        };

        var learning = function () {
            self.createDigit("0", new Array(
                -1,  1,  1,  1, -1,
                 1,  1, -1,  1,  1,
                 1, -1, -1, -1,  1,
                 1, -1, -1, -1,  1,
                 1, -1, -1, -1,  1,
                 1, -1, -1, -1,  1,
                 1,  1, -1, -1,  1, 
                -1,  1,  1,  1, -1));
            self.createDigit("1", new Array(
                -1, -1,  1,  1, -1,
                -1,  1,  1,  1, -1,
                 1,  1,  1,  1, -1,
                 1, -1,  1,  1, -1,
                -1, -1,  1,  1, -1,
                -1, -1,  1,  1, -1,
                -1, -1,  1,  1, -1,
                 1,  1,  1,  1,  1));
            self.createDigit("2", new Array(
                 1,  1,  1, -1, -1,
                -1, -1,  1,  1, -1,
                -1, -1, -1,  1, -1,
                -1, -1, -1,  1, -1,
                -1, -1, -1,  1, -1,
                 1,  1,  1,  1, -1,
                 1, -1,  1,  1, -1,
                 1,  1,  1,  1,  1));
            self.createDigit("3", new Array(
                 1,  1,  1,  1, -1,
                -1, -1, -1,  1,  1,
                -1, -1, -1,  1,  1,
                -1, -1,  1,  1, -1,
                -1,  1,  1,  1,  1,
                -1, -1, -1, -1,  1,
                -1, -1, -1, -1,  1,
                 1,  1,  1,  1,  1));
            self.createDigit("4", new Array(
                 1,  1, -1, -1,  1,
                 1,  1, -1, -1,  1,
                 1, -1, -1, -1,  1,
                 1,  1,  1,  1,  1,
                -1, -1, -1,  1,  1,
                -1, -1, -1,  1,  1,
                -1, -1, -1,  1,  1,
                -1, -1, -1,  1,  1));
            self.createDigit("5", new Array(
                 1,  1,  1,  1,  1,
                 1, -1, -1, -1, -1,
                 1, -1, -1, -1, -1,
                 1,  1,  1,  1,  1,
                -1, -1, -1, -1,  1,
                -1, -1, -1, -1,  1,
                -1, -1, -1, -1,  1,
                 1,  1,  1,  1,  1));
            self.createDigit("6", new Array(
                -1,  1,  1,  1, -1,
                 1,  1, -1, -1, -1, 
                 1, -1, -1, -1, -1, 
                 1, -1,  1,  1, -1, 
                 1,  1,  1,  1,  1, 
                 1,  1, -1, -1,  1, 
                 1,  1, -1, -1,  1, 
                -1,  1,  1,  1,  1));
            self.createDigit("7", new Array(
                 1,  1,  1,  1,  1, 
                -1, -1, -1,  1,  1, 
                -1, -1, -1,  1, -1, 
                -1, -1, -1,  1, -1, 
                -1, -1,  1,  1, -1, 
                -1, -1,  1, -1, -1, 
                -1,  1,  1, -1, -1, 
                -1,  1, -1, -1, -1));
            self.createDigit("8", new Array(
                 1,  1,  1,  1,  1, 
                 1, -1, -1, -1,  1, 
                 1, -1, -1, -1,  1, 
                 1,  1,  1,  1,  1, 
                -1,  1,  1,  1,  1, 
                 1,  1, -1, -1,  1, 
                 1, -1, -1, -1,  1, 
                 1,  1,  1,  1,  1));
            self.createDigit("9", new Array(
                 1,  1,  1,  1,  1, 
                 1,  1, -1,  1,  1, 
                 1, -1, -1, -1,  1, 
                 1,  1,  1,  1,  1, 
                -1, -1, -1, -1,  1, 
                -1, -1, -1, -1,  1, 
                -1, -1, -1, -1,  1, 
                -1, -1, -1, -1,  1));
        };
    },
    app = new NeuralNetwork();
