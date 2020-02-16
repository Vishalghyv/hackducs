module.exports={
    
    
    superUser:(who,record)=>{
                     return `
                     <form action="/superuser/${who}/${record._id}?_method=DELETE" method="POST">
                     <div>${record.fullName}</div>
                     <div>${record.contactPhone}</div>
                     <button>Delete</button>
        
                     </form>
                    <br>`
                },
            
        
           
    }

        