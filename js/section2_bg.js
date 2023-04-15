
// config
var PADDING = 50;

// init canvas
var c = document.getElementById("background_2");
var ctx = c.getContext("2d");


//////////////////////////////////////////////////////////////////////////////////
// handle size
//////////////////////////////////////////////////////////////////////////////////
var width = document.documentElement.clientWidth;
var height = window.innerHeight;
/*
c.style.width = "38vw";
c.style.left = "28vw";
*/
c.width = width;
c.height = height;

// on screen resized
window.addEventListener("resize", () => {
    width = document.documentElement.clientWidth;
    height = window.innerHeight;
    
    c.width = width;
    c.height = height;
    
    draw();
});

function draw() {
    var nbr_lines_x = Math.round(width / 1200 * 3);
    var nbr_lines_y = Math.round(height / 720 * 2);

    ctx.strokeStyle = 'white';
    ctx.fillStyle = "white";
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.8;

    // subject text Right bottom
    ctx.save();
    ctx.font = (height/720) * 20 + "px Arial";
    ctx.globalAlpha = 0.5;
    ctx.translate(width - PADDING, height - PADDING);
    ctx.rotate(-Math.PI/2);
    ctx.fillText("SUBJECT #01 | Ramzi Sah", 25, PADDING/2);
    ctx.restore();

    /*
    // subject size
    ctx.save();
    ctx.moveTo(
        width - PADDING - 50, 
        PADDING + 50
    );

    ctx.lineTo(
        width - PADDING - 50, 
        height/2 - PADDING - 20
    );
    ctx.moveTo(
        width - PADDING - 50, 
        height/2 - PADDING + 20
    );

    ctx.lineTo(
        width - PADDING - 50, 
        height - PADDING - 50
    );
    ctx.stroke();
    ctx.restore();
    */
   
    //////////////////////////////////////////////////////////////////////////////////
    // handle grid
    //////////////////////////////////////////////////////////////////////////////////
    ctx.beginPath();

    ctx.moveTo(PADDING, PADDING);
    //ctx.lineTo(PADDING, height - PADDING - height/10);
    //ctx.moveTo(PADDING, height - PADDING - height/50);
    ctx.lineTo(PADDING, height - PADDING);
    ctx.lineTo(width - PADDING, height - PADDING);
    ctx.lineTo(width - PADDING, PADDING);
    ctx.lineTo(PADDING, PADDING);
    ctx.stroke();

    // X strokes
    var size_x = width - PADDING * 2;
    for (var i = 0; i <= nbr_lines_x; i++) {
        // X second level strokes
        for (var j = 0; j <= 5; j++) {
            
            for (var k = 1; k <= 5; k++) {
                ctx.beginPath();
        
                ctx.lineWidth = 0.01;
        
                ctx.lineTo(size_x / (nbr_lines_x+1) * i + size_x / ((nbr_lines_x+1) * 6) * j + size_x / ((nbr_lines_x+1) * 36) * k + PADDING, PADDING); // 6 * 6 * 6 == 216
                ctx.lineTo(size_x / (nbr_lines_x+1) * i + size_x / ((nbr_lines_x+1) * 6) * j + size_x / ((nbr_lines_x+1) * 36) * k + PADDING, height - PADDING);
        
                ctx.stroke();
            }
            
            if (j == 0) continue;
            ctx.beginPath();

            ctx.lineWidth = 0.05;

            ctx.lineTo(size_x / (nbr_lines_x+1) * i + size_x / ((nbr_lines_x+1) * 6) * j + PADDING, PADDING);
            ctx.lineTo(size_x / (nbr_lines_x+1) * i + size_x / ((nbr_lines_x+1) * 6) * j + PADDING, height - PADDING);

            ctx.stroke();
        }
        if (i == 0) continue;
        
        //first level strokes
        ctx.beginPath();

        ctx.lineWidth = 0.15;

        ctx.lineTo(size_x * i / (nbr_lines_x+1) + PADDING, PADDING);
        ctx.lineTo(size_x * i / (nbr_lines_x+1) + PADDING, height - PADDING);

        ctx.stroke();
    }

    // Y strokes
    var size_y = height - PADDING * 2;
    for (var i = 0; i <= nbr_lines_y; i++) {
        // X second level strokes
        for (var j = 0; j <= 5; j++) {
            for (var k = 1; k <= 5; k++) {
                ctx.beginPath();
        
                ctx.lineWidth = 0.01;
        
                ctx.lineTo(PADDING, size_y / (nbr_lines_y+1) * i + size_y / ((nbr_lines_y+1) * 6) * j + size_y / ((nbr_lines_y+1) * 36) * k + PADDING);
                ctx.lineTo(width - PADDING, size_y / (nbr_lines_y+1) * i + size_y / ((nbr_lines_y+1) * 6) * j + size_y / ((nbr_lines_y+1) * 36) * k + PADDING);
        
                ctx.stroke();
            }
            
            if (j == 0) continue;
            ctx.beginPath();

            ctx.lineWidth = 0.05;

            ctx.lineTo(PADDING, size_y / (nbr_lines_y+1) * i + size_y / ((nbr_lines_y+1) * 6) * j + PADDING);
            ctx.lineTo(width - PADDING, size_y / (nbr_lines_y+1) * i + size_y / ((nbr_lines_y+1) * 6) * j + PADDING);

            ctx.stroke();
        }
        if (i == 0) continue;
        
        //first level strokes
        ctx.beginPath();

        ctx.lineWidth = 0.15;

        ctx.lineTo(PADDING, size_y * i / (nbr_lines_y+1) + PADDING);
        ctx.lineTo(width - PADDING, size_y * i / (nbr_lines_y+1) + PADDING);

        ctx.stroke();
    }

    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.2;
    for(var i = 0; i <= nbr_lines_x+1; i++) {
        for(var j = 0; j <= nbr_lines_y+1; j++) {
            ctx.beginPath();
            ctx.arc(size_x / (nbr_lines_x+1) * i + PADDING, size_y / (nbr_lines_y+1) * j + PADDING, 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

};

draw();

