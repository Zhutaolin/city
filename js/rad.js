class Chart {
    constructor(){
        this._width = 700;
        this._height = 600;
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
        margins: {top: 10, left: 10, bottom: 10, right: 10},
        textColor: 'black',
        title: title_dyx,
        radius: 220,
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
                //第一个图形
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
                // .attr('stroke', (d,i) => color_lst_dyx[d.person])
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

    // 添加第二个图形
    const secondPolygons = chart.body().selectAll('.secondPolygons')
    .data(newData);

    secondPolygons.enter()
    .append('g')
    .attr('class', (d) => 'second-g-' + d.person)
    .attr('transform', 'translate(' + chart.getBodyWidth()/2 + ',' + chart.getBodyHeight()/2 + ')')
    .append('polygon')
    .attr('class', 'sec-polygon')
    .merge(secondPolygons)
    .attr('fill','none') // 添加填充色，这里假设使用和边框相同的颜色
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

    secondPolygons.exit()
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
                .attr('y', 0)
                .attr('dy', '2em')
                .text(config.title)
                .attr('fill', config.textColor)
                .attr('text-anchor', 'middle')
                .attr('stroke', config.textColor);
    }

    /* ----------------------------绑定鼠标交互事件------------------------  */
    chart.addMouseOn = function(){
        d3.selectAll('.sec-polygon')
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
                //判断大小多少
                const less = [];
                const more = [];
                const kong = [];

                for (let i = 0; i < d.length; i++) {
                    if (parseFloat(d[i][1])==0) {
                        kong.push(d[i]);
                    }else if(parseFloat(d[i][1]) < 1){
                        less.push(d[i]);
                    }
                    else {
                        more.push(d[i]);
                    }
                }
                // 输出 more 列表
                let Output ='';
                
                if(more.length > 0){
                    for (let i = 0; i < more.length; i++) {
                        Output += '【'+more[i][0] + "】 ";
                    }
                    Output += '大于全国平均'+ "<br/>"
                }
                if(less.length > 0){
                    for (let i = 0; i < less.length; i++) {
                        Output += '【'+less[i][0] + "】 ";
                    }
                    Output += '小于全国平均'+ "<br/>"
                }
                
                console.log(Output);
                                
                var [x, y] = d3.pointer(event);
                // 添加tooltip
                tooltipdyxrad.html(d.person+ "<br/>" + Output )
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 20) + "px")
                            .style("display", "block");
            })
            .on('mouseleave', function(){
                d3.select(this)
                    .attr('stroke-width', '2');
    
                d3.select('.tip').remove();
                tooltipdyxrad.style("display", "none");

            });
    }
    var tooltipdyxrad = d3.select("body").append("div")
                        .attr("class", "tooltipdyxrad")
    
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
let title_dyx = '全部数据'

renderRadarChart(dataPath_dyx,title_dyx);
// 更新雷达图函数
function updateRadarChart(data,title_dyx) {
    renderRadarChart(data,title_dyx);
}
var butt;
console.log('flag1')
// 添加按钮点击事件监听器
d3.select("#data0-button").on("click", function() {
    butt='all'
    console.log('按下按钮0')
    dataPath_dyx = './data/data.csv';
    color_dyx = '#F9713C';
    title_dyx = '全部数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
    filterData(butt);
});
// 添加按钮点击事件监听器
d3.select("#data1-button").on("click", function() {
    butt='BJ';
    console.log('按下按钮1')
    dataPath_dyx = './data/dataBJ.csv';
    color_dyx = '#F9713C';
    title_dyx = '北京数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
    filterData(butt);
});

