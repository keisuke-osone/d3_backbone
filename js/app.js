define(['models', 'underscore', 'backbone', 'd3js/d3.v3.min'], function(chartModel, _, Backbone, d3) {

    // グラフの下地
    var ChartBase = Backbone.View.extend({
        defaults: {
            xAttr: 'x',
            yAttr: 'y',
            margin: {top: 20, right: 20, bottom: 30, left: 40}
        },
        remove: function () {
            d3.select(this.el).selectAll('.graph-area').remove();
        },
        render: function () {
            metrics = [];
            for(key in json.results[0]){
                if (key !== 'color' && key !== 'チーム' && key !== '得点') {
                    metrics.push(key);
                }
            }

            var margin = this.defaults.margin;
            this.width = this.$el.width() - margin.left - margin.right;
            this.height = 400 - margin.top - margin.bottom;

            graphArea = d3.select(this.el).append('div')
                .attr('class', 'graph-area');

            this.svg = graphArea.append('h1')
                .text('グラフ x:' + this.options.xAttr + ', y:' + this.options.yAttr);

            var transrate = this;
            this.svg = graphArea.selectAll('li')
                .data(metrics)
                .enter()
                .append('div')
                .on('click', function (d) {
                    transrate.remove();
                    transrate.xAttr(d);
                    transrate.render();
                })
                .text(function (d) {return d});

            this.svg = graphArea.append('svg')
                .attr('width', this.width + margin.left + margin.right)
                .attr('height', this.height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            this.scales = {
                x: this.getXScale(),
                y: this.getYScale()
            };
            this.renderAxes();
            this.renderData();

            return this;
        }
    });

    // 散布図
    var Plot = ChartBase.extend({

        options: _.defaults({
            barPadding: 0.1,
        }, ChartBase.prototype.defaults),

        xAttr: function (attr) {
            this.options.xAttr = attr
        },

        yAttr: function (attr) {
            this.options.yAttr = attr
        },

        color: function (attr) {
            this.options.color = attr
        },

        getXScale: function() {
            var padding = this.options.barPadding;
            
            return d3.scale.linear()
                .rangeRound([this.height, 0])
                .domain([d3.max(this.collection.pluck(this.options.xAttr)), d3.min(this.collection.pluck(this.options.xAttr))]);
        },

        getYScale: function() {
            console.log(this.collection);
            return d3.scale.linear()
                .rangeRound([this.height, 0])
                .domain([d3.min(this.collection.pluck(this.options.yAttr)), d3.max(this.collection.pluck(this.options.yAttr))]);
        },

        renderAxes: function() {
            var xAxis = d3.svg.axis()
            .scale(this.scales.x)
            .orient('bottom');

            var yAxis = d3.svg.axis()
            .scale(this.scales.y)
            .orient('left')

            // x軸のフォーマット決定
            // x軸の作成
            this.svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis);

            // y軸の作成
            this.svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
        },

        renderData: function() {
            var chart = this,
            x = this.scales.x,
            y = this.scales.y;
            data = this.mapData();

            this.svg.selectAll('.circle')
                .data(data) 
                .enter().append('circle')
                .attr('class', 'circle')
                .attr('r', 10)
                .attr('cx', function(d) { return x(d.x); })
                .attr('cy', function(d) { return chart.height; })
                .attr('height', function(d) { return 0; })
                .transition()
                .delay(function(d, i) {
                    return  i * 100;
                })
                .duration(1000)
                .ease('bounce')
                .attr('cx', function(d) { return x(d.x); })
                .attr('cy', function(d) { return y(d.y); })
                .attr('fill', function(d){ console.log(d); return d.color})
                .attr('height', function(d) { return chart.height - y(d.y); });
        },
        mapData: function () {
            var dataset = [];

            xAtt = this.options.xAttr
            yAtt = this.options.yAttr

            this.collection.each(function(d) {
                array = {
                    x: d.attributes[xAtt],
                    y: d.attributes[yAtt],
                    color: d.attributes.color
                }
                dataset.push(array);
            });
            console.log(dataset);
            return dataset;
        }
    });

    return {
        'Plot': Plot
    };
});