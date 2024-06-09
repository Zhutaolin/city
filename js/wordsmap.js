// 绘制词树图
wordsmap();

function wordsmap() {
    // Specify the chart’s dimensions.
    const width = 1000;
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
        
    // Create a tooltip div that is hidden by default
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#FFEAE3")
        .style("border", "0")
        .style("padding", "10px")
        .style("border-radius", "8px")
        .style("text-align", "center")
        .style("font", "12px sans-serif")
        .style("box-shadow", "0px 0px 10px rgba(0, 0, 0, 0.1)")
        .style("pointer-events", "none")
        .style("opacity", 0);

    console.log(wordsdata);

    // Specify the color scale.
    const color = d3.scaleOrdinal(wordsdata.children.map(d => d.name), d3.schemeTableau10);

    // Compute the layout.
    const root = d3.treemap()
        .tile(d3.treemapBinary) // 不同的树图布局函数，其他的还有：d3.treemapSquarify
        .size([width, height])
        .padding(2)
        .round(true)
        (d3.hierarchy(wordsdata)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value));

    // Add a cell for each leaf of the hierarchy.
    const format = d3.format(",d");
    const leaf = svg.selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`)
        .on("mouseover", (event, d) => {
            const ancestors = d.ancestors().reverse().map(d => d.data.name);
            const secondLastAncestor = ancestors.length > 1 ? ancestors[ancestors.length - 2] : 'None';
            const value = format(d.value);
            tooltip.html(`<b>${d.data.name}</b><br>城市: ${secondLastAncestor}<br>词频: ${value}`)
                .style("opacity", 1);
        })
        .on("mousemove", (event) => {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.style("opacity", 0);
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
        .attr("transform", "translate(6,0)");

    const legendItemSize = 18;
    const legendSpacing = 4;
    const fontSize = 15;
    const categories = wordsdata.children.map(d => d.name);

    categories.forEach((category, i) => {
        const legendRow = legend.append("g")
            .attr("transform", `translate(${i * (legendItemSize + legendSpacing + 4 * fontSize + 40)}, 0)`)
            .style("vertical-align", "center");

        legendRow.append("rect")
            .attr("width", legendItemSize)
            .attr("height", legendItemSize)
            .attr("fill", color(category))
            .attr("fill-opacity", 0.6);

        legendRow.append("text")
            .attr("transform", `translate(0, 5)`)
            .attr("x", legendItemSize + legendSpacing)
            .attr("y", 10)
            .style("font-size", `${fontSize}px`)
            .text(category);
    });
};
