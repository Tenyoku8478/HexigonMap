var hexigons = [];

function drawHex() {
    var row = 0;
    var $row = null;
    
    var prev = 0;
    hexigons.forEach(function(hex) {
        var id = parseInt(hex['id']);
        var type = hex['type'];
        
        while (id > row * 30) {
            prev = row * 30;
            row += 1;
            $row = $('<div>').addClass('row');
            $('body').append($row).show();
        }
        
        var $hex = $('<div>').addClass('hex');
        
        var txt = id;
        
        if (type == '戰鬥') {
            txt += '<br/>' + hex['boss'];
        }
        else {
            txt += '<br/>' + type;
        }
        $hex.html(txt);
        
        if (id - prev > 1) {
            var skip = '--num-skip: ';
            skip += (id - prev - 1);
            $hex.addClass('skip-n')
            $hex.attr('style', skip);
        }
        
        if (type == '戰鬥') {
            $hex.addClass('red-border');
        }
        else if (type == '委派') {
            $hex.addClass('green-border');
        }
        else if (type == '捐獻') {
            $hex.addClass('blue-border');
        }
        else if (type == '淨化') {
            $hex.addClass('orange-border');
        }
        
        $row.append($hex).append('\n').show();
        prev = id;
    });
}

function init() {
    $.getJSON('hexigon.json', function(data) {
        data.forEach(function(e) {
            hexigons.push(e);
        });
        drawHex();
    });
}

$(function() {
    init();
});