const years_wxy2 = ["2018", "2019", "2020", "2021", "2022", "2023"];
let currentIndex_wxy2 = years_wxy2.indexOf("2023");
let playing_wxy2 = false;
let interval_wxy2;
let migrationDataLoaded_wxy2 = false;

// 创建提示框
const tooltip_wxy2 = d3.select("body").append("div")
    .attr("class", "tooltip_wxy2")
    .style("opacity", 0);

// 城市数据
const citiesData_wxy2 = {
    "北京": [
        { year: 2018, migrationActualIndex: 5812.289722 },
        { year: 2019, migrationActualIndex: 11923.672501 },
        { year: 2020, migrationActualIndex: 9992.922779 },
        { year: 2021, migrationActualIndex: 11029.575000 },
        { year: 2022, migrationActualIndex: 5985.220000 },
        { year: 2023, migrationActualIndex: 15999.540278 }
    ],
    "上海": [
        { year: 2018, migrationActualIndex: 5605.778334 },
        { year: 2019, migrationActualIndex: 11822.765277 },
        { year: 2020, migrationActualIndex: 12614.883333 },
        { year: 2021, migrationActualIndex: 14690.474167 },
        { year: 2022, migrationActualIndex: 9539.295277 },
        { year: 2023, migrationActualIndex: 19335.465278 }
    ],
    "广州": [
        { year: 2018, migrationActualIndex: 12584.833056 },
        { year: 2019, migrationActualIndex: 26727.737500 },
        { year: 2020, migrationActualIndex: 30023.576663 },
        { year: 2021, migrationActualIndex: 34722.496664 },
        { year: 2022, migrationActualIndex: 33011.547218 },
        { year: 2023, migrationActualIndex: 48525.828057 }
    ]
};

