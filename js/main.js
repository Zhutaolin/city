loadAllData();

//函数：绘制总的图
function loadAllData() {
  // Read dummy data
  d3.json("js/migrate_new5.json").then(function (data) {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#arc-chart-1")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    // List of node names
    const allNodes = data.nodes.map(function (d) { return d.name });
    console.log(allNodes);

    // List of groups
    var allGroups = data.nodes.map(function (d) { return d.group });
    allGroups = [...new Set(allGroups)];
    console.log(allGroups);

    // A color scale for groups:
    const customColors = ['#EC8F5E', '#9ED2BE', '#FFE17B', '#CECE5A']; // 自定义颜色数组
    const color = d3.scaleOrdinal()
      .domain(allGroups)
      .range(customColors);

    // A linear scale for node size
    const size = d3.scaleLinear()
      .domain([1, 10])
      .range([2, 10]);

    // A linear scale to position the nodes on the X axis
    const x = d3.scalePoint()
      .range([0, width])
      .domain(allNodes);

    // A fixed y position for the nodes
    const y = height / 2;

    // Add the links (上方弧线)
    const linksTop = svg
      .selectAll('mylinksTop')
      .data(data.links_low)
      .enter()
      .append('path')
      .attr('d', function (d) {
        var start = x(d.source);    // X position of start node on the X axis
        var end = x(d.target);      // X position of end node
        return ['M', start, y,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
          'A',                            // This means we're gonna build an elliptical arc
          (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
          (start - end) / 2, 0, 0, ',',
          start < end ? 1 : 0, end, ',', y] // We always want the arc on top. So if end is before start, putting 0 here turn the arc upside down.
          .join(' ');
      })
      .style("fill", "none")
      .attr("stroke", function (d) {
        var startNode = data.nodes.find(function (node) {
          return node.name === d.source;
        });
        return color(startNode.group);
      })
      .style("stroke-width", function (d) { return d.value / 500; });

    // Add the links (下方弧线)
    const linksBottom = svg
      .selectAll('mylinksBottom')
      .data(data.links_up)
      .enter()
      .append('path')
      .attr('d', function (d) {
        var start = x(d.source);    // X position of start node on the X axis
        var end = x(d.target);      // X position of end node
        return ['M', start, y,    // the arc starts at the coordinate x=start, y=height-30 (where the starting node is)
          'A',                            // This means we're gonna build an elliptical arc
          (start - end) / 2, ',',    // Next 2 lines are the coordinates of the inflexion point. Height of this point is proportional with start - end distance
          (start - end) / 2, 0, 0, ',',
          start < end ? 0 : 1, end, ',', y] // We always want the arc on top. So if end is before start, putting 1 here turn the arc upside down.
          .join(' ');
      })
      .style("fill", "none")
      .attr("stroke", function (d) {
        var startNode = data.nodes.find(function (node) {
          return node.name === d.source;
        });
        return color(startNode.group);
      })
      .style("stroke-width", function (d) { return d.value / 10000; });

    // 添加节点
    const nodes = svg
      .selectAll("mynodes")
      .data(data.nodes)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.name); })
      .attr("cy", y)
      .attr("r", function (d) { return d.size * 3; })
      .style("fill", function (d) { return color(d.group); })
      .attr("stroke", "white");

    // And give them a label
    const labels = svg
      .selectAll("mylabels")
      .data(data.nodes)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", 0)
      .text(function (d) { return d.name; })
      .style("text-anchor", "end")
      .attr("transform", function (d) { return "translate(" + x(d.name) + "," + (y + 15) + ")rotate(-45)"; })
      .style("font-size", 9);

    // 为每个组别创建唯一的标识符
    const groupData = allGroups.map(group => ({
      group: group,
      color: color(group),
      size: data.nodes.find(node => node.group === group).size // 获取该组别节点的大小
    }));

    // 添加图例
    const legend = svg.selectAll(".legend")
      .data(groupData)
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) { return "translate(0," + (i * 25 + 20) + ")"; });

    // 绘制圆形
    legend.append("circle")
      .attr("cx", width - 50)
      .attr("cy", 10)
      .attr("r", function (d) { return d.size * 3; }) // 使用组别节点的大小
      .style("fill", function (d) { return d.color; }); // 使用组别节点的颜色

    // 添加组别名称
    legend.append("text")
      .attr("x", width - 35)
      .attr("y", 10)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .attr("font-size", "10px")
      .text(function (d) { return d.group; });

    // 添加标题
    svg.append("text")
        .attr("class", "title-1")
        .attr("x", width / 2)
        .attr("y", -margin.top)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("不同级别城市间的人口迁徙情况");
    
    // 添加上方图例
    svg.append("text")
        .attr("class", "low-1")
        .attr("x", 20)
        .attr("y", 80)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("向下流动");
    // 添加上方图例
    svg.append("text")
        .attr("class", "low-1")
        .attr("x", 25)
        .attr("y", 100)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("实际迁出指数500:1绘制");

    // 添加下方图例
    svg.append("text")
        .attr("class", "low-1")
        .attr("x", 450)
        .attr("y", 480)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("向上流动");
    // 添加上方图例
    svg.append("text")
        .attr("class", "low-1")
        .attr("x", 450)
        .attr("y", 500)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .text("实际迁出指数10000:1绘制");


    // Add the highlighting functionality
    nodes
      .on('mouseover', function (event, d) {
        // Highlight the nodes: every node is green except of him
        nodes
          .style('opacity', .2);
        d3.select(this)
          .style('opacity', 1);
        // Highlight the connections
        linksTop
          .style('stroke', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? color(d.group) : '#b8b8b8'; })
          .style('stroke-opacity', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? 1 : .2; })
          .style('stroke-width', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? 4 : 1; });
        linksBottom
          .style('stroke', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? color(d.group) : '#b8b8b8'; })
          .style('stroke-opacity', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? 1 : .2; })
          .style('stroke-width', function (link_d) { return link_d.source === d.name || link_d.target === d.name ? 4 : 1; });
        labels
          .style("font-size", function (label_d) { return label_d.name === d.name ? 16 : 8; }) // 修改此处，将非选中标签的字体大小重置为 8
          .attr("transform", function (label_d) { return "translate(" + x(label_d.name) + "," + (y + 15) + ")rotate(-45)"; }); // 确保 transform 属性在 mouseover 和 mouseout 时一致

      })
      .on('mouseout', function (event, d) {
        nodes.style('opacity', 1);
        linksTop
          .style('stroke', function (d) {
            var startNode = data.nodes.find(function (node) {
              return node.name === d.source;
            });
            return color(startNode.group);
          })
          .style('stroke-opacity', 1)
          .style('stroke-width', function (d) { return d.value / 500; });
        linksBottom
          .style('stroke', function (d) {

            var startNode = data.nodes.find(function (node) {
              return node.name === d.source;
            });
            return color(startNode.group);
          })
          .style('stroke-opacity', 1)
          .style('stroke-width', function (d) { return d.value / 10000; });
        labels
          .style("font-size", 8) // 重置字体大小为 8
          .attr("transform", function (label_d) { return "translate(" + x(label_d.name) + "," + (y + 15) + ")rotate(-45)"; }); // 确保 transform 属性在 mouseover 和 mouseout 时一致
      });
  });
}