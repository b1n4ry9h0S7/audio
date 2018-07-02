window.onload = function() {
  var file = document.getElementById('thefile');

  var audio = document.getElementById('myAudio');

  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    var filename = files[0].name;
    console.log(filename);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    console.log();
    var canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = 550;
    var ctx = canvas.getContext('2d');
    // ----------------------------------------------
    // test
    var title;
    var artist;
    id3(files[0], function(err, tags) {
      title = tags.title;
      artist = tags.artist;
      document.getElementById('playing').innerHTML = tags.artist;
      document.getElementById('sname').innerHTML = tags.title;
    });

    // end-test

    // document.getElementById('playing').innerHTML = 'Now Playing...';

    // document.getElementById('sname').innerHTML = filename;
    // ----------------------------------------------
    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    console.log('Buffer Length:' + bufferLength);

    var dataArray = new Uint8Array(bufferLength);

    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    function renderFrame() {
      requestAnimationFrame(renderFrame);

      x = 0;

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        var r = barHeight + 25 * (i / bufferLength);
        var g = 25 * (i / bufferLength);
        var b = 25;

        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
        ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    }

    audio.play();
    renderFrame();
  };
};