// 加载中国和省份的数据
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
]).then(function (data_wxy2) {
    var chinaData_wxy2 = data_wxy2[0];
    var provincesData_wxy2 = data_wxy2.slice(1);

    chinaData_wxy2.features = chinaData_wxy2.features.filter(function (d_wxy2) {
        return d_wxy2.properties.name !== '南海诸岛' && d_wxy2.properties.name !== '十段线';
    });


    // 设置地图投影——地图大小
    var projection_wxy2 = d3.geoMercator()
        .center([105, 35])
        .scale(600)
        .translate([350, 350]);

    var path_wxy2 = d3.geoPath().projection(projection_wxy2);
    var svg_wxy2 = d3.select("#map_wxy2");

    // 绘制中国地图
    svg_wxy2.selectAll(".country_wxy2")
        .data(chinaData_wxy2.features)
        .enter().append("path")
        .attr("class", "country_wxy2")
        .attr("d", path_wxy2)
        .on("mouseover", function (event, d_wxy2) {
            d3.select(this).classed("hovered_wxy2", true);
        })
        .on("mouseout", function (event, d_wxy2) {
            d3.select(this).classed("hovered_wxy2", false);
        });

    // 绘制省份标签
    svg_wxy2.selectAll(".country-label_wxy2")
        .data(chinaData_wxy2.features)
        .enter().append("text")
        .attr("class", "label_wxy2 country-label_wxy2")
        .attr("transform", function (d_wxy2) {
            if (d_wxy2.properties.center) {
                var coords_wxy2 = projection_wxy2(d_wxy2.properties.center);
                return "translate(" + coords_wxy2 + ")";
            } else {
                console.warn("Center coordinates not defined for:", d_wxy2.properties.name);
                return "translate(0, 0)";
            }
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d_wxy2) {
            return d_wxy2.properties.name;
        })
        .on("mouseover", function (event, d_wxy2) {
            var provincePath_wxy2 = svg_wxy2.selectAll(".country_wxy2")
                .filter(function (p_wxy2) { return p_wxy2.properties.name === d_wxy2.properties.name; });
            provincePath_wxy2.classed("hovered_wxy2", true);
        })
        .on("mouseout", function (event, d_wxy2) {
            var provincePath_wxy2 = svg_wxy2.selectAll(".country_wxy2")
                .filter(function (p_wxy2) { return p_wxy2.properties.name === d_wxy2.properties.name; });
            provincePath_wxy2.classed("hovered_wxy2", false);
        });

    // 年份按钮点击事件
    d3.selectAll(".year-button_wxy2").on("click", function () {
        var year_wxy2 = d3.select(this).attr("data-year");
        currentIndex_wxy2 = years_wxy2.indexOf(year_wxy2);
        d3.selectAll(".year-button_wxy2").classed("active_wxy2", false);
        d3.select(this).classed("active_wxy2", true);
        if (migrationDataLoaded_wxy2) {
            updateCharts_wxy2(year_wxy2);
        }
    });

    // 绘制图例
    function drawLegend_wxy2(svg_wxy2, radiusScale_wxy2) {
        svg_wxy2.selectAll(".legend_wxy2").remove();
        var legend_wxy2 = svg_wxy2.append("g")
            .attr("class", "legend_wxy2")
            .attr("transform", "translate(600, 550)");

        var legendSizes_wxy2 = [1000, 5000, 10000, 20000];
        var legendLabels_wxy2 = ["1k", "5k", "10k", "20k"];

        legendSizes_wxy2.forEach(function (size_wxy2, index_wxy2) {
            legend_wxy2.append("circle")
                .attr("cx", 0)
                .attr("cy", -radiusScale_wxy2(size_wxy2))
                .attr("r", radiusScale_wxy2(size_wxy2))
                .attr("fill", "none")
                .attr("stroke", "gray");

            legend_wxy2.append("text")
                .attr("x", 10)
                .attr("y", -radiusScale_wxy2(size_wxy2 * 4))
                .attr("dy", "0.35em")
                .attr("text-anchor", "middle")
                .text(legendLabels_wxy2[index_wxy2])
                .style("font-size", "10px");
        });
    }

    // 更新地图数据
    function updateMap_wxy2(year_wxy2) {
        if (!migrationData_wxy2) {
            // console.error("Migration data is not loaded yet.");
            return;
        }

        svg_wxy2.selectAll(".city_wxy2").remove();

        const cities_wxy2 = [
            {
                name: "北京",
                coordinates: [116.4074, 39.9042],
                migrationActualIndex: citiesData_wxy2["北京"].find(d_wxy2 => d_wxy2.year == year_wxy2).migrationActualIndex
            },
            {
                name: "上海",
                coordinates: [121.4737, 31.2304],
                migrationActualIndex: citiesData_wxy2["上海"].find(d_wxy2 => d_wxy2.year == year_wxy2).migrationActualIndex
            },
            {
                name: "广州",
                coordinates: [113.2644, 23.1291],
                migrationActualIndex: citiesData_wxy2["广州"].find(d_wxy2 => d_wxy2.year == year_wxy2).migrationActualIndex
            }
        ];

        var filteredData_wxy2 = migrationData_wxy2.filter(d_wxy2 => d_wxy2.year === +year_wxy2);

        var top10Cities_wxy2 = filteredData_wxy2.sort((a_wxy2, b_wxy2) => b_wxy2.migrationActualIndex - a_wxy2.migrationActualIndex).slice(0, 10);
        console.log(`Top 10 cities by migration actual index in ${year_wxy2}:`, top10Cities_wxy2);

        var radiusScale_wxy2 = d3.scaleSqrt()
            .domain([0, maxMigrationIndex_wxy2])
            .range([0, 30]);

        drawLegend_wxy2(svg_wxy2, radiusScale_wxy2);

        var cityColor_wxy2 = {
            '北京': '#95AFCA',
            '上海': '#ED9A9B',
            '广州': '#F7BB80'
        };

        var cityGroups_wxy2 = {
            '北京': ['北京', '天津', '保定', '唐山', '廊坊', '石家庄', '秦皇岛', '张家口', '承德', '沧州', '衡水', '邢台', '邯郸', '安阳'],
            '上海': ['上海', '南京', '无锡', '常州', '苏州', '南通', '盐城', '扬州', '镇江', '泰州', '杭州', '宁波', '绍兴', '湖州', '嘉兴', '金华', '舟山', '台州', '温州', '合肥', '芜湖', '马鞍山', '铜陵', '安庆', '宣城', '池州', '滁州'],
            '广州': ['广州', '深圳', '佛山', '东莞', '中山', '惠州', '珠海', '江门', '肇庆', '韶关', '汕尾', '阳江', '河源', '清远', '云浮']
        };

        provincesData_wxy2.forEach(function (provinceData_wxy2, index_wxy2) {
            var provinceCityClass_wxy2 = "province-city" + index_wxy2;

            svg_wxy2.selectAll("." + provinceCityClass_wxy2)
                .data(provinceData_wxy2.features)
                .enter().append("circle")
                .attr("class", "city_wxy2 " + provinceCityClass_wxy2)
                .attr("transform", function (d_wxy2) {
                    if (d_wxy2.properties.center) {
                        var coords_wxy2 = projection_wxy2(d_wxy2.properties.center);
                        return "translate(" + coords_wxy2 + ")";
                    } else {
                        console.warn("Center coordinates not defined for:", d_wxy2.properties.name);
                        return "translate(0, 0)";
                    }
                })
                .attr("r", function (d_wxy2) {
                    var city_wxy2 = filteredData_wxy2.find(m_wxy2 => m_wxy2.startCity === d_wxy2.properties.name);
                    return city_wxy2 ? radiusScale_wxy2(city_wxy2.migrationActualIndex) : 0;
                })
                .attr("fill", function (d_wxy2) {
                    for (var key_wxy2 in cityGroups_wxy2) {
                        if (cityGroups_wxy2[key_wxy2].includes(d_wxy2.properties.name)) {
                            return cityColor_wxy2[key_wxy2];
                        }
                    }
                    return 'rgba(181, 193, 142, 0.7)';
                })
                .attr("opacity", 0.8)
                .on("mouseover", function (event, d_wxy2) {
                    var city_wxy2 = filteredData_wxy2.find(m_wxy2 => m_wxy2.startCity === d_wxy2.properties.name);
                    tooltip_wxy2.transition().duration(200).style("opacity", 0.9);
                    tooltip_wxy2.html(`城市名：${d_wxy2.properties.name}<br>迁徙指数: ${city_wxy2.migrationActualIndex.toFixed(2)}`)
                        .style("left", (event.pageX + 5) + "px")
                        .style("top", (event.pageY - 28) + "px");
                    d3.select(this).classed("hovered_wxy2", true);
                })
                .on("mouseout", function (event, d_wxy2) {
                    tooltip_wxy2.transition().duration(500).style("opacity", 0);
                    d3.select(this).classed("hovered_wxy2", false);
                });
        });

        // 绘制主要城市
        svg_wxy2.selectAll(".city-main_wxy2")
            .data(cities_wxy2)
            .enter().append("circle")
            .attr("class", "city_wxy2 city-main_wxy2")
            .attr("transform", function (d_wxy2) {
                var coords_wxy2 = projection_wxy2(d_wxy2.coordinates);
                return "translate(" + coords_wxy2 + ")";
            })
            .attr("r", function (d_wxy2) {
                return radiusScale_wxy2(d_wxy2.migrationActualIndex);
            })
            .attr("fill", function (d_wxy2) {
                if (d_wxy2.name === "北京") return "#95AFCA";
                if (d_wxy2.name === "上海") return "#ED9A9B";
                if (d_wxy2.name === "广州") return "#F7BB80";
            })
            .attr("opacity", 0.8)
            .on("mouseover", function (event, d_wxy2) {
                tooltip_wxy2.transition().duration(200).style("opacity", 0.9);
                tooltip_wxy2.html(`城市名：${d_wxy2.name}<br>迁徙指数: ${d_wxy2.migrationActualIndex.toFixed(2)}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).classed("hovered_wxy2", true);
            })
            .on("mouseout", function (event, d_wxy2) {
                tooltip_wxy2.transition().duration(500).style("opacity", 0);
                d3.select(this).classed("hovered_wxy2", false);
            });
    }

    var migrationData_wxy2;
    var maxMigrationIndex_wxy2;

    // 加载迁徙数据
    d3.csv('data/始发城市年度实际迁徙指数.csv').then(function (data_wxy2) {
        migrationData_wxy2 = data_wxy2.map(d_wxy2 => ({
            year: +d_wxy2.年份,
            startCity: d_wxy2.始发城市,
            migrationActualIndex: +d_wxy2.年度实际迁徙指数
        }));

        maxMigrationIndex_wxy2 = d3.max(migrationData_wxy2, d_wxy2 => d_wxy2.migrationActualIndex);

        migrationDataLoaded_wxy2 = true;
        updateCharts_wxy2("2023");
    }).catch(function (error_wxy2) {
        console.error('Error loading migration data:', error_wxy2);
    });

    // 播放按钮功能
    function play_wxy2() {
        if (playing_wxy2) {
            clearInterval(interval_wxy2);
            d3.select("#play-button_wxy2").html("&#9658;");
        } else {
            interval_wxy2 = setInterval(() => {
                currentIndex_wxy2 = (currentIndex_wxy2 + 1) % years_wxy2.length;
                updateCharts_wxy2(years_wxy2[currentIndex_wxy2]);
                d3.selectAll(".year-button_wxy2").classed("active_wxy2", false);
                d3.select(d3.selectAll(".year-button_wxy2").nodes()[currentIndex_wxy2]).classed("active_wxy2", true);
            }, 2000);
            d3.select("#play-button_wxy2").html("&#10074;&#10074;");
        }
        playing_wxy2 = !playing_wxy2;
    }

    // 播放、上一年、下一年按钮点击事件
    d3.select("#play-button_wxy2").on("click", play_wxy2);
    d3.select("#prev-button_wxy2").on("click", () => {
        currentIndex_wxy2 = (currentIndex_wxy2 - 1 + years_wxy2.length) % years_wxy2.length;
        updateCharts_wxy2(years_wxy2[currentIndex_wxy2]);
        d3.selectAll(".year-button_wxy2").classed("active_wxy2", false);
        d3.select(d3.selectAll(".year-button_wxy2").nodes()[currentIndex_wxy2]).classed("active_wxy2", true);
    });
    d3.select("#next-button_wxy2").on("click", () => {
        currentIndex_wxy2 = (currentIndex_wxy2 + 1) % years_wxy2.length;
        updateCharts_wxy2(years_wxy2[currentIndex_wxy2]);
        d3.selectAll(".year-button_wxy2").classed("active_wxy2", false);
        d3.select(d3.selectAll(".year-button_wxy2").nodes()[currentIndex_wxy2]).classed("active_wxy2", true);
    });

    // 条形图大小
    const barMargin_wxy2 = { top: 130, right: 30, bottom: 40, left: 90 },
        barWidth_wxy2 = 500 - barMargin_wxy2.left - barMargin_wxy2.right,
        barHeight_wxy2 = 550 - barMargin_wxy2.top - barMargin_wxy2.bottom;

    const barSvg_wxy2 = d3.select("#bar-chart_wxy2")
        .append("svg")
        .attr("width", barWidth_wxy2 + barMargin_wxy2.left + barMargin_wxy2.right)
        .attr("height", barHeight_wxy2 + barMargin_wxy2.top + barMargin_wxy2.bottom)
        .append("g")
        .attr("transform", `translate(${barMargin_wxy2.left},${barMargin_wxy2.top})`);

    // 更新柱形图数据
    let maxMigrationActualIndex_wxy2 = 0;

    d3.csv("data/气泡地图-柱形图数据.csv").then(data_wxy2 => {
        data_wxy2.forEach(d_wxy2 => {
            d_wxy2.年份 = +d_wxy2.年份;
            d_wxy2.年度实际迁徙指数 = +d_wxy2.年度实际迁徙指数;
            if (d_wxy2.年度实际迁徙指数 > maxMigrationActualIndex_wxy2) {
                maxMigrationActualIndex_wxy2 = d_wxy2.年度实际迁徙指数;
            }
        });

        // 更新条形图
        updateBarChart_wxy2("2023");
    });
    function updateBarChart_wxy2(year_wxy2) {
        d3.csv("data/气泡地图-柱形图数据.csv").then(data_wxy2 => {
            data_wxy2.forEach(d_wxy2 => {
                d_wxy2.年份 = +d_wxy2.年份;
                d_wxy2.年度实际迁徙指数 = +d_wxy2.年度实际迁徙指数;
            });

            const filteredData_wxy2 = data_wxy2.filter(d_wxy2 => d_wxy2.年份 == year_wxy2);
            filteredData_wxy2.sort((a_wxy2, b_wxy2) => b_wxy2.年度实际迁徙指数 - a_wxy2.年度实际迁徙指数);

            const xBar_wxy2 = d3.scaleLinear()
                .domain([0, maxMigrationActualIndex_wxy2])
                .range([0, barWidth_wxy2]);

            const yBar_wxy2 = d3.scaleBand()
                .range([0, barHeight_wxy2])
                .domain(filteredData_wxy2.map(d_wxy2 => d_wxy2.始发城市))
                .padding(0.4);

            barSvg_wxy2.selectAll("*").remove();

            barSvg_wxy2.append("g")
                .selectAll("rect")
                .data(filteredData_wxy2)
                .enter()
                .append("rect")
                .attr("x", xBar_wxy2(0))
                .attr("y", d_wxy2 => yBar_wxy2(d_wxy2.始发城市))
                .attr("width", d_wxy2 => xBar_wxy2(d_wxy2.年度实际迁徙指数))
                .attr("height", yBar_wxy2.bandwidth())
                .attr("fill", "rgb(181, 193, 142)");

            // 添加文本标注并保留两位小数
            barSvg_wxy2.append("g")
                .selectAll("text")
                .data(filteredData_wxy2)
                .enter()
                .append("text")
                .attr("x", d_wxy2 => {
                    const barLength = xBar_wxy2(d_wxy2.年度实际迁徙指数);
                    return barLength > 50 ? barLength - 5 : barLength + 5;
                })
                .attr("y", d_wxy2 => yBar_wxy2(d_wxy2.始发城市) + yBar_wxy2.bandwidth() / 2 + 4) // 文本垂直居中
                .attr("text-anchor", d_wxy2 => {
                    const barLength = xBar_wxy2(d_wxy2.年度实际迁徙指数);
                    return barLength > 50 ? "end" : "start";
                }) // 文字右对齐
                .attr("fill", d_wxy2 => {
                    const barLength = xBar_wxy2(d_wxy2.年度实际迁徙指数);
                    return barLength > 50 ? "white" : "black";
                }) // 文字颜色
                .text(d_wxy2 => d_wxy2.年度实际迁徙指数.toFixed(2)); // 保留两位小数

            barSvg_wxy2.append("g")
                .call(d3.axisLeft(yBar_wxy2));

            barSvg_wxy2.append("g")
                .attr("transform", `translate(0,${barHeight_wxy2})`)
                .call(d3.axisBottom(xBar_wxy2));
        });
    }


    // 更新图表数据
    function updateCharts_wxy2(year_wxy2) {
        if (!migrationDataLoaded_wxy2) {
            // console.error("Migration data is not loaded yet.");
            return;
        }
        updateMap_wxy2(year_wxy2);
        updateBarChart_wxy2(year_wxy2);
    }

    // 初始化图表
    updateCharts_wxy2("2023");

}).catch(function (error_wxy2) {
    console.error('Error loading or parsing data:', error_wxy2);
});