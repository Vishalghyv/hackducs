

module.exports=(ig)=>{

    const renderedimages=ig.images.map(image=>{
        return `<img style="width:300px; height:300px;"src="data:image/png;base64, ${image}">
                `
    }).join('');

    return `
    <div>${renderedimages}</div>
    <div>
    <h2>Product:${ig.product}</h2>
    <h4>Description:${ig.description}</h4>
    </div>
    `
}