// 添加按钮点击事件监听器
d3.select("#data2-button").on("click", function() {
    butt='SH';
    console.log('按下按钮2');
    dataPath_dyx = './data/dataSH.csv';
    color_dyx = '#B3E4A1';
    title_dyx = '上海数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
    filterData(butt);
});
// 添加按钮点击事件监听器
d3.select("#data3-button").on("click", function() {
    butt='GZ'
    console.log('按下按钮3')
    dataPath_dyx = './data/dataGZ.csv';
    color_dyx = '#EEC566';
    title_dyx = '广州数据';
    d3.selectAll('.box').remove();
    updateRadarChart(dataPath_dyx,title_dyx);
    filterData(butt)
});
var data_dyx = [
    {"category": "\u8d64\u5cf0","value1": 0.73890887,"value2": 0.711935069,"value3": 0.84723719,"value4": 1.396770833,"value5": 1.648618185,"BSG": "BJ"},
    {"category": "\u5927\u540c","value1": 0.764842063,"value2": 0,"value3": 0.57009193,"value4": 1.039375,"value5": 0.952800567,"BSG": "BJ"},
    {"category": "\u5fb7\u5dde","value1": 0.736807846,"value2": 0.703333382,"value3": 0.767962314,"value4": 1.16625,"value5": 1.398303695,"BSG": "BJ"},
    {"category": "\u846b\u82a6\u5c9b","value1": 0.176414359,"value2": 0,"value3": 0.608164215,"value4": 1.070104167,"value5": 0.909556443,"BSG": "BJ"},
    {"category": "\u6d4e\u5357","value1": 1.218329438,"value2": 1.228411543,"value3": 1.357931162,"value4": 1.348229167,"value5": 1.009084522,"BSG": "BJ"},
    {"category": "\u961c\u9633","value1": 0.687025394,"value2": 0,"value3": 0.843720225,"value4": 0.990104167,"value5": 1.468398038,"BSG": "SH"},
    {"category": "\u8fde\u4e91\u6e2f","value1": 0.916343988,"value2": 0.8558724,"value3": 0.908938422,"value4": 1.2453125,"value5": 0.992198245,"BSG": "SH"},
    {"category": "\u516d\u5b89","value1": 0.699136453,"value2": 0,"value3": 0.742642173,"value4": 1.4846875,"value5": 1.089940535,"BSG": "SH"},
    {"category": "\u5bbf\u8fc1","value1": 0.823624641,"value2": 0,"value3": 0.870021174,"value4": 1.174375,"value5": 0.644915153,"BSG": "SH"},
    {"category": "\u6dee\u5b89","value1": 0.987609942,"value2": 0.807313373,"value3": 0.929826612,"value4": 0.801354167,"value5": 0.848582164,"BSG": "SH"},
    {"category": "\u8d63\u5dde","value1": 0.319495867,"value2": 0,"value3": 0.772948925,"value4": 1.245208333,"value5": 1.790345468,"BSG": "GZ"},
    {"category": "\u63ed\u9633","value1": 0.681525943,"value2": 0,"value3": 0.73791967,"value4": 1.496979167,"value5": 0.843132473,"BSG": "GZ"},
    {"category": "\u6885\u5dde","value1": 0.742711981,"value2": 0.790704551,"value3": 0.757093163,"value4": 1.440104167,"value5": 1.203695097,"BSG": "GZ"},
    {"category": "\u6e5b\u6c5f","value1": 0.770292268,"value2": 0.76809178,"value3": 0.821424016,"value4": 1.356875,"value5": 1.325368985,"BSG": "GZ"},
    {"category": "\u8302\u540d","value1": 0.755284723,"value2": 0.766254828,"value3": 0.804459729,"value4": 1.1359375,"value5": 0.673001539,"BSG": "GZ"}
    ];
var margindyx = {top: 20, right: 20, bottom: 30, left: 40};
var widthdyx = 600 - margindyx.left - margindyx.right;
var heightdyx = 400 - margindyx.top - margindyx.bottom;

