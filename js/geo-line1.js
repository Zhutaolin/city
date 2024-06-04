const years_wxy1 = ["2018", "2019", "2020", "2021", "2022", "2023"];
const tooltip_wxy1 = d3.select("body").append("div")
    .attr("class", "tooltip_wxy1")
    .style("opacity", 0);

const cityGroups_wxy1 = {
    '北京': ['北京', '天津', '保定', '唐山', '廊坊', '石家庄', '秦皇岛', '张家口', '承德', '沧州', '衡水', '邢台', '邯郸', '安阳'],
    '上海': ['上海', '南京', '无锡', '常州', '苏州', '南通', '盐城', '扬州', '镇江', '泰州', '杭州', '宁波', '绍兴', '湖州', '嘉兴', '金华', '舟山', '台州', '温州', '合肥', '芜湖', '马鞍山', '铜陵', '安庆', '宣城', '池州', '滁州'],
    '广州': ['广州', '深圳', '佛山', '东莞', '中山', '惠州', '珠海', '江门', '肇庆', '韶关', '汕尾', '阳江', '河源', '清远', '云浮']
};

const cityColors_wxy1 = {  //城市线颜色
    '北京': '#95AFCA',
    '上海': '#ED9A9B',
    '广州': '#F7BB80'
};

let maxGlobalValue_wxy1; // 增加全局变量存储最大值

