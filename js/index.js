class Chart {
    constructor(){
        this._width = 600;
        this._height = 550;
        this._margins = {top:30, left:30, right:30, bottom:30};
        this._data = [];
        this._scaleX = null;
        this._scaleY = null;
        this._colors = d3.scaleOrdinal(d3.schemeCategory10);
        this._box = null;
        this._svg = null;
        this._body = null;
        this._padding = {top:10, left:10, right:10, bottom:10};
    }

    width(w){
        if (arguments.length === 0) return this._width;
        this._width = w;
        return this;
    }

    height(h){
        if (arguments.length === 0) return this._height;
        this._height = h;
        return this;
    }

    margins(m){
        if (arguments.length === 0) return this._margins;
        this._margins = m;
        return this;
    }

    data(d){
        if (arguments.length === 0) return this._data;
        this._data = d;
        return this;
    }

    scaleX(x){
        if (arguments.length === 0) return this._scaleX;
        this._scaleX = x;
        return this;
    }

    scaleY(y){
        if (arguments.length === 0) return this._scaleY;
        this._scaleY = y;
        return this;
    }

    svg(s){
        if (arguments.length === 0) return this._svg;
        this._svg = s;
        return this;
    }

    body(b){
        if (arguments.length === 0) return this._body;
        this._body = b;
        return this;
    }

    box(b){
        if (arguments.length === 0) return this._box;
        this._box = b;
        return this;
    }

    getBodyWidth(){
        let width = this._width - this._margins.left - this._margins.right;
        return width > 0 ? width : 0;
    }

    getBodyHeight(){
        let height = this._height - this._margins.top - this._margins.bottom;
        return height > 0 ? height : 0;
    }

    padding(p){
        if (arguments.length === 0) return this._padding;
        this._padding = p;
        return this;
    }

    defineBodyClip(){

        this._svg.append('defs')
                 .append('clipPath')
                 .attr('id', 'clip')
                 .append('rect')
                 .attr('width', this.getBodyWidth() + this._padding.left + this._padding.right)
                 .attr('height', this.getBodyHeight() + this._padding.top  + this._padding.bottom)
                 .attr('x', -this._padding.left)
                 .attr('y', -this._padding.top);
    }

    render(){
        return this;
    }

    bodyX(){
        return this._margins.left;

    }

    bodyY(){
        return this._margins.top;
    }

    renderBody(){
        if (!this._body){
            this._body = this._svg.append('g')
                            .attr('class', 'body')
                            .attr('transform', 'translate(' + this.bodyX() + ',' + this.bodyY() + ')')
                            .attr('clip-path', "url(#clip)");
        }

        this.render();
    }

    renderChart(){
        if (!this._box){
            this._box = d3.select('.rad')
                            .append('div')
                            .attr('class','box');
        }
        // if (!this._box){
        //     this._box = d3.select('rad')
        //                     .append('div')
        //                     .attr('class','box');
        // }
        // if (!this._box){
        //     this._box = d3.select('.box');
        // }

        if (!this._svg){
            this._svg = this._box.append('svg')
                            .attr('width', this._width)
                            .attr('height', this._height);
        }

        this.defineBodyClip();

        this.renderBody();
    }

}