function updata(data,butt){
    // 创建x和y比例尺
    var xdyx = d3.scaleBand()
      .range([0, widthdyx])
      .padding(0.1)
      .domain(data.map(function(d) { return d.category; }));

    var ydyx = d3.scaleLinear()
      .range([heightdyx, 0])
      // .domain([0, d3.max(data, function(d) { return d.value1 + d.value2 + d.value3; })]);
      .domain([0, 2]);

    // 创建SVG元素
    var svgdyx = d3.select("#chart")
      .append("g")
      .attr("transform", "translate(" + margindyx.left + "," + margindyx.top + ")");

    // 添加X轴
    svgdyx.append("g")
      .attr("class", "axis axis-x")
      .attr("transform", "translate(0," + heightdyx + ")")
      .call(d3.axisBottom(xdyx));

    // 添加Y轴
    svgdyx.append("g")
      .attr("class", "axis axis-y")
      .call(d3.axisLeft(ydyx).ticks(5));

    // 添加柱状图
    var categoriesdyx = Object.keys(data[0]).slice(1,-1); 
    console.log(categoriesdyx)

  // 定义颜色比例尺
  var colorMappingdyx = {
    'BJ': '#95AFCA',
    'SH': '#ED9A9B',
    'GZ': '#F7BB80'
  };
  var colordyx = d3.scaleOrdinal()
    .domain(Object.keys(colorMappingdyx))  // 使用字典的键作为域
    .range(Object.values(colorMappingdyx));  // 使用字典的值作为颜色范围
  var cityMapping={
        'value1': '收入',
        'value2': '消费',
        'value3': '房价',
        'value4': '就业',
        'value5': '医疗',
      };
  var cityMapping2={
    'BJ': '北京',
    'SH': '上海',
    'GZ': '广州'
  };

// 定义纹理
var patterns = {
  "value1": "patternLines",
  "value2": "patternDots",
  "value3": "patternWaves",
  "value4": "patternTriangles",
  "value5": "noPattern"
};
// 添加五种不同的纹理
var defs = svgdyx.append("defs");

// 定义直线纹理
var patternLines = defs.append("pattern")
  .attr("id", "patternLines")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 4)
  .attr("height", 4);
patternLines.append("path")
  .attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
  .style("stroke", "gray")
  .style("stroke-width", 1);

// 定义点纹理
var patternDots = defs.append("pattern")
  .attr("id", "patternDots")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 6)
  .attr("height", 6);
patternDots.append("circle")
  .attr("cx", 3)
  .attr("cy", 3)
  .attr("r", 1.5)
  .style("stroke", "gray")
  .style("fill", "none") // 将填充颜色改为灰色
  .style("stroke-width", 1);

// 定义波浪线纹理
var patternWaves = defs.append("pattern")
  .attr("id", "patternWaves")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 4)
  .attr("height", 4);
patternWaves.append("path")
  .attr("d", "M0,5 Q2.5,0 5,5 T10,5")
  .style("stroke", "gray")
  .style("stroke-width", 1)
  .style("fill", "none");

var patternTriangles = defs.append("pattern")
  .attr("id", "patternTriangles")
  .attr("patternUnits", "userSpaceOnUse")
  .attr("width", 10) // 增大宽度以增加空隙
  .attr("height", 10); // 增大高度以增加空隙
patternTriangles.append("path")
  .attr("d", "M3,0 L0,6 L6,6 Z")
  .style("stroke", "gray")
  .style("stroke-width", 1)
  .style("fill", "none"); // 将填充颜色改为灰色


  // 更新选择器以设置颜色
  svgdyx.selectAll(".bardyx")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + xdyx(d.category) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return categoriesdyx.map(function(key) { return {key: key, value: d[key], BSG: d.BSG,category:d.category}; }); })
    .enter().append("rect")
    .attr("class", "bardyx")
    .attr("x", function(d) { return xdyx.bandwidth() / categoriesdyx.length * categoriesdyx.indexOf(d.key); })
    .attr("y", function(d) { return ydyx(d.value); })
    .attr("width", xdyx.bandwidth() / categoriesdyx.length)
    .attr("height", function(d) { return heightdyx - ydyx(d.value); })
    .attr("fill", function(d) { return colordyx(d.BSG); })// 使用颜色比例尺来设置颜色

  // 创建柱状图并添加纹理
