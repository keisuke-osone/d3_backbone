requirejs.config({
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'underscore': {
            exports: '_'
        },
        'backbone': {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'd3js/d3.v3.min' : {
            exports : 'd3'
        }
    }
});

// ここのデータを非同期で欲しい <- 設定ファイルから
var list = ['baseball'];

// 非同期でアクセスして持ってくる
var json = {
    'name': 'baseball',
    'results': [
            {
                'チーム': '巨人',
                '打率': 0.257,
                '得点': 596,
                '本塁打': 144,
                'OPS': .714,
                'color': '#F37A02'
            },
            {
                'チーム': '阪神',
                '打率': 0.264,
                '得点': 599,
                '本塁打': 55,
                'OPS': .712,
                'color': '#ffdd00'
            },
            {
                'チーム': '広島',
                '打率': 0.272,
                '得点': 649,
                '本塁打': 153,
                'OPS': .760,
                'color': '#D6171A'
            },
            {
                'チーム': '中日',
                '打率': 0.258,
                '得点': 570,
                '本塁打': 87,
                'OPS': .691,
                'color': '#1E35C7'
            },
            {
                'チーム': 'DeNA',
                '打率': 0.253,
                '得点': 568,
                '本塁打': 121,
                'OPS': .701,
                'color': '#0282C5'
            },
            {
                'チーム': 'ヤクルト',
                '打率': 0.279,
                '得点': 667,
                '本塁打': 139,
                'OPS': .754,
                'color': '#4A403B'
            }
        ]
    };


// ビューのモジュールを読み込んでアプリケーションを開始
require(['app', 'models'], function(app, models) {
    keys = [];
    for(key in json.results[0]){
        keys.push(key);
    }
    console.log(keys);

    for (var i = 0 ; i < list.length; i++) {
        console.log(json.results);

        // 挿入する箇所
        elName = '#' +list[i] + '-graph #' + list[i] + '-contents';
        
        var App = new app.Plot({
            el: elName,
            metrics: keys,
            collection: new models.Data(json.results)
        });
        
        // 最初のグラフ
        App.xAttr('OPS');
        App.yAttr('得点');
        
        // 描画処理
        App.render();
    }
});
