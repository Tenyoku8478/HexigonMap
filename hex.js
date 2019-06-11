const hexigons = [];
const hexids = [];


function moveTo(id) {
  if (id === undefined) {
    return;
  }
  window.scroll(0, 0);
  const y_pos = $('#' + id).offset().top;
  const x_pos = $('#' + id).offset().left;
  const w_height = $(window).height();
  const w_width = $(window).width();
  
  const x = Math.max(0, x_pos - w_width / 2);
  const y = Math.max(0, y_pos - w_height / 2);
  
  console.log(y_pos, x_pos, w_height, w_width, x, y);
  
  window.scroll(x, y);
}

function draw() {
    let row = 0;
    let $row = null;
    let start = undefined;
    
    let prev = 0;
    hexigons.forEach(function(hex) {
        //格子編號、格子種類、格子攻破否
        const id = parseInt(hex['id']);
        const type = hex['type'];
        const r_type = hex['rewardtype'];
        const pass = hex['pass'];
        
        //格子換行
        while (id >= row * 30) {
            prev = row * 30;
            row += 1;
            $row = $('<div>').addClass('row');
            $('body').append($row).show();
        }
        
        //Ex. #hex1
        var $hex = $('<div>').addClass('hex').attr('id', 'hex' + (id + 1));
        
        //戰鬥格子顯示boss，其餘顯示種類
        var txt = (id + 1);
        if (type == '戰鬥') {
            txt += '<br/>' + hex['boss'];
        } else {
            txt += '<br/>' + type;
        }
        $hex.html(txt);
        
        //跳過沒有用的格子
        if (id - prev > 1) {
            var skip = '--num-skip: ';
            skip += (id - prev - 1);
            $hex.addClass('skip-n')
            $hex.attr('style', skip);
        }
        
        //幫不同種類的格子加邊框
        if (type == '戰鬥') {
            $hex.addClass('red-border');
        } else if (type == '委派') {
            $hex.addClass('green-border');
        } else if (type == '捐獻') {
            $hex.addClass('blue-border');
        } else if (type == '淨化') {
            $hex.addClass('orange-border');
        }
        
        //判斷格子為已攻破 (pass)、不能攻打 (notpass)、正在攻打 (fight)
        if (pass === 'O') {
          $hex.addClass('pass');
        } else {
          const around = [];
          if (Math.floor(id / 30) % 2 == 1) {
            if (id % 30 > 0) {
              around.push(hexids.indexOf(id - 1));
            }
            if (id % 30 < 29) {
              around.push(hexids.indexOf(id + 1));
              around.push(hexids.indexOf(id + 30));
              around.push(hexids.indexOf(id + 31));
            }
            around.push(hexids.indexOf(id - 30));
            around.push(hexids.indexOf(id - 29));
          } else {
            if (id % 30 > 0) {
              around.push(hexids.indexOf(id - 31));
              around.push(hexids.indexOf(id - 1));
              around.push(hexids.indexOf(id + 29));
            }
            if (id % 30 < 29) {
              around.push(hexids.indexOf(id + 1));
            }
            around.push(hexids.indexOf(id - 30));
            around.push(hexids.indexOf(id + 30));
          }
          
          let fight = false;
          for (let i = 0; i < around.length; i++) {
            let a = around[i]
            if (a != -1 && hexigons[a]['pass'] === 'O') {
              $hex.addClass('fight');
              fight = true;
              break;
            }
          }
          if (!fight) {
            $hex.addClass('notpass');
          }
        }
        
        if (type == '起始點') {
          start = $hex.attr('id');
          $('#bar起始點').append($('<li>').append($('<a>').text('起始點').attr('href', '#').bind('click', () => {
            moveTo($hex.attr('id'));
          })));
        } else if (type == '戰鬥' && hex['boss'] == '偽神') {
          $('#bar偽神相關').append($('<li>').append($('<a>').text(hex['boss']).attr('href', '#').bind('click', () => {
            moveTo($hex.attr('id'));
          })));
        } else if (r_type == '巫女之魂' || r_type == '削弱偽神' || r_type == '幻境據點') {
          $('#bar偽神相關').append($('<li>').append($('<a>').text(hex['boss']).attr('href', '#').bind('click', () => {
            moveTo($hex.attr('id'));
          })));
        }
        
        $row.append($hex).append('\n').show();
        prev = id;
    });
    
    //移動至起始點
    moveTo(start);
}

$(function() {
  $.getJSON('hexigon.json', function(data) {
      data.forEach(function(e) {
          hexigons.push(e);
          hexids.push(e['id']);
      });
      draw();
  });
});