healthData();

function healthData() {
    d3.csv("./data/top15-人均医师数.csv").then(function (csv) {
        csv.forEach(function (d) {
            d.city = d.city;
            d.level = +d.level;
            d.group = d.group;
        });

        const data = csv;
        console.log(data);

        Barchart_health_1(data);
    })

}

function Barchart_health_1(data) {
    const margin = { top: 20, right: 60, bottom: 40, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#health-chart-1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 颜色映射
    const color = d3.scaleOrdinal()
        .domain(["北京", "上海", "广州"])
        .range(["#95AFCA", "#F7BB80", "#ED9A9B"]);

    // 自定义排序函数，保证 group 顺序为 北京、上海、广州
    const groupOrder = ["北京", "上海", "广州"];
    const sortedData = data.sort((a, b) => {
        if (a.group === b.group) {
            return d3.ascending(b.level, a.level);
        } else {
            return groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
        }
    });

    // X轴
    const x = d3.scaleBand()
        .domain(sortedData.map(d => d.city))
        .range([0, width])
        .padding(0.3);

    // svg.append("g")
    //     .attr("class", "x-axis")
    //     .attr("transform", `translate(0,${height})`)
    //     .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .attr("transform", "rotate(-45)")
    //     .style("text-anchor", "end");
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle");

    // Y轴
    const y = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.level)])
        .nice()
        .range([height, 0]);

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // 创建提示框
    const tooltip = d3.select("body").append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "1px solid #ccc")
        .style("padding", "10px")
        .style("border-radius", "4px")
        .style("box-shadow", "0px 0px 10px rgba(0,0,0,0.1)");


    // 绘制柱子
    // 选择柱子并绘制
    svg.selectAll(".bar")
        .data(sortedData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.city))
        .attr("y", d => y(d.level))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.level))
        .attr("fill", d => color(d.group))
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible")
                .html(`city: ${d.city}<br>level: ${d.level}<br>group: ${d.group}`);
        })
        .on("mousemove", function (event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
        });

    // 在柱子上方添加文本标签
    svg.selectAll(".bar-label")
        .data(sortedData)
        .enter().append("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.city) + x.bandwidth() / 2)
        .attr("y", d => y(d.level) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", "#373A40")
        .attr("font-size", 10)
        .text(d => d.level);

    // 添加标题
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", 18)
        .text("Top15迁入城市的人均获得执业（助理）医生数量");


    // 添加水平参考线
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0.315))
        .attr("y2", y(0.315))
        .attr("stroke", "grey")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4");
    // 添加文本标签
    svg.append("text")
        .attr("x", width + 10)  // 在右上方显示
        .attr("y", y(0.315) - 5)
        .attr("text-anchor", "end")
        .attr("fill", "grey")
        .attr("font-size", 10)
        .text("全国平均值：0.315");


    // 添加水平参考线
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0.008))
        .attr("y2", y(0.008))
        .attr("stroke", "#407fc2")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4");
    // 添加文本标签
    svg.append("text")
        .attr("x", width + 55)  // 在右上方显示
        .attr("y", y(0.008) - 10)
        .attr("text-anchor", "end")
        .attr("fill", "#407fc2")
        .attr("font-size", 10)
        .text("北京：0.008");
    // 添加水平参考线
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0.005))
        .attr("y2", y(0.005))
        .attr("stroke", "#dc7e21")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4");
    // 添加文本标签
    svg.append("text")
        .attr("x", width + 55)  // 在右上方显示
        .attr("y", y(0.008) + 10)
        .attr("text-anchor", "end")
        .attr("fill", "#dc7e21")
        .attr("font-size", 10)
        .text("上海：0.005");
    // 添加水平参考线
    svg.append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0.006))
        .attr("y2", y(0.006))
        .attr("stroke", "#c92729")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "4,4");
    // 添加文本标签
    svg.append("text")
        .attr("x", width + 55)  // 在右上方显示
        .attr("y", y(0.008))
        .attr("text-anchor", "end")
        .attr("fill", "#c92729")
        .attr("font-size", 10)
        .text("广州：0.006");
}
