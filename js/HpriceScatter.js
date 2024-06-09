// 房价散点图
hpriceScatter();

function hpriceScatter() {
	d3.csv("/data/房价_北上广迁入指数.csv").then(function(data) {
		// Convert data types
		data.forEach(d => {
			d["均价(元/㎡)"] = +d["均价(元/㎡)"];
			d["北上广迁入指数"] = +d["北上广迁入指数"];
			d["原始房价"] = +d["原始房价"];
		});
	
		const margin = {top: 20, right: 30, bottom: 60, left: 70},
			  width = 800 - margin.left - margin.right,
			  height = 600 - margin.top - margin.bottom;
	
		const svg = d3.select("#hprice")
					  .append("svg")
					  .attr("width", width + margin.left + margin.right)
					  .attr("height", height + margin.top + margin.bottom)
					  .append("g")
					  .attr("transform", `translate(${margin.left},${margin.top})`);
	
		const x = d3.scaleLinear()
					.domain([0, 1])
					.range([0, width]);
	
		const y = d3.scaleLinear()
					.domain([0, 1])
					.range([height, 0]);
	
		svg.append("g")
		   .attr("transform", `translate(0,${height})`)
		   .call(d3.axisBottom(x));
	
		svg.append("g")
		   .call(d3.axisLeft(y));
	
		// Tooltip setup
		const tooltip = d3.select("body").append("div")
						  .attr("class", "hprice-tooltip")
						  .style("position", "absolute")
						  .style("background-color", "#FFEAE3")
						  .style("border-radius", "8px")
						  .style("border", "0")
						  .style("padding", "10px")
						  .style("text-align", "center")
						  .style("font", "12px sans-serif")
						  .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.1)")
						  .style("pointer-events", "none")
						  .style("display", "none");
	
		// Add dots with jittering to spread out the points
		const format = d3.format(",.0f");
		// const format = d3.format(",.2f");   // 两位小数
		svg.append("g")
		   .selectAll("dot")
		   .data(data)
		   .enter()
		   .append("circle")
		   .attr("cx", d => x(d["北上广迁入指数"]))
		   .attr("cy", d => y(d["均价(元/㎡)"]))
		   .attr("r", 5)
		   .style("fill", "#94A684")
		   .style("opacity", 0.6)
		   .attr("id", d => d["城市"])
		   .on("mouseover", function(event, d) {
			   tooltip.style("display", "block")
					  .html(`<b>${d["城市"]}</b><br>均价(元/㎡)：${format(d["原始房价"])}`)
					  .style("left", (event.pageX + 15) + "px")
					  .style("top", (event.pageY - 15) + "px");
	
			   const xCoord = x(d["北上广迁入指数"]);
			   const yCoord = y(d["均价(元/㎡)"]);
	
			   // Add horizontal dashed line
			   svg.append("line")
				  .attr("class", "hprice-tooltip-line")
				  .attr("x1", xCoord)
				  .attr("y1", yCoord)
				  .attr("x2", xCoord)
				  .attr("y2", height)
				  .attr("stroke", "gray")
				  .attr("stroke-width", 1)
				  .attr("stroke-dasharray", "4");
	
			   // Add vertical dashed line
			   svg.append("line")
				  .attr("class", "hprice-tooltip-line")
				  .attr("x1", xCoord)
				  .attr("y1", yCoord)
				  .attr("x2", 0)
				  .attr("y2", yCoord)
				  .attr("stroke", "gray")
				  .attr("stroke-width", 1)
				  .attr("stroke-dasharray", "4");
		   })
		   .on("mouseout", function() {
			   tooltip.style("display", "none");
			   // Remove dashed lines
			   svg.selectAll(".hprice-tooltip-line").remove();
		   });
	
		// X-axis label
		svg.append("text")
		   .attr("text-anchor", "end")
		   .attr("x", width / 2 + margin.left)
		   .attr("y", height + margin.top + 30)
		   .text("北上广迁入指数 - 归一化");
	
		// Y-axis label
		svg.append("text")
		   .attr("text-anchor", "end")
		   .attr("transform", "rotate(-90)")
		   .attr("x", -height / 2 + 30)
		   .attr("y", -margin.left + 20)
		   .text("房价 - 归一化");
	
		// List of outlier cities to label
		// const outlierCities = ["北京", "上海", "广州", "赤峰", "葫芦岛", "大同", "济南", "德州", "淮安", "六安", "连云港", "宿迁", "阜阳", "赣州", "湛江", "梅州", "揭阳", "茂名"];
		const outlierCities = ["北京", "上海", "广州"];
	
		// Add labels for outlier cities
		svg.selectAll(".text")
		   .data(data)
		   .enter()
		   .append("text")
		   .filter(d => outlierCities.includes(d["城市"]))
		   .attr("x", d => x(d["北上广迁入指数"]))
		   .attr("y", d => y(d["均价(元/㎡)"]))
		   .attr("dy", -10)
		   .attr("dx", 5)
		   .text(d => d["城市"])
		   .style("font-size", "12px")
		   .style("fill", "black");
	
		// Add a horizontal line at Guangzhou's y-coordinate
		const guangzhou = data.find(d => d["城市"] === "广州");
		if (guangzhou) {
			const yGuangzhou = y(guangzhou["均价(元/㎡)"]);
			svg.append("line")
			   .attr("x1", 0)
			   .attr("y1", yGuangzhou)
			   .attr("x2", width)
			   .attr("y2", yGuangzhou)
			   .attr("stroke", "gray")
			   .attr("stroke-width", 2)
			   .attr("stroke-dasharray", "4")
			   .style("opacity", 0.7);
	
			svg.append("text")
			   .attr("x", width - 150)
			   .attr("y", yGuangzhou - 10)
			   .style("font-family", "微软雅黑")
			   .style("font-size", "15px")
			   .style("font-color", "rgba(105, 105, 105, 0.3)")
			   .text("北上广最低房价参考线");
		}
	});
	
};
