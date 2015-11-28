var teste = null;
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
            drawView = ENCOG.GUI.Drawing.create('draw-digit', Math.ceil(drawElement.width()), Math.ceil(drawElement.width()));
            representationView = ENCOG.GUI.CellGrid.create('neural-representation', representationColumns, representationRows, Math.ceil(representationElement.width()), Math.ceil((representationElement.width() * 1.1)));
            teste = drawView;
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

                // Now we will actually recognize the letter drawn.
                // To do this, we will use a Euclidean distance
                // http://www.heatonresearch.com/wiki/Euclidean_Distance

                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    var delta = data[i] - representationData[i];
                    sum = sum + (delta * delta);
                }

                sum = Math.sqrt(sum);

                // Basically we are calculating the Euclidean distance between
                // what was just drawn, and each of the samples we taught
                // the program.  The smallest Euclidean distance is the char.

                if (sum < bestScore || bestChar == '??') {
                    bestScore = sum;
                    bestChar = c;
                }

            }
            resultElement.text(bestChar);
            console.log(bestChar);

            /*            drawView.clear();
                        self.clearRepresentation();*/
        };

        var learning = function () {
            self.createDigit("0", new Array(-1, 1, 1, 1, -1, 1, 1, -1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, -1));
            self.createDigit("1", new Array(-1, -1, -1, 1, -1, -1, -1, 1, -1, -1,
                1, 1, 1, -1, -1,
                1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1));
            self.createDigit("2", new Array(
                1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1));
            self.createDigit("3", new Array(
                1, 1, 1, 1, -1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, -1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1));
            self.createDigit("4", new Array(
                1, -1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1));
            self.createDigit("5", new Array(
                1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1));
            self.createDigit("6", new Array(-1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1, 1, 1));
            self.createDigit("7", new Array(
                1, 1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, -1, -1, -1));
            self.createDigit("8", new Array(
                1, 1, 1, 1, 1, 1, -1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1));
            self.createDigit("9", new Array(
                1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, -1, -1, 1));
        };
    },
    app = new NeuralNetwork();