console.log('index3.js')
function renderRadarChart(path,title_dyx) {
    d3.csv(path).then(function(data_new){
        console.log(data_new)
        const data =data_new.slice(0, 5)
        console.log(data)
    /* ----------------------------配置参数------------------------  */
    const chart = new Chart();
    const config = {
        margins: {top: 50, left: 30, bottom: 30, right: 30},
        textColor: 'black',
        title: title_dyx,
        radius: 200,
        animateDuration: 1000,
        tickNum: 4,
        axisfillColor: ['#FEF8EF','#DBE9B7'],//底面颜色
        axisStrokeColor: 'gray',
        pointsColor: 'white',
        pointsSize: 3
    }

    chart.margins(config.margins);
    
    /* ----------------------------尺度转换------------------------  */
    // 0-10
    chart.scaleRadius = d3.scaleLinear()
                            .domain([0, 2])
                            .range([0, config.radius])

    /* ----------------------------渲染坐标轴------------------------  */
    chart.renderAxes = function(){

        // ----渲染背景多边形-----
        const points = getPolygonPoints(data.length, config.radius, config.tickNum);

        const axes = chart.body().append('g')
                                .attr('class', 'axes')
                                .attr('transform', 'translate(' + chart.getBodyWidth()/2 + ',' + chart.getBodyHeight()/2 + ')')
                                .selectAll('axis')
                                .data(points);
            
              axes.enter()
                    .append('polygon')
                    .attr('class', 'axis')
                  .merge(axes)
                    .attr('points', (d) => d)
                    .attr('fill', (d,i) => i<2?config.axisfillColor[0]:config.axisfillColor[1])
                    .attr('stroke-width', (d, i) => i === 2 ? 3 : 1) //加粗1的线
                    // .attr('fill', (d,i) => i%2 === 0?config.axisfillColor[0]:config.axisfillColor[1])
                    .attr('stroke', config.axisStrokeColor)
                    .attr('stroke', (d, i) => i === 2? '#94A684':'gray'); // 将索引为1的线颜色改为绿色
            
              axes.exit()
                    .remove();

        // ----渲染对角线-----
        const line = d3.line();

        const outerPoints = getOuterPoints(points[0]);
        
        const lines = d3.select('.axes')
                    .selectAll('.line')
                    .data(outerPoints);
            
              lines.enter()
                     .append('path')
                     .attr('class', 'line')
                   .merge(lines)
                     .attr('d', (d) => {
                         return line([
                             [0, 0],
                             [d[0], d[1]]
                         ]);
                     })
                     .attr('stroke', config.axisStrokeColor);
            
                lines.exit()
                     .remove();

        //生成背景多边形的顶点             
        function getPolygonPoints(vertexNum, outerRadius, tickNum){
            const points = [];
            let polygon;

            if (vertexNum < 3) return points;

            const anglePiece = Math.PI * 2 / vertexNum;
            const radiusReduce = outerRadius / tickNum;

            for (let r=outerRadius; r>0; r-=radiusReduce){
                polygon = [];
            
                for (let i=0; i<vertexNum; i++){
                    polygon.push(
                        Math.sin(i * anglePiece) * r + ',' +Math.cos(i * anglePiece) * r 
                    );
                }

                points.push(polygon.join(' '));
            }
            
            return points;
        }

        //得到最外层多边形的顶点
        function getOuterPoints(outerPoints){
             const points = outerPoints.split(' ').map((d) => d.split(','));
             return points;
        }
    }

    /* ----------------------------渲染文本标签------------------------  */
    chart.renderText = function(){

        const texts = d3.select('.axes')
                        .selectAll('.label')
                        .data(data);
              
              texts.enter()
                      .append('text')
                      .attr('class', 'label')
                   .merge(texts)
                      .attr('x', (d,i) => Math.sin(i * Math.PI * 2 / data.length) * (config.radius + 20))
                      .attr('y', (d,i) => Math.cos(i * Math.PI * 2 / data.length) * (config.radius + 20))
                      .attr('text-anchor', (d,i) => computeTextAnchor(data,i))
                      .attr('dy', 6.5)       //由于text-anchor属性在垂向上对齐文字底部，故需要使其对齐文字中部
                      .text((d) => d.subject);

        function computeTextAnchor(data, i){
            if (data.length < 3) return;

            const angle = i * 360 / data.length;

            if ( angle === 0 || Math.abs(angle - 180) < 0.01 ){
                return 'middle';
            }else if (angle > 180){
                return 'end'
            }else{
                return 'start'
            }
        }

    }
    
    /* ----------------------------渲染数据多边形------------------------  */
    chart.renderPolygons = function(){
        const newData = handleData(data_new);
        console.log(newData)
        const color_lst_dyx=data_new[5];
        const polygons = chart.body().selectAll('.polygons')
                                .data(newData);
            
              polygons.enter()
                        .append('g')
                        .attr('class', (d) => 'g-' + d.person)
                        .attr('transform', 'translate(' + chart.getBodyWidth()/2 + ',' + chart.getBodyHeight()/2 + ')')
                        .append('polygon')
                        .attr('class', 'polygon')
                    .merge(polygons)
                        .attr('fill',  (d,i) => color_lst_dyx[d.person]+'1A') // 添加填充色，这里假设使用和边框相同的颜色
                        // console.log((d,i) => color_lst_dyx[d.person])
                        .attr('stroke', (d,i) => color_lst_dyx[d.person])
                        // .attr('stroke', color_dyx)
                        .attr('stroke-width', '2')
                        .attr('points', (d,i) => {
                            // console.log(d.person);
                            const miniPolygon = [];
                            d.forEach(() => {
                                miniPolygon.push("0,0")
                            });
                            return miniPolygon.join(' ');
                        })
                        .transition().duration(config.animateDuration)
                        .attr('points', generatePolygons);
              
              polygons.exit()
                        .remove();
                        

        //处理数据，转化数据结构，方便渲染
        function handleData(data){
            const newData = [];
            const namecitydyx = [];
            Object.keys(data[0]).forEach((key) => {
                if (key !== 'subject'){
                    const item = [];
                    item.person = key;
                    newData.push(item);
                    namecitydyx.push(key)
                }
                
            });

            data.forEach((d) => {
                // console.log(d)
                newData.forEach((item,i) => {
                    // item.push([d.subject, d[namecitydyx[i]]]);
                    // console.log(d.subject)
                    if(d.subject !=='color'){
                    item.push([d.subject, d[namecitydyx[i]]]);}
                    // console.log(namecitydyx[i])
                });
            });

            return newData;
        }

        //计算多边形的顶点并生成顶点圆圈
        function generatePolygons(d,index){
            const points = [];
            const anglePiece = Math.PI * 2 / d.length; 

            d.forEach((item,i) => {
                const x = Math.sin(i * anglePiece ) * chart.scaleRadius(item[1]);
                const y = Math.cos(i * anglePiece) * chart.scaleRadius(item[1]);

                //添加交点圆圈
                d3.select('.g-' + d.person)
                    .append('circle')
                    .attr('class', 'point-' + d.person)
                    .attr('fill', config.pointsColor)
                    .attr('stroke', (d,i) => color_lst_dyx[d.person])
                    .attr('cx', 0)
                    .attr('cy', 0)
                    .attr('r', config.pointsSize)
                    .transition().duration(config.animateDuration)
                    .attr('cx', x)
                    .attr('cy', y)

                points.push(x + ',' + y);
            });

            return points.join(' ');
        }
        
    }

    /* ----------------------------渲染图标题------------------------  */
    chart.renderTitle = function(){
        chart.svg().append('text')
                .classed('title', true)
                .attr('x', chart.width()/2)
                .attr('y', 10)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);
    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){
        d3.selectAll('.polygon')
            .on('mouseover', function(event, d){
                const position = d3.pointer(event, chart.svg().node());
    
                d3.select(this)
                    .attr('stroke-width', '4');
    
                chart.svg()
                    .append('text')
                    .classed('tip', true)
                    .attr('x', position[0]+5)
                    .attr('y', position[1])
                    .attr('fill', config.textColor)
                    .text(d.person);
            })
            .on('mouseleave', function(){
                d3.select(this)
                    .attr('stroke-width', '2');
    
                d3.select('.tip').remove();
            });
    }
    
    chart.render = function(){

        chart.renderTitle();

        chart.renderAxes();

        chart.renderText();

        chart.renderPolygons();

        chart.addMouseOn();

    }
    chart.renderChart();      
});
}

