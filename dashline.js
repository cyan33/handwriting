if (window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype.lineTo) {
    CanvasRenderingContext2D.prototype.dashedLine = function (x, y, x2, y2, dashArray) {
        if (!dashArray) dashArray = [5, 5];
        var dashCount = dashArray.length;
        this.moveTo(x, y);
        var dx = (x2 - x), dy = (y2 - y);
        var slope = dy / dx;
        var distRemaining = Math.sqrt(dx * dx + dy * dy);
        var dashIndex = 0, draw = true;
        while (distRemaining >= 0.1 && dashIndex < 10000) {
            var dashLength = dashArray[dashIndex++ % dashCount];
            if (dashLength == 0) dashLength = 0.001; // Hack for Safari
            if (dashLength > distRemaining) dashLength = distRemaining;
            var xStep = Math.sqrt(dashLength * dashLength / (1 + slope * slope));
            x += xStep
            y += slope * xStep;
            this[draw ? 'lineTo' : 'moveTo'](x, y);
            distRemaining -= dashLength;
            draw = !draw;
        }
        // Ensure that the last segment is closed for proper stroking
        this.moveTo(0, 0);
    }
}
//canvas 画布ID
//defaultX defaultY 起始坐标点
//x，y终点坐标点
function dashedLine(canvas, defaultX, defaultY, x, y) {
    var c = document.getElementById(canvas);
    var cxt = c.getContext("2d");
    cxt.strokeStyle = 'black';
    var dashes = "5 5";
    var drawDashes = function () {
        var dashGapArray = dashes.replace(/^\s+|\s+$/g, '').split(/\s+/);
        if (!dashGapArray[0] || (dashGapArray.length == 1 && dashGapArray[0] == 0)) return;
        cxt.lineWidth = "1";
        cxt.lineCap = "round";
        cxt.beginPath();
        cxt.strokeStyle = 'red'
        //开始画虚线。
        cxt.dashedLine(defaultX, defaultY, x, y, dashGapArray);
        cxt.closePath();
        cxt.stroke();
    };
    drawDashes();
}