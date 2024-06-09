const years_wxy3 = ["2018", "2019", "2020", "2021", "2022", "2023"];
const tooltip_wxy3 = d3.select("body").append("div")
    .attr("class", "tooltip_wxy3")
    .style("opacity", 0);

const cityGroups_wxy3 = {
    '北京': ['北京', '天津', '保定', '唐山', '廊坊', '石家庄', '秦皇岛', '张家口', '承德', '沧州', '衡水', '邢台', '邯郸', '安阳'],
    '上海': ['上海', '南京', '无锡', '常州', '苏州', '南通', '盐城', '扬州', '镇江', '泰州', '杭州', '宁波', '绍兴', '湖州', '嘉兴', '金华', '舟山', '台州', '温州', '合肥', '芜湖', '马鞍山', '铜陵', '安庆', '宣城', '池州', '滁州'],
    '广州': ['广州', '深圳', '佛山', '东莞', '中山', '惠州', '珠海', '江门', '肇庆', '韶关', '汕尾', '阳江', '河源', '清远', '云浮']
};

const cityColors_wxy3 = {  //城市颜色
    '北京': '#95AFCA',
    '上海': '#ED9A9B',
    '广州': '#F7BB80'
};

let maxGlobalValue_wxy3; // 增加全局变量存储最大值

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
]).then(function (data_wxy3) {
    var chinaData_wxy3 = data_wxy3[0];
    var provincesData_wxy3 = data_wxy3.slice(1);

    chinaData_wxy3.features = chinaData_wxy3.features.filter(function (d_wxy3) {
        return d_wxy3.properties.name !== '南海诸岛' && d_wxy3.properties.name !== '十段线';
    });

    var projection_wxy3 = d3.geoMercator()
        .center([105, 35])
        .scale(600)
        .translate([350, 350]);

    var path_wxy3 = d3.geoPath().projection(projection_wxy3);
    var svg_wxy3 = d3.select("#map_wxy3");

    svg_wxy3.selectAll(".country_wxy3")
        .data(chinaData_wxy3.features)
        .enter().append("path")
        .attr("class", "country_wxy3")
        .attr("d", path_wxy3)
        .on("mouseover", function (event_wxy3, d_wxy3) {
            d3.select(this).classed("hovered_wxy3", true);
        })
        .on("mouseout", function (event_wxy3, d_wxy3) {
            d3.select(this).classed("hovered_wxy3", false);
        });

    svg_wxy3.selectAll(".country-label_wxy3")
        .data(chinaData_wxy3.features)
        .enter().append("text")
        .attr("class", "label_wxy3 country-label_wxy3")
        .attr("transform", function (d_wxy3) {
            if (d_wxy3.properties.center) {
                var coords_wxy3 = projection_wxy3(d_wxy3.properties.center);
                return "translate(" + coords_wxy3 + ")";
            } else {
                console.warn("Center coordinates not defined for:", d_wxy3.properties.name);
                return "translate(0, 0)";
            }
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d_wxy3) {
            return d_wxy3.properties.name;
        })
        .on("mouseover", function (event_wxy3, d_wxy3) {
            var provincePath_wxy3 = svg_wxy3.selectAll(".country_wxy3")
                .filter(function (p_wxy3) { return p_wxy3.properties.name === d_wxy3.properties.name; });
            provincePath_wxy3.classed("hovered_wxy3", true);
        })
        .on("mouseout", function (event_wxy3, d_wxy3) {
            var provincePath_wxy3 = svg_wxy3.selectAll(".country_wxy3")
                .filter(function (p_wxy3) { return p_wxy3.properties.name === d_wxy3.properties.name; });
            provincePath_wxy3.classed("hovered_wxy3", false);
        });

    d3.selectAll(".year-button_wxy3").on("click", function () {
        var year_wxy3 = d3.select(this).attr("data-year");
        d3.selectAll(".year-button_wxy3").classed("active_wxy3", false);
        d3.select(this).classed("active_wxy3", true);
        updateCharts_wxy3(year_wxy3);
    });

    function updateMap_wxy3(year_wxy3) {
        svg_wxy3.selectAll(".migration-line_wxy3").remove();
        svg_wxy3.selectAll(".city_wxy3").remove();

        if (!migrationData_wxy3) {
            return;
        }

        var filteredData_wxy3 = migrationData_wxy3.filter(d_wxy3 => d_wxy3.year === +year_wxy3);

        chinaData_wxy3.features.forEach(function (d_wxy3) {
            if (d_wxy3.properties.center) {
                cityCoordinates_wxy3[d_wxy3.properties.name] = projection_wxy3(d_wxy3.properties.center);
            }
        });

        provincesData_wxy3.forEach(function (provinceData_wxy3, index_wxy3) {
            svg_wxy3.selectAll(".city_wxy3" + index_wxy3)
                .data(provinceData_wxy3.features)
                .enter().append("circle")
                .attr("class", "city_wxy3 city_wxy3" + index_wxy3)
                .attr("transform", function (d_wxy3) {
                    if (d_wxy3.properties.center) {
                        var coords_wxy3 = projection_wxy3(d_wxy3.properties.center);
                        return "translate(" + coords_wxy3 + ")";
                    } else {
                        console.warn("Center coordinates not defined for:", d_wxy3.properties.name);
                        return "translate(0, 0)";
                    }
                })
                .attr("r", 0)
                .attr("fill", "red");

            provinceData_wxy3.features.forEach(function (d_wxy3) {
                if (d_wxy3.properties.center) {
                    cityCoordinates_wxy3[d_wxy3.properties.name] = projection_wxy3(d_wxy3.properties.center);
                }
            });
        });

        var lineWidthScale_wxy3 = d3.scaleSqrt()
            .domain([10, maxMigrationIndex_wxy3])
            .range([1, 30]);

        filteredData_wxy3.forEach(function (d_wxy3) {
            if (d_wxy3.migrationActualIndex >= 10) {
                var startCoords_wxy3 = cityCoordinates_wxy3[d_wxy3.startCity];
                var endCoords_wxy3 = cityCoordinates_wxy3[d_wxy3.endCity];

                if (startCoords_wxy3 && endCoords_wxy3) {
                    var lineColor_wxy3 = 'steelblue';
                    for (var group_wxy3 in cityGroups_wxy3) {
                        if (cityGroups_wxy3[group_wxy3].includes(d_wxy3.startCity)) {
                            lineColor_wxy3 = cityColors_wxy3[group_wxy3];
                            break;
                        }
                    }

                    svg_wxy3.append("line")
                        .attr("class", "migration-line_wxy3")
                        .attr("x1", startCoords_wxy3[0])
                        .attr("y1", startCoords_wxy3[1])
                        .attr("x2", endCoords_wxy3[0])
                        .attr("y2", endCoords_wxy3[1])
                        .style("stroke-width", lineWidthScale_wxy3(d_wxy3.migrationActualIndex))
                        .style("stroke", lineColor_wxy3)
                        .style("opacity", 0.7)  //线透明度
                        .on("mouseover", function (event_wxy3) {
                            tooltip_wxy3.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip_wxy3.html("起始城市：" + d_wxy3.startCity + "<br>终点城市：" + d_wxy3.endCity + "<br>年度实际迁移指数：" + d_wxy3.migrationActualIndex.toFixed(2))
                                .style("left", (event_wxy3.pageX + 5) + "px")
                                .style("top", (event_wxy3.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d_wxy3) {
                            tooltip_wxy3.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });

                    svg_wxy3.append("circle")
                        .attr("class", "city_wxy3")
                        .attr("cx", startCoords_wxy3[0])
                        .attr("cy", startCoords_wxy3[1])
                        .attr("r", 2)
                        .attr("fill", "darkgray")
                        .on("mouseover", function (event_wxy3) {
                            tooltip_wxy3.transition()
                                .duration(200)
                                .style("opacity", .9);
                            tooltip_wxy3.html("城市名：" + d_wxy3.startCity)
                                .style("left", (event_wxy3.pageX + 5) + "px")
                                .style("top", (event_wxy3.pageY - 28) + "px");
                        })
                        .on("mouseout", function (d_wxy3) {
                            tooltip_wxy3.transition()
                                .duration(500)
                                .style("opacity", 0);
                        });
                }
            }
        });
    }

    var migrationData_wxy3;
    var cityCoordinates_wxy3 = {};
    var maxMigrationIndex_wxy3;

    // 加载所有数据以找到最大值
    Promise.all([
        d3.csv('data/连线地图-柱形图数据-去除城市圈-北京.csv'),
        d3.csv('data/连线地图-柱形图数据-去除城市圈-上海.csv'),
        d3.csv('data/连线地图-柱形图数据-去除城市圈-广州.csv')
    ]).then(function (data_wxy3) {
        // 计算所有数据的最大值
        maxGlobalValue_wxy3 = d3.max(data_wxy3.flat(), d_wxy3 => +d_wxy3.年度实际迁徙指数);

        // 加载迁徙数据
        d3.csv('data/人口迁徙-去除城市圈2018-2023.csv').then(function (migrationDataCsv_wxy3) {
            migrationData_wxy3 = migrationDataCsv_wxy3.map(d_wxy3 => ({
                year: +d_wxy3.年份,
                startCity: d_wxy3.始发城市,
                startProvince: d_wxy3.始发城市所属省份,
                startCode: +d_wxy3.始发城市代码,
                endCity: d_wxy3.终点城市,
                endProvince: d_wxy3.终点城市所属省份,
                endCode: +d_wxy3.终点城市代码,
                migrationIntentIndex: +d_wxy3.年度迁徙意愿指数,
                migrationActualIndex: +d_wxy3.年度实际迁徙指数
            }));
            maxMigrationIndex_wxy3 = d3.max(migrationData_wxy3, d_wxy3 => d_wxy3.migrationActualIndex);

            updateCharts_wxy3("2023");
        }).catch(function (error_wxy3) {
            console.error('Error loading migration data:', error_wxy3);
        });
    }).catch(function (error_wxy3) {
        console.error('Error loading bar chart data:', error_wxy3);
    });

    let currentIndex_wxy3 = years_wxy3.indexOf("2023");
    let playing_wxy3 = false;
    let interval_wxy3;

    function play_wxy3() {
        if (playing_wxy3) {
            clearInterval(interval_wxy3);
            d3.select("#play-button_wxy3").html("&#9658;");
        } else {
            interval_wxy3 = setInterval(() => {
                currentIndex_wxy3 = (currentIndex_wxy3 + 1) % years_wxy3.length;
                updateCharts_wxy3(years_wxy3[currentIndex_wxy3]);
                d3.selectAll(".year-button_wxy3").classed("active_wxy3", false);
                d3.select(d3.selectAll(".year-button_wxy3").nodes()[currentIndex_wxy3]).classed("active_wxy3", true);
            }, 2000);
            d3.select("#play-button_wxy3").html("&#10074;&#10074;");
        }
        playing_wxy3 = !playing_wxy3;
    }

    d3.select("#play-button_wxy3").on("click", play_wxy3);
    d3.select("#prev-button_wxy3").on("click", () => {
        currentIndex_wxy3 = (currentIndex_wxy3 - 1 + years_wxy3.length) % years_wxy3.length;
        updateCharts_wxy3(years_wxy3[currentIndex_wxy3]);
        d3.selectAll(".year-button_wxy3").classed("active_wxy3", false);
        d3.select(d3.selectAll(".year-button_wxy3").nodes()[currentIndex_wxy3]).classed("active_wxy3", true);
    });
    d3.select("#next-button_wxy3").on("click", () => {
        currentIndex_wxy3 = (currentIndex_wxy3 + 1) % years_wxy3.length;
        updateCharts_wxy3(years_wxy3[currentIndex_wxy3]);
        d3.selectAll(".year-button_wxy3").classed("active_wxy3", false);
        d3.select(d3.selectAll(".year-button_wxy3").nodes()[currentIndex_wxy3]).classed("active_wxy3", true);
    });

    // 设置条形图的尺寸和边距
    const barMargin_wxy3 = { top: 30, right: 30, bottom: 40, left: 90 },
        barWidth_wxy3 = 500 - barMargin_wxy3.left - barMargin_wxy3.right,
        barHeight_wxy3 = 200 - barMargin_wxy3.top - barMargin_wxy3.bottom; // 300px高度给每个条形图

    const barSvg_wxy3 = d3.select("#bar-chart_wxy3")
        .append("svg")
        .attr("width", barWidth_wxy3 + barMargin_wxy3.left + barMargin_wxy3.right)
        .attr("height", 3 * (barHeight_wxy3 + barMargin_wxy3.top + barMargin_wxy3.bottom)) // 高度增加到三倍
        .append("g")
        .attr("transform", `translate(${barMargin_wxy3.left},${barMargin_wxy3.top})`);

    // 创建北京条形图的SVG容器
    const beijingBarSvg_wxy3 = barSvg_wxy3.append("g")
        .attr("class", "beijing-bar-chart_wxy3")
        .attr("transform", `translate(0, 0)`); // 北京条形图在顶部

    // 创建上海条形图的SVG容器
    const shanghaiBarSvg_wxy3 = barSvg_wxy3.append("g")
        .attr("class", "shanghai-bar-chart_wxy3")
        .attr("transform", `translate(0, ${barHeight_wxy3 + barMargin_wxy3.top + barMargin_wxy3.bottom})`); // 上海条形图在北京条形图下方

    // 创建广州条形图的SVG容器
    const guangzhouBarSvg_wxy3 = barSvg_wxy3.append("g")
        .attr("class", "guangzhou-bar-chart_wxy3")
        .attr("transform", `translate(0, ${(2 * barHeight_wxy3) + (2 * barMargin_wxy3.top) + (2 * barMargin_wxy3.bottom)})`); // 广州条形图在上海条形图下方

    // 添加北京条形图标题
    beijingBarSvg_wxy3.append("text")
        .attr("x", barWidth_wxy3 / 2)
        .attr("y", -barMargin_wxy3.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("北京");

    // 添加上海条形图标题
    shanghaiBarSvg_wxy3.append("text")
        .attr("x", barWidth_wxy3 / 2)
        .attr("y", -barMargin_wxy3.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("上海");

    // 添加广州条形图标题
    guangzhouBarSvg_wxy3.append("text")
        .attr("x", barWidth_wxy3 / 2)
        .attr("y", -barMargin_wxy3.top / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("广州");

    // 更新条形图数据
    function updateBarChart_wxy3(year_wxy3) {
        // 更新北京条形图
        d3.csv("data/连线地图-柱形图数据-去除城市圈-北京.csv").then(data_wxy3 => {
            data_wxy3.forEach(d_wxy3 => {
                d_wxy3.年份 = +d_wxy3.年份;
                d_wxy3.年度实际迁徙指数 = +d_wxy3.年度实际迁徙指数;
            });

            const filteredData_wxy3 = data_wxy3.filter(d_wxy3 => d_wxy3.年份 == year_wxy3);
            filteredData_wxy3.sort((a_wxy3, b_wxy3) => b_wxy3.年度实际迁徙指数 - a_wxy3.年度实际迁徙指数);

            const xBar_wxy3 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy3]) // 使用全局最大值
                .range([0, barWidth_wxy3]);

            const yBar_wxy3 = d3.scaleBand()
                .range([0, barHeight_wxy3])
                .domain(filteredData_wxy3.map(d_wxy3 => d_wxy3.终点城市))
                .padding(0.3);

            beijingBarSvg_wxy3.selectAll("rect").remove();
            beijingBarSvg_wxy3.selectAll("text.bar-label_wxy3").remove();
            beijingBarSvg_wxy3.selectAll("g.axis_wxy3").remove();

            beijingBarSvg_wxy3.append("g")
                .selectAll("rect")
                .data(filteredData_wxy3)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy3(0))
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市))
                .attr("width", d_wxy3 => xBar_wxy3(d_wxy3.年度实际迁徙指数))
                .attr("height", yBar_wxy3.bandwidth())
                .attr("fill", "#95AFCA"); // 条形图颜色-北京

            beijingBarSvg_wxy3.append("g")
                .selectAll("text.bar-label_wxy3")
                .data(filteredData_wxy3)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy3")
                .attr("x", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市) + yBar_wxy3.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy3 => d_wxy3.年度实际迁徙指数.toFixed(2));

            beijingBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .call(d3.axisLeft(yBar_wxy3));

            beijingBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .attr("transform", `translate(0,${barHeight_wxy3})`)
                .call(d3.axisBottom(xBar_wxy3));
        });

        // 更新上海条形图
        d3.csv("data/连线地图-柱形图数据-去除城市圈-上海.csv").then(data_wxy3 => {
            data_wxy3.forEach(d_wxy3 => {
                d_wxy3.年份 = +d_wxy3.年份;
                d_wxy3.年度实际迁徙指数 = +d_wxy3.年度实际迁徙指数;
            });

            const filteredData_wxy3 = data_wxy3.filter(d_wxy3 => d_wxy3.年份 == year_wxy3);
            filteredData_wxy3.sort((a_wxy3, b_wxy3) => b_wxy3.年度实际迁徙指数 - a_wxy3.年度实际迁徙指数);

            const xBar_wxy3 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy3]) // 使用全局最大值
                .range([0, barWidth_wxy3]);

            const yBar_wxy3 = d3.scaleBand()
                .range([0, barHeight_wxy3])
                .domain(filteredData_wxy3.map(d_wxy3 => d_wxy3.终点城市))
                .padding(0.3);

            shanghaiBarSvg_wxy3.selectAll("rect").remove();
            shanghaiBarSvg_wxy3.selectAll("text.bar-label_wxy3").remove();
            shanghaiBarSvg_wxy3.selectAll("g.axis_wxy3").remove();

            shanghaiBarSvg_wxy3.append("g")
                .selectAll("rect")
                .data(filteredData_wxy3)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy3(0))
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市))
                .attr("width", d_wxy3 => xBar_wxy3(d_wxy3.年度实际迁徙指数))
                .attr("height", yBar_wxy3.bandwidth())
                .attr("fill", "#ED9A9B"); //条形图颜色-上海

            shanghaiBarSvg_wxy3.append("g")
                .selectAll("text.bar-label_wxy3")
                .data(filteredData_wxy3)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy3")
                .attr("x", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市) + yBar_wxy3.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy3 => d_wxy3.年度实际迁徙指数.toFixed(2));

            shanghaiBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .call(d3.axisLeft(yBar_wxy3));

            shanghaiBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .attr("transform", `translate(0,${barHeight_wxy3})`)
                .call(d3.axisBottom(xBar_wxy3));
        });


        // 更新广州条形图
        d3.csv("data/连线地图-柱形图数据-去除城市圈-广州.csv").then(data_wxy3 => {
            data_wxy3.forEach(d_wxy3 => {
                d_wxy3.年份 = +d_wxy3.年份;
                d_wxy3.年度实际迁徙指数 = +d_wxy3.年度实际迁徙指数;
            });

            const filteredData_wxy3 = data_wxy3.filter(d_wxy3 => d_wxy3.年份 == year_wxy3);
            filteredData_wxy3.sort((a_wxy3, b_wxy3) => b_wxy3.年度实际迁徙指数 - a_wxy3.年度实际迁徙指数);

            const xBar_wxy3 = d3.scaleLinear()
                .domain([0, maxGlobalValue_wxy3]) // 使用全局最大值
                .range([0, barWidth_wxy3]);

            const yBar_wxy3 = d3.scaleBand()
                .range([0, barHeight_wxy3])
                .domain(filteredData_wxy3.map(d_wxy3 => d_wxy3.终点城市))
                .padding(0.3);

            guangzhouBarSvg_wxy3.selectAll("rect").remove();
            guangzhouBarSvg_wxy3.selectAll("text.bar-label_wxy3").remove();
            guangzhouBarSvg_wxy3.selectAll("g.axis_wxy3").remove();

            guangzhouBarSvg_wxy3.append("g")
                .selectAll("rect")
                .data(filteredData_wxy3)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy3(0))
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市))
                .attr("width", d_wxy3 => xBar_wxy3(d_wxy3.年度实际迁徙指数))
                .attr("height", yBar_wxy3.bandwidth())
                .attr("fill", "#F7BB80"); //条形图颜色-广州

            guangzhouBarSvg_wxy3.append("g")
                .selectAll("text.bar-label_wxy3")
                .data(filteredData_wxy3)
                .enter()
                .append("text")
                .attr("class", "bar-label_wxy3")
                .attr("x", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? barLength - 5 : barLength + 5; // 条形较短时文字放在外部
                })
                .attr("y", d_wxy3 => yBar_wxy3(d_wxy3.终点城市) + yBar_wxy3.bandwidth() / 2 + 4)
                .attr("text-anchor", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "end" : "start"; // 条形较短时文字左对齐
                })
                .attr("fill", d_wxy3 => {
                    const barLength = xBar_wxy3(d_wxy3.年度实际迁徙指数);
                    return barLength > 40 ? "white" : "black"; // 条形较短时文字颜色为黑色
                })
                .text(d_wxy3 => d_wxy3.年度实际迁徙指数.toFixed(2));

            guangzhouBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .call(d3.axisLeft(yBar_wxy3));

            guangzhouBarSvg_wxy3.append("g")
                .attr("class", "axis_wxy3")
                .attr("transform", `translate(0,${barHeight_wxy3})`)
                .call(d3.axisBottom(xBar_wxy3));
        });
    }

    // 更新图表数据
    function updateCharts_wxy3(year_wxy3) {
        updateMap_wxy3(year_wxy3);
        updateBarChart_wxy3(year_wxy3);
    }

    // 初始化图表
    updateCharts_wxy3("2023");

}).catch(function (error_wxy3) {
    console.error('Error loading or parsing data:', error_wxy3);
});