Promise.all([
    d3.json('data/china.json'),
    d3.json('data/四川省.json'),
    d3.json('data/河北省.json'),
    d3.json('data/安徽省.json'),
    d3.json('data/福建省.json'),
    d3.json('data/甘肃省.json'),
    d3.json('data/广东省.json'),
    d3.json('data/广西壮族自治区.json'),
    d3.json('data/贵州省.json'),
    d3.json('data/海南省.json'),
    d3.json('data/河南省.json'),
    d3.json('data/黑龙江省.json'),
    d3.json('data/湖北省.json'),
    d3.json('data/湖南省.json'),
    d3.json('data/吉林省.json'),
    d3.json('data/江苏省.json'),
    d3.json('data/江西省.json'),
    d3.json('data/辽宁省.json'),
    d3.json('data/内蒙古自治区.json'),
    d3.json('data/宁夏回族自治区.json'),
    d3.json('data/青海省.json'),
    d3.json('data/山东省.json'),
    d3.json('data/山西省.json'),
    d3.json('data/陕西省.json'),
    d3.json('data/西藏自治区.json'),
    d3.json('data/云南省.json'),
    d3.json('data/浙江省.json'),
    d3.json('data/新疆维吾尔自治区.json')
]).then(function (data_wxy1) {
    var chinaData_wxy1 = data_wxy1[0];
    var provincesData_wxy1 = data_wxy1.slice(1);

    chinaData_wxy1.features = chinaData_wxy1.features.filter(function (d_wxy1) {
        return d_wxy1.properties.name !== '南海诸岛' && d_wxy1.properties.name !== '十段线';
    });

    var projection_wxy1 = d3.geoMercator()
        .center([105, 35])
        .scale(600)
        .translate([350, 350]);

    var path_wxy1 = d3.geoPath().projection(projection_wxy1);
    var svg_wxy1 = d3.select("#map_wxy1");

    svg_wxy1.selectAll(".country_wxy1")
        .data(chinaData_wxy1.features)
        .enter().append("path")
        .attr("class", "country_wxy1")
        .attr("d", path_wxy1)
        .on("mouseover", function (event, d_wxy1) {
            d3.select(this).classed("hovered_wxy1", true);
        })
        .on("mouseout", function (event, d_wxy1) {
            d3.select(this).classed("hovered_wxy1", false);
        });

    svg_wxy1.selectAll(".country-label_wxy1")
        .data(chinaData_wxy1.features)
        .enter().append("text")
        .attr("class", "label_wxy1 country-label_wxy1")
        .attr("transform", function (d_wxy1) {
            if (d_wxy1.properties.center) {
                var coords_wxy1 = projection_wxy1(d_wxy1.properties.center);
                return "translate(" + coords_wxy1 + ")";
            } else {
                console.warn("Center coordinates not defined for:", d_wxy1.properties.name);
                return "translate(0, 0)";
            }
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d_wxy1) {
            return d_wxy1.properties.name;
        })
        .on("mouseover", function (event, d_wxy1) {
            var provincePath_wxy1 = svg_wxy1.selectAll(".country_wxy1")
                .filter(function (p_wxy1) { return p_wxy1.properties.name === d_wxy1.properties.name; });
            provincePath_wxy1.classed("hovered_wxy1", true);
        })
        .on("mouseout", function (event, d_wxy1) {
            var provincePath_wxy1 = svg_wxy1.selectAll(".country_wxy1")
                .filter(function (p_wxy1) { return p_wxy1.properties.name === d_wxy1.properties.name; });
            provincePath_wxy1.classed("hovered_wxy1", false);
        });

    d3.selectAll(".year-button_wxy1").on("click", function () {
        var year_wxy1 = d3.select(this).attr("data-year");
        d3.selectAll(".year-button_wxy1").classed("active_wxy1", false);
        d3.select(this).classed("active_wxy1", true);
        updateCharts_wxy1(year_wxy1);
    });

    function updateMap_wxy1(year_wxy1) {
        svg_wxy1.selectAll(".migration-line_wxy1").remove();
        svg_wxy1.selectAll(".city_wxy1").remove();

        if (!migrationData_wxy1) {
            return;
        }

        // 过滤和倒序排序数据
        var filteredData_wxy1 = migrationData_wxy1.filter(d_wxy1 => d_wxy1.year === +year_wxy1);
        filteredData_wxy1.sort((a_wxy1, b_wxy1) => b_wxy1.migrationActualIndex - a_wxy1.migrationActualIndex);

        chinaData_wxy1.features.forEach(function (d_wxy1) {
            if (d_wxy1.properties.center) {
                cityCoordinates_wxy1[d_wxy1.properties.name] = projection_wxy1(d_wxy1.properties.center);
            }
        });

        provincesData_wxy1.forEach(function (provinceData_wxy1, index_wxy1) {
            svg_wxy1.selectAll(".city" + index_wxy1)
                .data(provinceData_wxy1.features)
                .enter().append("circle")
                .attr("class", "city_wxy1 city" + index_wxy1)
                .attr("transform", function (d_wxy1) {
                    if (d_wxy1.properties.center) {
                        var coords_wxy1 = projection_wxy1(d_wxy1.properties.center);
                        return "translate(" + coords_wxy1 + ")";
                    } else {
                        console.warn("Center coordinates not defined for:", d_wxy1.properties.name);
                        return "translate(0, 0)";
                    }
                })
                .attr("r", 0)
                .attr("fill", "red");

            provinceData_wxy1.features.forEach(function (d_wxy1) {
                if (d_wxy1.properties.center) {
                    cityCoordinates_wxy1[d_wxy1.properties.name] = projection_wxy1(d_wxy1.properties.center);
                }
            });
        });

        var lineWidthScale_wxy1 = d3.scaleSqrt()
            .domain([100, maxMigrationIndex_wxy1])
            .range([1, 30]);

        filteredData_wxy1.forEach(function (d_wxy1) {
            if (d_wxy1.migrationActualIndex >= 100) {
                var startCoords_wxy1 = cityCoordinates_wxy1[d_wxy1.startCity];
                var endCoords_wxy1 = cityCoordinates_wxy1[d_wxy1.endCity];

                if (startCoords_wxy1 && endCoords_wxy1) {
                    var lineColor_wxy1 = 'rgba(181, 193, 142, 0.3)'; // 其他城市线颜色
                    for (var group_wxy1 in cityGroups_wxy1) {
                        if (cityGroups_wxy1[group_wxy1].includes(d_wxy1.startCity)) {
                            lineColor_wxy1 = cityColors_wxy1[group_wxy1];
                            break;
                        }
                    }

                    svg_wxy1.append("line")
                        .attr("class", "migration-line_wxy1")
                        .attr("x1", startCoords_wxy1[0])
                        .attr("y1", startCoords_wxy1[1])
                        .attr("x2", endCoords_wxy1[0])
                        .attr("y2", endCoords_wxy1[1])
                        .style("stroke-width", lineWidthScale_wxy1(d_wxy1.migrationActualIndex))
                        .style("stroke", lineColor_wxy1)
                        .style("opacity", 1) // 城市线透明度
                        .on("mouseover", function (event) {
                            tooltip_wxy1.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip_wxy1.html("起始城市：" + d_wxy1.startCity + "<br>终点城市：" + d_wxy1.endCity + "<br>年度实际迁移指数：" + d_wxy1.migrationActualIndex)
                                .style("left", (event.pageX + 5) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d_wxy1) {
                            tooltip_wxy1.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                    svg_wxy1.append("circle")
                        .attr("class", "city_wxy1")
                        .attr("cx", startCoords_wxy1[0])
                        .attr("cy", startCoords_wxy1[1])
                        .attr("r", 1)
                        .attr("fill", "darkgray")
                        .on("mouseover", function (event) {
                            tooltip_wxy1.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip_wxy1.html("城市名：" + d_wxy1.startCity)
                                .style("left", (event.pageX + 5) + "px")
                                .style("top", (event.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d_wxy1) {
                            tooltip_wxy1.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                }
            }
        });
    }




    var migrationData_wxy1;
    var cityCoordinates_wxy1 = {};
    var maxMigrationIndex_wxy1;

    // 加载所有数据以找到最大值
    Promise.all([
        d3.csv('data/连线地图-柱形图数据-北京.csv'),
        d3.csv('data/连线地图-柱形图数据-上海.csv'),
        d3.csv('data/连线地图-柱形图数据-广州.csv')
    ]).then(function (data_wxy1) {
        // 计算所有数据的最大值
        maxGlobalValue_wxy1 = d3.max(data_wxy1.flat(), d_wxy1 => +d_wxy1.年度实际迁徙指数);

        // 加载迁徙数据
        d3.csv('data/人口迁徙-年度明细数据2018-2023.csv').then(function (migrationDataCsv_wxy1) {
            migrationData_wxy1 = migrationDataCsv_wxy1.map(d_wxy1 => ({
                year: +d_wxy1.年份,
                startCity: d_wxy1.始发城市,
                startProvince: d_wxy1.始发城市所属省份,
                startCode: +d_wxy1.始发城市代码,
                endCity: d_wxy1.终点城市,
                endProvince: d_wxy1.终点城市所属省份,
                endCode: +d_wxy1.终点城市代码,
                migrationIntentIndex: +d_wxy1.年度迁徙意愿指数,
                migrationActualIndex: +d_wxy1.年度实际迁徙指数
            }));
            maxMigrationIndex_wxy1 = d3.max(migrationData_wxy1, d_wxy1 => d_wxy1.migrationActualIndex);

            updateCharts_wxy1("2023");
        }).catch(function (error_wxy1) {
            console.error('Error loading migration data:', error_wxy1);
        });
    }).catch(function (error_wxy1) {
        console.error('Error loading bar chart data:', error_wxy1);
    });

    let currentIndex_wxy1 = years_wxy1.indexOf("2023");
    let playing_wxy1 = false;
    let interval_wxy1;

    function play_wxy1() {
        if (playing_wxy1) {
            clearInterval(interval_wxy1);
            d3.select("#play-button_wxy1").html("&#9658;");
        } else {
            interval_wxy1 = setInterval(() => {
                currentIndex_wxy1 = (currentIndex_wxy1 + 1) % years_wxy1.length;
                updateCharts_wxy1(years_wxy1[currentIndex_wxy1]);
                d3.selectAll(".year-button_wxy1").classed("active_wxy1", false);
                d3.select(d3.selectAll(".year-button_wxy1").nodes()[currentIndex_wxy1]).classed("active_wxy1", true);
            }, 2000);
            d3.select("#play-button_wxy1").html("&#10074;&#10074;");
        }
        playing_wxy1 = !playing_wxy1;
    }

    d3.select("#play-button_wxy1").on("click", play_wxy1);
    d3.select("#prev-button_wxy1").on("click", () => {
        currentIndex_wxy1 = (currentIndex_wxy1 - 1 + years_wxy1.length) % years_wxy1.length;
        updateCharts_wxy1(years_wxy1[currentIndex_wxy1]);
        d3.selectAll(".year-button_wxy1").classed("active_wxy1", false);
        d3.select(d3.selectAll(".year-button_wxy1").nodes()[currentIndex_wxy1]).classed("active_wxy1", true);
    });
    d3.select("#next-button_wxy1").on("click", () => {
        currentIndex_wxy1 = (currentIndex_wxy1 + 1) % years_wxy1.length;
        updateCharts_wxy1(years_wxy1[currentIndex_wxy1]);
        d3.selectAll(".year-button_wxy1").classed("active_wxy1", false);
        d3.select(d3.selectAll(".year-button_wxy1").nodes()[currentIndex_wxy1]).classed("active_wxy1", true);
    });

    // 设置条形图的尺寸和边距
    const barMargin_wxy1 = { top: 40, right: 30, bottom: 40, left: 90 },
        barWidth_wxy1 = 500 - barMargin_wxy1.left - barMargin_wxy1.right,
        barHeight_wxy1 = 200 - barMargin_wxy1.top - barMargin_wxy1.bottom; // 300px高度给每个条形图

    const barSvg_wxy1 = d3.select("#bar-chart_wxy1")
        .append("svg")
        .attr("width", barWidth_wxy1 + barMargin_wxy1.left + barMargin_wxy1.right)
        .attr("height", 3 * (barHeight_wxy1 + barMargin_wxy1.top + barMargin_wxy1.bottom)) // 高度增加到三倍
        .append("g")
        .attr("transform", `translate(${barMargin_wxy1.left},${barMargin_wxy1.top})`);

    // 创建北京条形图的SVG容器
    const beijingBarSvg_wxy1 = barSvg_wxy1.append("g")
        .attr("class", "beijing-bar-chart_wxy1")
        .attr("transform", `translate(0, 0)`); // 北京条形图在顶部

    // 创建上海条形图的SVG容器
    const shanghaiBarSvg_wxy1 = barSvg_wxy1.append("g")
        .attr("class", "shanghai-bar-chart_wxy1")
        .attr("transform", `translate(0, ${barHeight_wxy1 + barMargin_wxy1.top + barMargin_wxy1.bottom})`); // 上海条形图在北京条形图下方

    // 创建广州条形图的SVG容器
    const guangzhouBarSvg_wxy1 = barSvg_wxy1.append("g")
        .attr("class", "guangzhou-bar-chart_wxy1")
        .attr("transform", `translate(0, ${(2 * barHeight_wxy1) + (2 * barMargin_wxy1.top) + (2 * barMargin_wxy1.bottom)})`); // 广州条形图在上海条形图下方

    // 添加北京条形图标题
    beijingBarSvg_wxy1.append("text")
        .attr("x", barWidth_wxy1 / 2)
        .attr("y", -barMargin_wxy1.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("北京");

    // 添加上海条形图标题
    shanghaiBarSvg_wxy1.append("text")
        .attr("x", barWidth_wxy1 / 2)
        .attr("y", -barMargin_wxy1.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("上海");

    // 添加广州条形图标题
    guangzhouBarSvg_wxy1.append("text")
        .attr("x", barWidth_wxy1 / 2)
        .attr("y", -barMargin_wxy1.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("广州");

    // 更新条形图数据
    function updateBarChart_wxy1(year_wxy1) {
        // 更新北京条形图
        d3.csv("data/连线地图-柱形图数据-北京.csv").then(data_wxy1 => {
            data_wxy1.forEach(d_wxy1 => {
                d_wxy1.年份 = +d_wxy1.年份;
                d_wxy1.年度实际迁徙指数 = +d_wxy1.年度实际迁徙指数;
            });

            const filteredData_wxy1 = data_wxy1.filter(d_wxy1 => d_wxy1.年份 == year_wxy1);
            filteredData_wxy1.sort((a_wxy1, b_wxy1) => b_wxy1.年度实际迁徙指数 - a_wxy1.年度实际迁徙指数);

            const xBar_wxy1 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy1]) // 使用全局最大值
                .range([0, barWidth_wxy1]);

            const yBar_wxy1 = d3.scaleBand()
                .range([0, barHeight_wxy1])
                .domain(filteredData_wxy1.map(d_wxy1 => d_wxy1.终点城市))
                .padding(0.3);

            beijingBarSvg_wxy1.selectAll("rect").remove();
            beijingBarSvg_wxy1.selectAll("text.bar-label_wxy1").remove();
            beijingBarSvg_wxy1.selectAll("g.axis_wxy1").remove();

            beijingBarSvg_wxy1.append("g")
                .selectAll("rect")
                .data(filteredData_wxy1)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy1(0))
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市))
                .attr("width", d_wxy1 => xBar_wxy1(d_wxy1.年度实际迁徙指数))
                .attr("height", yBar_wxy1.bandwidth())
                .attr("fill", '#95AFCA');  // 条形图颜色-北京

            beijingBarSvg_wxy1.append("g")
                .selectAll("text.bar-label_wxy1")
                .data(filteredData_wxy1)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy1")
                .attr("x", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市) + yBar_wxy1.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy1 => d_wxy1.年度实际迁徙指数.toFixed(2));

            beijingBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .call(d3.axisLeft(yBar_wxy1));

            beijingBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .attr("transform", `translate(0,${barHeight_wxy1})`)
                .call(d3.axisBottom(xBar_wxy1));
        });

        // 更新上海条形图
        d3.csv("data/连线地图-柱形图数据-上海.csv").then(data_wxy1 => {
            data_wxy1.forEach(d_wxy1 => {
                d_wxy1.年份 = +d_wxy1.年份;
                d_wxy1.年度实际迁徙指数 = +d_wxy1.年度实际迁徙指数;
            });

            const filteredData_wxy1 = data_wxy1.filter(d_wxy1 => d_wxy1.年份 == year_wxy1);
            filteredData_wxy1.sort((a_wxy1, b_wxy1) => b_wxy1.年度实际迁徙指数 - a_wxy1.年度实际迁徙指数);

            const xBar_wxy1 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy1]) // 使用全局最大值
                .range([0, barWidth_wxy1]);

            const yBar_wxy1 = d3.scaleBand()
                .range([0, barHeight_wxy1])
                .domain(filteredData_wxy1.map(d_wxy1 => d_wxy1.终点城市))
                .padding(0.3);

            shanghaiBarSvg_wxy1.selectAll("rect").remove();
            shanghaiBarSvg_wxy1.selectAll("text.bar-label_wxy1").remove();
            shanghaiBarSvg_wxy1.selectAll("g.axis_wxy1").remove();

            shanghaiBarSvg_wxy1.append("g")
                .selectAll("rect")
                .data(filteredData_wxy1)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy1(0))
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市))
                .attr("width", d_wxy1 => xBar_wxy1(d_wxy1.年度实际迁徙指数))
                .attr("height", yBar_wxy1.bandwidth())
                .attr("fill", '#ED9A9B');  //条形图颜色-上海

            shanghaiBarSvg_wxy1.append("g")
                .selectAll("text.bar-label_wxy1")
                .data(filteredData_wxy1)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy1")
                .attr("x", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市) + yBar_wxy1.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy1 => d_wxy1.年度实际迁徙指数.toFixed(2));

            shanghaiBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .call(d3.axisLeft(yBar_wxy1));

            shanghaiBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .attr("transform", `translate(0,${barHeight_wxy1})`)
                .call(d3.axisBottom(xBar_wxy1));
        });

        // 更新广州条形图
        d3.csv("data/连线地图-柱形图数据-广州.csv").then(data_wxy1 => {
            data_wxy1.forEach(d_wxy1 => {
                d_wxy1.年份 = +d_wxy1.年份;
                d_wxy1.年度实际迁徙指数 = +d_wxy1.年度实际迁徙指数;
            });

            const filteredData_wxy1 = data_wxy1.filter(d_wxy1 => d_wxy1.年份 == year_wxy1);
            filteredData_wxy1.sort((a_wxy1, b_wxy1) => b_wxy1.年度实际迁徙指数 - a_wxy1.年度实际迁徙指数);

            const xBar_wxy1 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy1]) // 使用全局最大值
                .range([0, barWidth_wxy1]);

            const yBar_wxy1 = d3.scaleBand()
                .range([0, barHeight_wxy1])
                .domain(filteredData_wxy1.map(d_wxy1 => d_wxy1.终点城市))
                .padding(0.3);

            guangzhouBarSvg_wxy1.selectAll("rect").remove();
            guangzhouBarSvg_wxy1.selectAll("text.bar-label_wxy1").remove();
            guangzhouBarSvg_wxy1.selectAll("g.axis_wxy1").remove();

            guangzhouBarSvg_wxy1.append("g")
                .selectAll("rect")
                .data(filteredData_wxy1)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy1(0))
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市))
                .attr("width", d_wxy1 => xBar_wxy1(d_wxy1.年度实际迁徙指数))
                .attr("height", yBar_wxy1.bandwidth())
                .attr("fill", '#F7BB80'); //条形图颜色-广州

            guangzhouBarSvg_wxy1.append("g")
                .selectAll("text.bar-label_wxy1")
                .data(filteredData_wxy1)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy1")
                .attr("x", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy1 => yBar_wxy1(d_wxy1.终点城市) + yBar_wxy1.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy1 => {
                    const barLength = xBar_wxy1(d_wxy1.年度实际迁徙指数);
                    return barLength > 55 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy1 => d_wxy1.年度实际迁徙指数.toFixed(2));

            guangzhouBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .call(d3.axisLeft(yBar_wxy1));

            guangzhouBarSvg_wxy1.append("g")
                .attr("class", "axis_wxy1")
                .attr("transform", `translate(0,${barHeight_wxy1})`)
                .call(d3.axisBottom(xBar_wxy1));
        });
    }

    // 更新图表数据
    function updateCharts_wxy1(year_wxy1) {
        updateMap_wxy1(year_wxy1);
        updateBarChart_wxy1(year_wxy1);
    }

    // 初始化图表
    updateCharts_wxy1("2023");

}).catch(function (error_wxy1) {
    console.error('Error loading or parsing data:', error_wxy1);
});