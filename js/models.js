define(['underscore', 'backbone', 'd3js/d3.v3.min'], function(_, Backbone, d3) {
    // 球団の成績のmodel
    var Datum = Backbone.Model.extend({

        defaults: {
            'チーム': 'test',
            '打率': 0.0,
            '得点': 0,
            '本塁打': 0,
            'OPS': .0,
            'color': '#000'
        }
     });

     var Data = Backbone.Collection.extend({
         model: Datum,
         
         // 初期化。
         initialize: function() {
             console.log('init');
             console.log(this);
         }  });

     return {
         'Datum': Datum,
         'Data': Data
     };
});