// 调用函数并传入数据路径
// let dataPath_dyx = './data/dataBJ.csv';
let dataPath_dyx = './data/data.csv';
let color_dyx ='#F9713C';
let title_dyx = 'top15热门迁入城市的各类条件雷达图'

renderRadarChart(dataPath_dyx,title_dyx);
// 更新雷达图函数
function updateRadarChart(data,title_dyx) {
    renderRadarChart(data,title_dyx);
}
console.log('flag1')
// 添加按钮点击事件监听器
d3.select("#data0-button").on("click", function() {
    console.log('按下按钮0')
    dataPath_dyx = './data/data.csv';
    color_dyx = '#F9713C';
    title_dyx = '全部数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
});
// 添加按钮点击事件监听器
d3.select("#data1-button").on("click", function() {
    console.log('按下按钮1')
    dataPath_dyx = './data/dataBJ.csv';
    color_dyx = '#F9713C';
    title_dyx = '北京数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
});

// 添加按钮点击事件监听器
d3.select("#data2-button").on("click", function() {
    console.log('按下按钮2')
    dataPath_dyx = './data/dataSH.csv';
    color_dyx = '#B3E4A1';
    title_dyx = '上海数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
});
// 添加按钮点击事件监听器
d3.select("#data3-button").on("click", function() {
    console.log('按下按钮3')
    dataPath_dyx = './data/dataGZ.csv';
    color_dyx = '#EEC566';
    title_dyx = '广州数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
});