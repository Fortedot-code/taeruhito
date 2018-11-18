window.addEventListener("load", init);

function init() {

  // ----------------
  // 変数定義
  // ----------------
  ticker_count = 0;
  var music_flag = true;
  var fight_music;

  // 加速度センサ
  var x_ac_val; // X軸
  var y_ac_val; // Y軸
  var z_ac_val; // Z軸

  // ジャイロセンサ
  var beta; // X軸
  var gamma; // Y軸
  var alpha; // Z軸

  var device_ok;

  // sound
  createjs.Sound.registerSound("assets/sound/fight.mp3", "music01");



  // ----------------
  // 描画オブジェクト設定
  // ----------------

  // canvas全画面化設定
  (function() {
    var canvas = document.getElementById('canvas');
    var canvas_container = document.getElementById('wrap');
    ctx = canvas.getContext('2d');
    sizing();

    function sizing() {
      canvas.height = canvas_container.offsetHeight;
      canvas.width = canvas_container.offsetWidth;
    }

    window.addEventListener('resize', function() {
      (!window.requestAnimationFrame) ? setTimeout(sizing, 300): window.requestAnimationFrame(sizing);
    });
  })();

  var stage = new createjs.Stage('canvas');

  // 複数のオブジェクトをまとめるコンテナを生成
  var container = new createjs.Container();
  container.scaleX = 0.5;
  container.scaleY = 0.5;
  stage.addChild(container);

  // タッチ操作をサポートしているブラウザーならば
  if (createjs.Touch.isSupported() == true) {
    // タッチ操作を有効にします。
    createjs.Touch.enable(stage)
  }

  // loading描画関数
  function draw(zero_point) {
    var percentage = (zero_point * 100).toFixed(0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 円周を描く
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.arc(canvas.width*0.5, canvas.height*0.5, canvas.width*0.25, Math.PI * 1.5, Math.PI * 2 * zero_point + Math.PI * 1.5, false);
    ctx.stroke();

    // テキスト
    ctx.font = "72px 'Tahoma'";
    ctx.fillStyle = "#000";
    ctx.fillText(percentage + '%', (canvas.width-ctx.measureText('10%').width)*0.5, canvas.height*0.52);
  }

  // preloadJSの定義
  var queue = new createjs.LoadQueue();
  // 同時読み込み数の設定（デフォルトは1）
  queue.setMaxConnections(2);

  // progressイベント
  queue.on("progress", function(e) {
    var zero_point = (e.progress).toFixed(2); // 小数点第二位まで 0.01 ~ 1.00
    draw(zero_point); // 描画関数を実行
    if (e.progress === 1) {} // 完了したら特定の処理を行うことも
  });

  // ファイルが1つ読込完了するたびにfileloadイベントが発生
  // fileloadイベントにメソッドを割り当てる
  queue.addEventListener('fileload', function(e){
    if(e.item.type === createjs.LoadQueue.IMAGE){
      var bitmap = new createjs.Bitmap(e.result);
      // コンテナにaddChildする
      // container.addChild(bitmap);
    }else if(e.item.type === createjs.LoadQueue.SOUND){
      // var music = new createjs.Sound.registerSound(e.result);
    }
  });

  // 全ファイルの読み込みが終わった時completeイベントが発生する
  queue.addEventListener('complete', function(e){

    define_pic();
    // pic normal(最初のポーズ)
    pic_a = image_1;
    pic_b = image_2;
    gamestart();
  });

  queue.loadManifest([
    {id: 'image_1', src: 'assets/img/human/01_normal01.png'},
    {id: 'image_2', src: 'assets/img/human/01_normal02.png'},
    {id: 'image_3', src: 'assets/img/human/02_headtap01.png'},
    {id: 'image_4', src: 'assets/img/human/02_headtap02.png'},
    {id: 'image_5', src: 'assets/img/human/03_bodytap01.png'},
    {id: 'image_6', src: 'assets/img/human/03_bodytap02.png'},
    {id: 'image_7', src: 'assets/img/human/04_foottap01.png'},
    {id: 'image_8', src: 'assets/img/human/04_foottap02.png'},
    {id: 'image_9', src: 'assets/img/human/05_side01.png'},
    {id: 'image_10', src: 'assets/img/human/05_side02.png'},
    {id: 'image_11', src: 'assets/img/human/06_footside01.png'},
    {id: 'image_12', src: 'assets/img/human/06_footside02.png'},
    {id: 'image_13', src: 'assets/img/human/07_30degree01.png'},
    {id: 'image_14', src: 'assets/img/human/07_30degree02.png'},
    {id: 'image_15', src: 'assets/img/human/08_45degree01.png'},
    {id: 'image_16', src: 'assets/img/human/08_45degree02.png'},
    {id: 'image_17', src: 'assets/img/human/09_upsidedown01.png'},
    {id: 'image_18', src: 'assets/img/human/09_upsidedown02.png'},
    {id: 'image_19', src: 'assets/img/human/10_tilttap01.png'},
    {id: 'image_20', src: 'assets/img/human/10_tilttap02.png'},
    {id: 'image_21', src: 'assets/img/human/11_tilttap01.png'},
    {id: 'image_22', src: 'assets/img/human/11_tilttap02.png'},
    {id: 'image_23', src: 'assets/img/human/12_shuffle01.png'},
    {id: 'image_24', src: 'assets/img/human/13_crack01.png'},
    {id: 'image_25', src: 'assets/img/human/13_crack02.png'},
    {id: 'image_26', src: 'assets/img/human/13_crack03.png'},
    {id: 'image_27', src: 'assets/img/human/13_crack04.png'},
    {id: 'image_28', src: 'assets/img/human/14_catch01.png'},
    {id: 'image_29', src: 'assets/img/human/15_detach01.png'},
    {id: 'image_30', src: 'assets/img/human/15_detach02.png'},
    {id: 'image_31', src: 'assets/img/human/15_detach03.png'},
    {id: 'image_32', src: 'assets/img/human/15_detach04.png'},
    {id: 'image_33', src: 'assets/img/human/15_detach05.png'},
    {id: 'image_34', src: 'assets/img/human/15_detach06.png'},
    {id: 'image_35', src: 'assets/img/human/15_detach07.png'},
    {id: 'image_36', src: 'assets/img/human/15_detachhead01.png'},
    {id: 'image_37', src: 'assets/img/human/16_jojo01.png'},

    {id: 'image_38', src: 'assets/img/se/se01_gogogo.png'},
    {id: 'image_39', src: 'assets/img/se/se02_shu.png'},
    {id: 'image_40', src: 'assets/img/se/se03_ton.png'},
    {id: 'image_41', src: 'assets/img/se/se04_kura.png'},
    {id: 'image_42', src: 'assets/img/se/se05_surprised.png'},
    {id: 'image_43', src: 'assets/img/se/se06_nyoki.png'},
    {id: 'image_44', src: 'assets/img/se/se07_nyokinyoki.png'},
    {id: 'image_45', src: 'assets/img/se/se08_buchi.png'},

    {id: 'music01', src: 'assets/sound/fight.mp3'}
  ]);



  function gamestart(){
    var obj01 = new createjs.Shape();
    obj01.graphics.beginFill("LightBlue");
    obj01.graphics.moveTo(0, 0);
    obj01.graphics.lineTo(0, 500);
    obj01.graphics.lineTo(500, 0);
    obj01.graphics.lineTo(0, 0);
    stage.addChild(obj01); // 表示リストに追加

    var obj02 = new createjs.Shape();
    obj02.graphics.beginFill("LightGreen");
    obj02.graphics.moveTo(Math.floor(canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5));
    obj02.graphics.lineTo(Math.floor(canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5));
    obj02.graphics.lineTo(Math.floor(2*canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5));
    obj02.graphics.lineTo(Math.floor(2*canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5+canvas.width/3));
    obj02.graphics.lineTo(Math.floor(canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5+canvas.width/3));
    obj02.graphics.lineTo(Math.floor(canvas.width/3), Math.floor((canvas.height-canvas.width/3)*0.5));
    stage.addChild(obj02); // 表示リストに追加

    // データ表示用テキスト
    var t0 = new createjs.Text("デバイス対応：", "24px serif", "DarkRed");
    stage.addChild(t0);
    t0.x = 100;
    t0.y = 50;
    var t1 = new createjs.Text("ac_x軸：", "24px serif", "DarkRed");
    stage.addChild(t1);
    t1.x = 100;
    t1.y = 100;
    var t2 = new createjs.Text("ac_y軸：", "24px serif", "DarkRed");
    stage.addChild(t2);
    t2.x = 100;
    t2.y = 150;
    var t3 = new createjs.Text("ac_軸：", "24px serif", "DarkRed");
    stage.addChild(t3);
    t3.x = 100;
    t3.y = 200;
    var t4 = new createjs.Text("加速向", "240px serif", "DarkRed");
    stage.addChild(t4);
    t4.x = 400;
    t4.y = 250;
    var t5 = new createjs.Text("j_x軸：", "24px serif", "DarkRed");
    stage.addChild(t5);
    t5.x = 100;
    t5.y = 250;
    var t6 = new createjs.Text("j_y軸：", "24px serif", "DarkRed");
    stage.addChild(t6);
    t6.x = 100;
    t6.y = 300;
    var t7 = new createjs.Text("j_z軸：", "24px serif", "DarkRed");
    stage.addChild(t7);
    t7.x = 100;
    t7.y = 350;
    var t8 = new createjs.Text("幅："+canvas.width, "24px serif", "DarkRed");
    stage.addChild(t8);
    t8.x = 100;
    t8.y = 400;
    var t9 = new createjs.Text("高："+canvas.height, "24px serif", "DarkRed");
    stage.addChild(t9);
    t9.x = 100;
    t9.y = 450;

    // 円を作成します
    var shape = new createjs.Shape();
    shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 40); // 半径 100px の円を赤色で描画するように設定
    stage.addChild(shape); // 表示リストに追加

    // ----------------
    // tick イベント
    // ----------------

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", handleTick);

    function handleTick(event) {
      // シェイプをマウスに追随させる
      shape.x = stage.mouseX;
      shape.y = stage.mouseY;

      ticker_count++;
      // console.log(ticker_count);

      if ((stage.mouseX + stage.mouseY) > 500 && music_flag){
        // music start
        fight_music = createjs.Sound.play("music01");
        music_flag = false;

        // pic headtap
        before_pic_a = pic_a;
        before_pic_b = pic_b;
        pic_a = image_3;
        pic_b = image_4;
        delete_animation([before_pic_a, before_pic_b]);
      }
      if ((stage.mouseX + stage.mouseY) < 500 && !music_flag){
        // music stop
        fight_music.stop();
        music_flag = true;

        // pic normal
        before_pic_a = pic_a;
        before_pic_b = pic_b;
        pic_a = image_1;
        pic_b = image_2;
        delete_animation([before_pic_a, before_pic_b]);
      }

      // あたり判定
      // 星からみた相対座標に変換する
      var point = obj02.globalToLocal(stage.mouseX, stage.mouseY);
      // 星とドットがあたっているかを調べる
      var isHit = obj02.hitTest(point.x, point.y);
      // あたっていれば
      if (isHit == true) {
        shape.graphics.beginFill("Black").drawCircle(0, 0, 40);

        before_pic_a = pic_a;
        before_pic_b = pic_b;
        pic_a = image_5;
        pic_b = image_6;
        delete_animation([before_pic_a, before_pic_b]);
      } else {
        shape.graphics.beginFill("DarkRed").drawCircle(0, 0, 40);
        before_pic_a = pic_a;
        before_pic_b = pic_b;
        delete_animation([pic_a, pic_b]);
        pic_a = before_pic_a;
        pic_b = before_pic_b;
      }

      // アニメーション
      animation([pic_a, pic_b]);

      // debug
      if(x_ac_val != null && beta != null){
        device_ok = "OK";
      }else{
        device_ok = "NG";
      }
      t0.text = "デバイス対応：" + device_ok;
      t1.text = "ac_x軸：" + x_ac_val;
      t2.text = "ac_y軸：" + y_ac_val;
      t3.text = "ac_z軸：" + z_ac_val;
      t5.text = "j_x軸：" + beta;
      t6.text = "j_y軸：" + gamma;
      t7.text = "j_z軸：" + alpha;

      // 画面を更新する
      stage.update();
    }

    function animation(animation_array){
      if(ticker_count<15){
        animation_array[1].visible=false;
        animation_array[0].visible=true;
      }else if (ticker_count>=15 && ticker_count < 30) {
        animation_array[0].visible=false;
        animation_array[1].visible=true;
      }else{
        ticker_count=0;
      }
    }

    function delete_animation(animation_array){
      for(let picture of animation_array) {
        picture.visible=false;
      }
    }


    // ----------------
    // 加速度を検知
    // ----------------
    // DeviceMotion Event
    window.addEventListener('devicemotion', deviceMotionHandler);

    // 加速度が変化
    function deviceMotionHandler(event) {

      // 加速度
      // X軸
      x_ac_val = event.acceleration.x;
      // Y軸
      y_ac_val = event.acceleration.y;
      // Z軸
      z_ac_val = event.acceleration.z;


      // 3軸加速度
      // acc = Math.round(Math.sqrt(x*x + y*y + z*z) * 10) / 10;
      // t4.text = acc

      const bound = 7;
      if (x_ac_val > bound) { // 右
        t4.text = '右';
      }
      else if (x_ac_val < -bound) { // 左
        t4.text = '左';
      }
      else if (y_ac_val > bound) { // 上
        t4.text = '上';
      }
      else if (y_ac_val < -bound) { // 下
        t4.text = '下';
      }
    }



    // ----------------
    // ジャイロ取得
    // ----------------

    window.addEventListener(
      'deviceorientation',
      deviceOrientationHandler);

    /** デバイスが傾いたときのイベントです。 */
    function deviceOrientationHandler(event) {
      //ジャイロセンサー情報取得
      // X軸
      beta = event.beta;
      // Y軸
      gamma = event.gamma;
      // Z軸
      alpha = event.alpha;

      // グラフィックを傾ける
      // img01.style.transform = `rotateX(${beta + 180}deg) rotateY(${gamma + 180}deg) rotateZ(${alpha}deg)`;
    }
  }

  function define_pic(){
    image_1 = new createjs.Bitmap(queue.getResult('image_1'));
    image_2 = new createjs.Bitmap(queue.getResult('image_2'));
    image_3 = new createjs.Bitmap(queue.getResult('image_3'));
    image_4 = new createjs.Bitmap(queue.getResult('image_4'));
    image_5 = new createjs.Bitmap(queue.getResult('image_5'));
    image_6 = new createjs.Bitmap(queue.getResult('image_6'));
    image_7 = new createjs.Bitmap(queue.getResult('image_7'));
    image_8 = new createjs.Bitmap(queue.getResult('image_8'));
    image_9 = new createjs.Bitmap(queue.getResult('image_9'));
    image_10 = new createjs.Bitmap(queue.getResult('image_10'));
    image_11 = new createjs.Bitmap(queue.getResult('image_11'));
    image_12 = new createjs.Bitmap(queue.getResult('image_12'));
    image_13 = new createjs.Bitmap(queue.getResult('image_13'));
    image_14 = new createjs.Bitmap(queue.getResult('image_14'));
    image_15 = new createjs.Bitmap(queue.getResult('image_15'));
    image_16 = new createjs.Bitmap(queue.getResult('image_16'));
    image_17 = new createjs.Bitmap(queue.getResult('image_17'));
    image_18 = new createjs.Bitmap(queue.getResult('image_18'));
    image_19 = new createjs.Bitmap(queue.getResult('image_19'));
    image_20 = new createjs.Bitmap(queue.getResult('image_20'));
    image_21 = new createjs.Bitmap(queue.getResult('image_21'));
    image_22 = new createjs.Bitmap(queue.getResult('image_22'));
    image_23 = new createjs.Bitmap(queue.getResult('image_23'));
    image_24 = new createjs.Bitmap(queue.getResult('image_24'));
    image_25 = new createjs.Bitmap(queue.getResult('image_25'));
    image_26 = new createjs.Bitmap(queue.getResult('image_26'));
    image_27 = new createjs.Bitmap(queue.getResult('image_27'));
    image_28 = new createjs.Bitmap(queue.getResult('image_28'));
    image_29 = new createjs.Bitmap(queue.getResult('image_29'));
    image_30 = new createjs.Bitmap(queue.getResult('image_30'));
    image_31 = new createjs.Bitmap(queue.getResult('image_31'));
    image_32 = new createjs.Bitmap(queue.getResult('image_32'));
    image_33 = new createjs.Bitmap(queue.getResult('image_33'));
    image_34 = new createjs.Bitmap(queue.getResult('image_34'));
    image_35 = new createjs.Bitmap(queue.getResult('image_35'));
    image_36 = new createjs.Bitmap(queue.getResult('image_36'));
    image_37 = new createjs.Bitmap(queue.getResult('image_37'));
    image_38 = new createjs.Bitmap(queue.getResult('image_38'));
    image_39 = new createjs.Bitmap(queue.getResult('image_39'));
    image_40 = new createjs.Bitmap(queue.getResult('image_40'));
    image_41 = new createjs.Bitmap(queue.getResult('image_41'));
    image_42 = new createjs.Bitmap(queue.getResult('image_42'));
    image_43 = new createjs.Bitmap(queue.getResult('image_43'));
    image_44 = new createjs.Bitmap(queue.getResult('image_44'));
    image_45 = new createjs.Bitmap(queue.getResult('image_45'));

    // music01 = new createjs.Sound.registerSound(queue.getResult('music01'));

    container.addChild(image_1);
    container.addChild(image_2);
    container.addChild(image_3);
    container.addChild(image_4);
    container.addChild(image_5);
    container.addChild(image_6);
    container.addChild(image_7);
    container.addChild(image_8);
    container.addChild(image_9);
    container.addChild(image_10);
    container.addChild(image_11);
    container.addChild(image_12);
    container.addChild(image_13);
    container.addChild(image_14);
    container.addChild(image_15);
    container.addChild(image_16);
    container.addChild(image_17);
    container.addChild(image_18);
    container.addChild(image_19);
    container.addChild(image_20);
    container.addChild(image_21);
    container.addChild(image_22);
    container.addChild(image_23);
    container.addChild(image_24);
    container.addChild(image_25);
    container.addChild(image_26);
    container.addChild(image_27);
    container.addChild(image_28);
    container.addChild(image_29);
    container.addChild(image_30);
    container.addChild(image_31);
    container.addChild(image_32);
    container.addChild(image_33);
    container.addChild(image_34);
    container.addChild(image_35);
    container.addChild(image_36);
    container.addChild(image_37);
    container.addChild(image_38);
    container.addChild(image_39);
    container.addChild(image_40);
    container.addChild(image_41);
    container.addChild(image_42);
    container.addChild(image_43);
    container.addChild(image_44);
    container.addChild(image_45);
    image_2.visible = false;
    image_3.visible = false;
    image_4.visible = false;
    image_5.visible = false;
    image_6.visible = false;
    image_7.visible = false;
    image_8.visible = false;
    image_9.visible = false;
    image_10.visible = false;
    image_11.visible = false;
    image_12.visible = false;
    image_13.visible = false;
    image_14.visible = false;
    image_15.visible = false;
    image_16.visible = false;
    image_17.visible = false;
    image_18.visible = false;
    image_19.visible = false;
    image_20.visible = false;
    image_21.visible = false;
    image_22.visible = false;
    image_23.visible = false;
    image_24.visible = false;
    image_25.visible = false;
    image_26.visible = false;
    image_27.visible = false;
    image_28.visible = false;
    image_29.visible = false;
    image_30.visible = false;
    image_31.visible = false;
    image_32.visible = false;
    image_33.visible = false;
    image_34.visible = false;
    image_35.visible = false;
    image_36.visible = false;
    image_37.visible = false;
    image_38.visible = false;
    image_39.visible = false;
    image_40.visible = false;
    image_41.visible = false;
    image_42.visible = false;
    image_43.visible = false;
    image_44.visible = false;
    image_45.visible = false;
  }
}
