
    function phi(x) {
        return (Math.exp(-1*x * x / 2.0) / Math.sqrt(2.0 * Math.PI));
    }

    function pdf(x, mu=0.0, sigma=1.0) {
        return (phi((x - mu) / sigma) / sigma);
    }

    function Phi(z) {
        if (z < -8.0) { return 0.0; }
        if (z >  8.0) { return 1.0; }
        var total = 0.0;
        var term = z;
        var i = 3;
        while (total != total + term) {
            total += term;
            term *= z * z / i;
            i += 2;
        }
        return (0.5 + total * phi(z));
    }

    function cdf(z, mu=0.0, sigma=1.0) {
        return (Phi((z - mu) / sigma));
    }

    function drawChart() {
        var isCall = document.getElementById("isCall").checked;
        var q = parseFloat(document.getElementById("yield").value);
        var share = parseFloat(document.getElementById("share").value);
        var x = parseFloat(document.getElementById("strike").value);
        var rf = parseFloat(document.getElementById("rfr").value);
        var sigma = parseFloat(document.getElementById("vol").value);
        var t = parseFloat(document.getElementById("time").value);
        var prices = [];

        if (isCall == true) {
            var i;
            for (i=0;i<24;i++) {
                var s = (i/12)*share;
                var a = (1/(sigma*Math.sqrt(t)))*(Math.log(s/x) + (rf-q+(1/2)*sigma*sigma)*t);
                var b = a - sigma*Math.sqrt(t);
                var f = s*Math.exp((rf-q)*t);
                var res = Math.exp(-1*rf*t)*(f*cdf(a)-x*cdf(b));
                prices.push(res)
            }
        }
        else {
            var i;
            for (i=0;i<24;i++) {
                var s = (i/12)*share;
                var a = (1/(sigma*Math.sqrt(t)))*(Math.log(s/x) + (rf-q+(1/2)*sigma*sigma)*t);
                var b = a - sigma*Math.sqrt(t);
                var f = s*Math.exp((rf-q)*t);
                var res = Math.exp(-1*rf*t)*(x*cdf(-1*b)-f*cdf(-1*a));
                prices.push(res)
            }
        }

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            theme: "light2",
            title:{
                text: "Option Price v. Share Price"
            },
            axisX:{
                title: "Share Price"
            },
            axisY:{
                title: "Option Price",
                includeZero: false
            },
            data: [{        
                type: "line",       
                dataPoints: [
                    { y: prices[0], x: share*(0/12) },
                    { y: prices[1], x: share*(1/12) },
                    { y: prices[2], x: share*(2/12) }, //{ y: 520, indexLabel: "highest",markerColor: "red", markerType: "triangle" },
                    { y: prices[3], x: share*(3/12) },
                    { y: prices[4], x: share*(4/12) },
                    { y: prices[5], x: share*(5/12) },
                    { y: prices[6], x: share*(6/12) },
                    { y: prices[7], x: share*(7/12) },
                    { y: prices[8], x: share*(8/12) }, //{ y: 410 , indexLabel: "lowest",markerColor: "DarkSlateGrey", markerType: "cross" },
                    { y: prices[9], x: share*(9/12) },
                    { y: prices[10], x: share*(10/12) },
                    { y: prices[11], x: share*(11/12) },
                    { y: prices[12], x: share*(12/12) },
                    { y: prices[13], x: share*(13/12) },
                    { y: prices[14], x: share*(14/12) },
                    { y: prices[15], x: share*(15/12) },
                    { y: prices[16], x: share*(16/12) },
                    { y: prices[17], x: share*(17/12) },
                    { y: prices[18], x: share*(18/12) },
                    { y: prices[19], x: share*(19/12) },
                    { y: prices[20], x: share*(20/12) },
                    { y: prices[21], x: share*(21/12) },
                    { y: prices[22], x: share*(22/12) },
                    { y: prices[23], x: share*(23/12) },
                    { y: prices[24], x: share*(24/12) }
                ]
            }]
        });
        chart.render();
    }

    function Price() {
        var isCall = document.getElementById("isCall").checked;
        var q = parseFloat(document.getElementById("yield").value);
        var s = parseFloat(document.getElementById("share").value);
        var x = parseFloat(document.getElementById("strike").value);
        var rf = parseFloat(document.getElementById("rfr").value);
        var sigma = parseFloat(document.getElementById("vol").value);
        var t = parseFloat(document.getElementById("time").value);
        var a = (1/(sigma*Math.sqrt(t)))*(Math.log(s/x) + (rf-q+(1/2)*sigma*sigma)*t);
        var b = a - sigma*Math.sqrt(t);
        var f = s*Math.exp((rf-q)*t);

        if (isCall == true) {
            var res = Math.exp(-1*rf*t)*(f*cdf(a)-x*cdf(b));
            var delta = Math.exp(-1*q*t)*cdf(a);
            var gamma = Math.exp(-1*q*t)*pdf(a)*(1/(s*sigma*Math.sqrt(t)));
            var theta = Math.exp(-1*q*t)*s*pdf(a)*(sigma/(2*Math.sqrt(t))) + q*Math.exp(-1*q*t)*s*cdf(a)-rf*Math.exp(-1*rf*t)*x*cdf(b);
            var vega = Math.exp(-1*q*t)*s*pdf(a)*Math.sqrt(t);
        }
        else {
            var res = Math.exp(-1*rf*t)*(x*cdf(-1*b)-f*cdf(-1*a));
            var delta = Math.exp(-1*q*t)*(cdf(a)-1);
            var gamma = Math.exp(-1*q*t)*pdf(a)*(1/(s*sigma*Math.sqrt(t)));
            var theta = Math.exp(-1*q*t)*(-1*((s*pdf(a)*sigma)/(2*Math.sqrt(t))) + rf*x*Math.exp(-1*rf*t)*cdf(-1*b));
            var vega = Math.exp(-1*q*t)*s*pdf(a)*Math.sqrt(t);
        }

        document.getElementById("result").innerHTML = "Option Price: " + Math.round(res*100)/100;
        document.getElementById("delta").innerHTML = "Delta: " + Math.round(delta*100)/100;
        document.getElementById("gamma").innerHTML = "Gamma: " + Math.round(gamma*100)/100;
        document.getElementById("theta").innerHTML = "Theta: " + Math.round(theta*100)/100;
        document.getElementById("vega").innerHTML = "Vega: " + Math.round(vega*100)/100;
        drawChart();
        return res;
    }