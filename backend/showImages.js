

module.exports=(ig)=>{

    const renderedimages=ig.map(image=>{
        return `<img src="data:image/png;base64, ${image}">`
    }).join('\n');

    return `
    <div>${renderedimages}</div>
    `
}