svgdyx.selectAll("rect.wen")
  .data(data)
  .enter().append("g")
  .attr("transform", function(d) { return "translate(" + xdyx(d.category) + ",0)"; })
  .selectAll("rect")
  .data(function(d) { return categoriesdyx.map(function(key) { return {key: key, value: d[key], BSG: d.BSG,category:d.category}; }); })
  .enter().append("rect")
  .attr("class", "wen")
  .attr("x", function(d) { return xdyx.bandwidth() / categoriesdyx.length * categoriesdyx.indexOf(d.key); })
  .attr("y", function(d) { return ydyx(d.value); })
  .attr("width", xdyx.bandwidth() / categoriesdyx.length)
  .attr("height", function(d) { return heightdyx - ydyx(d.value); })
  .style("fill", function(d) {return "url(#" + patterns[d.key] + ")"});
  svgdyx.selectAll("rect.bardyx")
  .on("mouseover", function(event, d) {
        var [x, y] = d3.pointer(event);
        var categoryValue = d.category;
        // 添加tooltip
        tooltipdyx.html("城市: " + categoryValue + "<br/>" + "指标: " + cityMapping[d.key] + "<br/>" + "数值: " + d.value + "<br/>" + "来源城市: " + cityMapping2[d.BSG])
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px")
                  .style("display", "block");
    })
    .on("mouseout", function(d) {

        // 隐藏tooltip
        tooltipdyx.style("display", "none");
    });
    svgdyx.selectAll("rect.wen")
  .on("mouseover", function(event, d) {
            // 保存当前选中的 bar
        var currentBar = d3.select(this);
        // 修改当前 bar 的颜色
        currentBar.style("fill", "#B0C5A4");
        var [x, y] = d3.pointer(event);
        var categoryValue = d.category;
        // 添加tooltip
        tooltipdyx.html("城市: " + categoryValue + "<br/>" + "指标: " + cityMapping[d.key] + "<br/>" + "数值: " + d.value + "<br/>" + "来源城市: " + cityMapping2[d.BSG])
                  .style("left", (event.pageX + 10) + "px")
                  .style("top", (event.pageY - 20) + "px")
                  .style("display", "block");
    })
    .on("mouseout", function(d) {
        d3.select(this).style("fill", function(d) {return "url(#" + patterns[d.key] + ")";
  })
        // 隐藏tooltip
        tooltipdyx.style("display", "none");
    });


    var tooltipdyx = d3.select("body").append("div")
                    .attr("class", "tooltipdyx")
  // 添加参考线
svgdyx.append("line")
    .attr("x1", 0)
    .attr("y1", ydyx(1)) // 在y=1处画线
    .attr("x2", widthdyx)
    .attr("y2", ydyx(1))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "4");

// 添加参考线标签
svgdyx.append("text")
    .attr("x", 10)
    .attr("y", ydyx(1) - 10) // 稍微偏移一下以避免与参考线重叠
    .text("全国平均水平")
    .attr("text-anchor", "start") // 左对齐
    .attr("font-family", "sans-serif") // 字体设置
    .attr("font-size", "12px") // 字体大小设置
    .attr("fill", "black") // 文字颜色设置;
  console.log('选择bar')
  console.log(data)

  // 添加图例
  var legenddyx = svgdyx.selectAll(".legend")
    .data(categoriesdyx)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
  console.log('图例')
  legenddyx.append("text")
    .attr("x", widthdyx - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) { return cityMapping[d]; });

  legenddyx.append("rect")
    .attr("x", widthdyx - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("fill", function(d) {return "url(#" + patterns[d] + ")"});
}
updata(data_dyx,'all')

function clearBar() {
    // 清除坐标轴
    d3.select(".axis-x").remove();
    d3.select(".axis-y").remove();

    // 清除柱状图
    d3.selectAll(".wen").remove();
    d3.selectAll(".bardyx").remove();

    // 清除图例
    d3.selectAll(".legend").remove();
  }
function filterData(butt) {
    var formdyx = document.getElementById('columnForm');
    var selectedColumns = Array.from(formdyx.elements).filter(el => el.checked).map(el => el.name).concat('BSG');
    console.log(selectedColumns);
    var displayData = data_dyx.map(function(d) {
        var newData = { category: d.category };
        selectedColumns.forEach(function(col) {
            newData[col] = d[col];
        });
        return newData;
        });
    console.log('displayData')
    console.log(displayData)
    var newdata=displayData
    console.log(newdata)
    clearBar();
    console.log(butt)
    var filteredData = butt === 'all' ? newdata : newdata.filter(function(d) { return d.BSG === butt; });
    console.log(filteredData)
    updata(filteredData,butt);
}