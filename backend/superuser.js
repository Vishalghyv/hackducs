module.exports=(records)=>{
    const manufacturers=records.map(manu=>{
        return `
        <form action="/superuser/${manu._id}?_method=DELETE" method="POST">
        <div>${manu.fullName}</div>
        <div>${manu.contactPhone}</div>
        <button>Delete</button>
        
        </form>
    <br>
     `
    }).join('');

    return `
    
    ${manufacturers}

    `
    
}