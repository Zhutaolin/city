// 绘制词树图
wordsmap();

function wordsmap() {
    // Specify the chart’s dimensions.
    const width = 1200;
    const height = 500;

    // Create the SVG container.
    const legend_svg = d3.select("#wordsmap").append("svg")
        .attr("id", "legend")
        .attr("width", width)
        .attr("height", 20);
    const svg = d3.select("#wordsmap").append("svg")
        .attr("id", "words")
        .attr("width", width)
        .attr("height", height);

    console.log(wordsdata)

    // Specify the color scale.
    const color = d3.scaleOrdinal(wordsdata.children.map(d => d.name), d3.schemeTableau10);

    // Compute the layout.
    const root = d3.treemap()
    .tile(d3.treemapBinary) // 不同的树图布局函数，其他的还有：d3.treemapSquarify
    .size([width, height])
    .padding(1)
    .round(true)
    (d3.hierarchy(wordsdata)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value));

    // Add a cell for each leaf of the hierarchy.
    const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);

    // // Append a tooltip.
    // const format = d3.format(",d");
    // leaf.append("title")
    //     // .text(d => `${d.ancestors().reverse().map(d => d.data.name).join(".")}\n${format(d.value)}`);
    //     .text(d => `${d.data.name}\n${format(d.value)}`);
    const format = d3.format(",d");
    leaf.append("title")
        .text(d => {
            const ancestors = d.ancestors().reverse().map(d => d.data.name);
            // 只取倒数第二个祖先节点
            const secondLastAncestor = ancestors.length > 1 ? ancestors[ancestors.length - 2] : 'None';
            const value = format(d.value);
            return `${d.data.name}\n城市: ${secondLastAncestor}\n词频: ${value}`;
    });

    // Append a color rectangle. 
    leaf.append("rect")
        .attr("id", d => (d.leafUid = svg.attr("id") + "-leaf-" + d.data.name))
        .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
        .attr("fill-opacity", 0.6)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);

    // Append a clipPath to ensure text does not overflow.
    leaf.append("clipPath")
        .attr("id", d => (d.clipUid = svg.attr("id") + "-clip-" + d.data.name))
    .append("use")
        .attr("xlink:href", d => d.leafUid.href);

    // Append multiline text. The last line shows the value and has a specific formatting.
    leaf.append("text")
        .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => {
        // Split the name into words and add the value as the last element
        const words = d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value));
        // Attach the value to each word for later use
        words.value = d.value;
        return words;
    })
    .join("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .attr("font-size", function(d, i, nodes) {
            // Access the value from the data
            const value = nodes[i].parentNode.__data__.value;
            return `${Math.sqrt(value)}px`; // Scale down the font size
        })
        .text(d => d);

    // Add legend
    const legend = legend_svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(3,0)");  // 3——对齐树图

    const legendItemSize = 18;
    const legendSpacing = 4;
    const fontSize = 15;
    const categories = wordsdata.children.map(d => d.name);

    categories.forEach((category, i) => {
        const legendRow = legend.append("g")       // 一个矩形     +  一个间距      +   四个字   + 一个大间距（暂定40）
            .attr("transform", `translate(${i * (legendItemSize + legendSpacing + 4*fontSize + 40)}, 0)`)
            .style("vertical-align", "center");

        legendRow.append("rect")
            .attr("width", legendItemSize)
            .attr("height", legendItemSize)
            .attr("fill", color(category))
            .attr("fill-opacity", 0.6);

        legendRow.append("text")
            .attr("transform", `translate(0, 5)`)		
            .attr("x", legendItemSize +legendSpacing)
            .attr("y", 10)
            .style("font-size", `${fontSize}px`)
            .text(category);
    });
};
